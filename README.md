# Image Salon

A full-stack web application for Image Salon built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database + Auth)
- EmailJS (Email notifications)
- Vercel (Deployment)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
   pnpm install
```
3. Copy `.env.local` and fill in your environment variables
4. Run the development server:
```bash
   pnpm dev
```

## Environment Variables
| Variable | Description |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key |
| NEXT_PUBLIC_EMAILJS_SERVICE_ID | EmailJS service ID |
| NEXT_PUBLIC_EMAILJS_TEMPLATE_ID | EmailJS template ID |
| NEXT_PUBLIC_EMAILJS_PUBLIC_KEY | EmailJS public key |