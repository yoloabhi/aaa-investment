import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { resend } from '@/lib/resend';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  interestedIn: z.string().optional(),
  message: z.string().min(5),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, phone, interestedIn, message } = result.data;

    // Store in DB
    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone,
        interestedIn: interestedIn || "General Inquiry",
        message,
        source: "contact_form",
      },
    });

    // Send Email Notification
    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      await resend.emails.send({
        from: 'AAA Contact <onboarding@resend.dev>', // Update this with verified domain later
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: `New Lead: ${name}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Interested In:</strong> ${interestedIn}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    }

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
