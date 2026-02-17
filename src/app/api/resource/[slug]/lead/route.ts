import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  city: z.string().min(2),
  interestedIn: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const resource = await db.resource.findUnique({
      where: { slug }
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const { name, email, phone, city, interestedIn } = result.data;

    // Create or Update Lead
    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone,
        city,
        interestedIn: interestedIn || "Both",
        source: "resource_download",
        resourceId: resource.id,
      },
    });

    // Generate Secure Token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.downloadToken.create({
      data: {
        resourceId: resource.id,
        leadId: lead.id,
        tokenHash,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true, token: rawToken });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
