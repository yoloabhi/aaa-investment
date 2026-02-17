import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

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

  // Log the download (multiple downloads in 10 mins allowed)
  await db.resourceDownload.create({
    data: {
      resourceId: downloadToken.resourceId,
      leadId: downloadToken.leadId,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    }
  });

  // Fetch PDF from Cloudinary and stream it
  try {
    console.log("Proxying PDF from:", downloadToken.resource.pdfUrl);
    
    // Set a timeout for the fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds

    const pdfResponse = await fetch(downloadToken.resource.pdfUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!pdfResponse.ok) {
      console.error(`Cloudinary fetch failed: ${pdfResponse.status} ${pdfResponse.statusText}`);
      throw new Error(`Cloudinary file not found: ${pdfResponse.status}`);
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${downloadToken.resource.slug}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    console.error("PDF proxy error:", err);
    return NextResponse.json({ 
      error: "Failed to fetch document", 
      details: err.name === 'AbortError' ? "Request timed out" : err.message,
      url: downloadToken.resource.pdfUrl 
    }, { status: 500 });
  }
}
