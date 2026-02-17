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

  // Secure Server-Side Proxy using Admin API
  try {
    const publicId = downloadToken.resource.pdfCloudinaryPublicId;
    console.log("Attempting Admin API fetch for:", publicId);

    // Verify config is loaded
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error("CLOUDINARY_API_SECRET is not defined in environment");
    }

    // Use the Admin API to get the resource details
    // This verifies our credentials are working
    const resource = await cloudinary.api.resource(publicId, { 
      resource_type: 'raw' 
    });

    if (!resource || !resource.secure_url) {
      throw new Error("Resource metadata found but URL is missing");
    }

    console.log("Resource found, proxying content from secure URL...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const pdfResponse = await fetch(resource.secure_url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!pdfResponse.ok) {
      throw new Error(`Proxy fetch failed: ${pdfResponse.status} ${pdfResponse.statusText}`);
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
    
    // Fallback: If it's a 401, it's definitely credentials. 
    // If it's a 404, the ID in the database is wrong.
    return NextResponse.json({ 
      error: "Download failed", 
      details: err.message,
      status: err.http_code || 500,
      id: downloadToken.resource.pdfCloudinaryPublicId
    }, { status: err.http_code || 500 });
  }
}
