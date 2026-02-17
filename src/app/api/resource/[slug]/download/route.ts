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

  // Generate a signed URL that bypasses the 401 restriction
  try {
    const signedUrl = cloudinary.utils.private_download_url(
      downloadToken.resource.pdfCloudinaryPublicId,
      'pdf',
      {
        resource_type: 'raw',
        flags: 'attachment', // Forces download
        expires_at: Math.floor(Date.now() / 1000) + 600 // 10 minutes from now
      }
    );

    return NextResponse.redirect(signedUrl);
  } catch (err: any) {
    console.error("Cloudinary signing error:", err);
    return NextResponse.json({ 
      error: "Failed to generate download link", 
      details: err.message 
    }, { status: 500 });
  }
}
