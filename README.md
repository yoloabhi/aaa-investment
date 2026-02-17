# AAA Investment & Insurance - Premium Web Application

A production-ready Next.js 15 application for AAA Investment & Insurance, featuring a high-end fintech UI, admin dashboard, and gated lead magnet downloads.

## Tech Stack
- **Framework:** Next.js 15 (App Router, TypeScript)
- **UI/UX:** Tailwind CSS, shadcn/ui, Framer Motion
- **Database:** Prisma ORM, Neon Postgres
- **Auth:** Auth.js (NextAuth v5) with Google OAuth
- **Assets:** Cloudinary (Images & PDFs)
- **Email:** Resend (Lead Notifications)

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory:

```env
# Database (Neon Postgres)
DATABASE_URL="your_neon_db_url"

# Authentication (Auth.js)
NEXTAUTH_SECRET="run_openssl_rand_hex_32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_id"
GOOGLE_CLIENT_SECRET="your_google_secret"
# Admin emails separated by comma
ADMIN_EMAIL_ALLOWLIST="acaaainvestment@gmail.com,your-email@gmail.com"

# Cloudinary (Signed Uploads)
CLOUDINARY_CLOUD_NAME="your_name"
CLOUDINARY_API_KEY="your_key"
CLOUDINARY_API_SECRET="your_secret"

# Resend (Email Notifications)
RESEND_API_KEY="your_resend_key"
ADMIN_NOTIFICATION_EMAIL="acaaainvestment@gmail.com"
```

### 2. Installation & Database
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed # Run the seed script for initial data
```

### 3. Cloudinary Configuration
- Create a Cloudinary account.
- In Settings > Upload, create an **Unsigned Upload Preset** (referenced in the upload component).
- Ensure your signature endpoint is protected (handled in the app).

### 4. Deployment (Vercel)
1. Push code to GitHub.
2. Link repository to Vercel.
3. Add all environment variables in Vercel Dashboard.
4. Update `NEXTAUTH_URL` to your production domain.
5. In Google Cloud Console, add your Vercel URL to the "Authorized Redirect URIs" (e.g., `https://your-app.vercel.app/api/auth/callback/google`).

## Dynamic Features
- **Contact Form:** Stores leads in DB and notifies admin via Resend.
- **Lead Magnets:** secure, single-use, time-limited download tokens for PDFs.
- **Admin Portal:** Securely manage team, gallery, news, and resources.
- **Markdown Blog:** Write posts in Markdown with live preview.

## Moving to Custom Domain
1. Add domain in Vercel.
2. Update `NEXTAUTH_URL` in env vars.
3. Update Google OAuth Authorized Domains and Redirect URIs.
4. Update `from` address in Resend if using a custom domain.

---
© 2026 AAA Investment & Insurance
```