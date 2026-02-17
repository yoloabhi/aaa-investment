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

  // Generate a signed URL that bypasses restrictions
  try {
    // For 'raw' resources, we use the general url() generator with sign_url: true
    // this is more reliable for PDFs than private_download_url
    const signedUrl = cloudinary.url(downloadToken.resource.pdfCloudinaryPublicId, {
      resource_type: 'raw',
      sign_url: true,
      secure: true,
      flags: 'attachment',
      // Ensure we try both 'upload' and 'authenticated' if needed, 
      // but 'upload' is the default for signed uploads
      type: 'upload' 
    });

    console.log("Generated Signed URL:", signedUrl);
    return NextResponse.redirect(signedUrl);
  } catch (err: any) {
    console.error("Cloudinary signing error:", err);
    return NextResponse.json({ 
      error: "Failed to generate download link", 
      details: err.message,
      id: downloadToken.resource.pdfCloudinaryPublicId
    }, { status: 500 });
  }
}
