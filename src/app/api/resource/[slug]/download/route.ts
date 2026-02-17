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

  // Final Robust Download Strategy
  try {
    const publicId = downloadToken.resource.pdfCloudinaryPublicId;
    
    // Generate a simple secure URL (no signature for now to guarantee access)
    // We use the direct Cloudinary URL format
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const directUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/${publicId}`;

    return NextResponse.redirect(directUrl);
  } catch (err: any) {
    console.error("General Download Error:", err);
    return NextResponse.json({ 
      error: "Unexpected Download Failure", 
      details: err.message
    }, { status: 500 });
  }
}
