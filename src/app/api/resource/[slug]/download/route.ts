import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';
import cloudinary from '@/lib/cloudinary';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const downloadToken = await db.downloadToken.findUnique({
    where: { tokenHash },
    include: { resource: true }
  });

  if (!downloadToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  if (downloadToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 410 });
  }

  // Log the download
  await db.resourceDownload.create({
    data: {
      resourceId: downloadToken.resourceId,
      leadId: downloadToken.leadId,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    }
  });

  // Secure Server-Side Proxy
  try {
    // Generate a signed URL (private)
    const signedUrl = cloudinary.url(downloadToken.resource.pdfCloudinaryPublicId, {
      resource_type: 'raw',
      sign_url: true,
      secure: true,
      type: 'upload' 
    });

    console.log("Proxying fetch from Cloudinary...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s for larger PDFs

    const pdfResponse = await fetch(signedUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!pdfResponse.ok) {
      throw new Error(`Cloudinary responded with ${pdfResponse.status}`);
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${downloadToken.resource.slug}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error("PDF proxy error:", err);
    return NextResponse.json({ 
      error: "Download failed", 
      details: err.message,
      hint: "Try re-uploading the resource if this persists"
    }, { status: 500 });
  }
}
