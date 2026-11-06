# Hanisy Collection

React + Vite + Tailwind CSS + Supabase storefront.

## Local setup

1. Install Node.js 20.19+ (Vite 8 requirement).
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in the Supabase project URL, anon key, and WhatsApp number.
4. Run `npm run dev`.
5. Run `npm run build` to create the production build.

## Supabase

- Keep the existing `products`, `categories`, and `product_detail_images` tables and the existing Storage bucket.
- Apply the additive SQL migration in `supabase/migrations` to add the featured flag and testimonials table.
- Create admin users through Supabase Auth; public sign-up is not part of this app.

## Deploy to Vercel

Import this repository, set the three Vite environment variables in Vercel Project Settings, and deploy. The included `vercel.json` rewrites SPA routes to `index.html`.

Never commit a real `.env` file or Supabase service-role key.
