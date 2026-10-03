# 🌸 NAQSH by Farjana — Deployment & Setup Guide

This guide walks you through setting up your **Supabase Database** and deploying the **NAQSH by Farjana** e-commerce store onto **Cloudflare Pages**.

---

## 1. 🗄️ Supabase Backend Setup

1. **Create a Supabase Account & Project**:
   - Go to [https://supabase.com](https://supabase.com) and create a free project named `naqsh-store`.
   - Choose your nearest database region (e.g. *Singapore* or *Mumbai* for fast latency to Bangladesh).

2. **Execute the Database Schema**:
   - In your Supabase dashboard, click on the **SQL Editor** tab on the left sidebar.
   - Click **New Query**.
   - Copy the entire contents of [`supabase/schema.sql`](file:///home/masum/naqsh/supabase/schema.sql) and paste it into the editor.
   - Click **Run**.
   - This will automatically create:
     - `categories` table with starter collections.
     - `products` table with seed Jamdanis, 3-piece suits, and bridal couture.
     - `orders` and `order_items` tables.
     - Row Level Security (RLS) policies and performance indexes.

3. **Obtain API Keys**:
   - Go to **Project Settings** → **API**.
   - Copy the following values:
     - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
     - **anon / public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role key** (keep secret!): `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. ⚡ Local Development & Testing

1. Create a `.env.local` file from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
2. Paste your Supabase credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_SECRET_KEY=naqsh2026
   ```
3. Run the local dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. ☁️ Hosting on Cloudflare Pages

### Option A: Via Cloudflare Dashboard (Recommended)

1. Push your project to a GitHub repository:
   ```bash
   git add .
   git commit -m "Initial commit for NAQSH by Farjana store"
   git branch -M main
   git remote add origin https://github.com/your-username/naqsh.git
   git push -u origin main
   ```
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your repository `naqsh`.
4. Configure Build settings:
   - **Framework preset**: `Next.js` (or `None`)
   - **Build command**: `npx @cloudflare/next-on-pages@1`
   - **Build output directory**: `.vercel/output/static`
   - **Node.js compatibility flag**: `nodejs_compat` (set `NODE_VERSION` to `20` in Environment variables)
5. Add the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-service-role-key`
   - `ADMIN_SECRET_KEY`: `naqsh2026`
6. Click **Save and Deploy**.

### Option B: Via Cloudflare Wrangler CLI

```bash
npx wrangler pages project create naqsh-by-farjana
npm run build
npx wrangler pages deploy .next
```

---

## 4. 👑 Boutique Manager Portal (Admin)

- Access the Admin Portal at `/admin` (e.g. `https://your-site.pages.dev/admin` or `http://localhost:3000/admin`).
- Default Passcode: `naqsh2026` (configurable in `ADMIN_SECRET_KEY`).
- In the portal, you can:
  - View all incoming customer orders with recipient details and address.
  - Verify **bKash** and **Nagad** TrxIDs.
  - Update order statuses (*Pending* → *Confirmed* → *Quality Packaging* → *In Transit / Courier* → *Delivered*).
  - Directly click to WhatsApp or call the customer.
  - View revenue analytics and inventory stock counts.

---

## 5. 🌸 Connecting with Your Facebook Page

- Official Page: [https://www.facebook.com/NAQSH.by.Farjana/](https://www.facebook.com/NAQSH.by.Farjana/)
- Customers can click **"Message on Facebook"** or **"Chat on Messenger"** (`https://m.me/NAQSH.by.Farjana`) to start an instant discussion regarding any outfit.
