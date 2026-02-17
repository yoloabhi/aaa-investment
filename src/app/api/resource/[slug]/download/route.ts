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

  // Secure Server-Side Proxy with Diagnostics
  try {
    const publicId = downloadToken.resource.pdfCloudinaryPublicId;
    
    // 1. Diagnostic: Check environment variables
    const config = {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      has_secret: !!process.env.CLOUDINARY_API_SECRET,
    };

    if (!config.has_secret) {
      throw new Error("Missing CLOUDINARY_API_SECRET in environment");
    }

    // 2. Diagnostic: Get resource metadata to verify credentials
    let resource;
    try {
      resource = await cloudinary.api.resource(publicId, { 
        resource_type: 'raw' 
      });
    } catch (apiErr: any) {
      console.error("Cloudinary API Metadata Error:", apiErr);
      return NextResponse.json({
        error: "Cloudinary API Authorization Failed",
        message: apiErr.message,
        http_code: apiErr.http_code,
        config_check: {
          cloud_name: config.cloud_name,
          api_key: config.api_key,
          secret_present: config.has_secret
        }
      }, { status: 401 });
    }

    // 3. Generate a signed URL for the fetch
    // We use the SDK to ensure the signature is 100% correct
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      sign_url: true,
      secure: true,
      type: resource.type || 'upload'
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const pdfResponse = await fetch(signedUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      return NextResponse.json({
        error: "Cloudinary Content Fetch Failed",
        status: pdfResponse.status,
        statusText: pdfResponse.statusText,
        attempted_url: signedUrl,
        response_snippet: errorText.substring(0, 200)
      }, { status: pdfResponse.status });
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
    console.error("General Download Error:", err);
    return NextResponse.json({ 
      error: "Unexpected Download Failure", 
      details: err.message,
      id: downloadToken.resource.pdfCloudinaryPublicId
    }, { status: 500 });
  }
}
