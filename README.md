# TaskForge AI – AI-Powered Skill Marketplace for Micro-Tasks 🚀

**TaskForge AI** is a production-ready SaaS web application where companies post high-level projects, AI automatically decomposes them into bite-sized micro-tasks with budget allocations, freelancers complete tasks based on AI skill matching, and Stripe handles secure project funding, escrow holding simulation, and transfers/payouts.

---

## 🌟 Key Features

### 1. 🤖 AI Capabilities
- **AI Project Breakdown**: Takes a high-level prompt (e.g. *"Build a food delivery website"*) and generates balanced micro-tasks with budget allocations in ₹, deadlines, and skill tags using Gemini AI.
- **AI Skill Matching**: Analyzes freelancer resume text, GitHub profile, and skills to output match scores (0-100%) and task recommendations.
- **AI Submission Verification**: Audits code quality, completeness, documentation, and missing files to generate an automated **Quality Score (0-100)** before company approval.
- **AI Fraud & Security Detection**: Detects duplicate repositories, spam links, AI-generated fake work, and suspicious submission velocity.

### 2. 💳 Stripe Payments & Escrow Flow
- **Stripe Checkout**: Collects upfront project funding from companies and holds it safely in escrow. Also handles ₹499/month Pro subscription billing.
- **Stripe Connect**: Express account onboarding for freelancers to verify identity and connect bank accounts.
- **Stripe Transfers**: Releases task budget automatically to the freelancer's connected Stripe account upon company approval.
- **Stripe Webhooks**: Listens for `checkout.session.completed`, `payment_intent.succeeded`, `transfer.created`, `payout.paid`, and `account.updated` events.

### 3. 👥 User Roles & Dashboards
- **Company Dashboard**: Post projects, trigger AI breakdowns, fund project escrow via Stripe, review AI quality scores, and approve payouts.
- **Freelancer Dashboard**: View AI-matched micro-tasks, submit work deliverables, track quality scores, connect Stripe accounts, and monitor payouts.
- **Admin Panel**: Manage platform users, view gross volume analytics & charts, and moderate active disputes (Refund Company vs Payout Freelancer).

---

## 🏗️ Folder Structure

```
taskForge/
├── app/
│   ├── api/
│   │   ├── disputes/              # Disputes API & Admin resolution
│   │   ├── projects/              # Project creation & AI breakdown trigger
│   │   ├── stripe/
│   │   │   ├── checkout/          # Checkout session creator
│   │   │   ├── connect/           # Stripe Connect onboarding
│   │   │   ├── transfer/          # Payout transfer handler
│   │   │   └── webhooks/          # Stripe webhooks listener
│   │   ├── submissions/           # Work submission & AI verification check
│   │   └── tasks/                 # Task browsing & AI skill matching
│   ├── dashboard/
│   │   ├── admin/                 # Admin Moderation & Analytics Panel
│   │   ├── company/               # Company Escrow & Project Dashboard
│   │   └── freelancer/            # Freelancer Tasks & Payouts Dashboard
│   ├── globals.css                # Glassmorphism & modern Tailwind CSS
│   ├── layout.tsx                 # Root layout & Clerk Provider wrapper
│   └── page.tsx                   # Landing Page & Interactive AI Demo
├── components/
│   ├── navbar.tsx                 # Navigation bar with Role Switcher
│   ├── footer.tsx                 # Footer component
│   └── ui/                        # Card, Button, Badge, Input, Progress
├── lib/
│   ├── ai/
│   │   ├── gemini.ts              # Gemini SDK wrapper
│   │   ├── project-breakdown.ts   # Feature 1: AI Project Breakdown
│   │   ├── skill-matching.ts      # Feature 2: AI Skill Matching
│   │   ├── submission-verification.ts # Feature 3: Quality Audit Score
│   │   └── fraud-detection.ts     # Feature 4: Security Audit
│   ├── stripe/
│   │   └── client.ts              # Stripe SDK server instance
│   ├── auth.ts                    # Session & Role authorization
│   ├── prisma.ts                  # Prisma Client singleton
│   └── utils.ts                   # Utility functions & currency formatter
├── prisma/
│   ├── schema.prisma              # Database Schema & Relational Models
│   └── seed.ts                    # Seed Data Script
├── .env.example                   # Environment Variables Guide
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts
- **Backend**: Next.js Server Actions & API Routes, Node.js
- **Database & ORM**: Prisma ORM with SQLite (Local zero-dependency dev) & PostgreSQL (Supabase/Neon ready)
- **Authentication**: Clerk Authentication (`@clerk/nextjs`) with local dev role switcher fallback
- **AI Engine**: Gemini API (`@google/genai` / `gemini-2.5-flash`)
- **Payments**: Stripe Checkout, Stripe Connect, Stripe Transfers, Stripe Webhooks

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env` and fill in your API keys:

```env
# Database Connection
DATABASE_URL="file:./dev.db"

# Clerk Auth Keys (https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_sample_key"
CLERK_SECRET_KEY="sk_test_sample_key"

# Gemini AI Key (https://aistudio.google.com)
GEMINI_API_KEY="AIzaSy_sample_gemini_key"

# Stripe Keys (https://dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_sample_stripe_pub_key"
STRIPE_SECRET_KEY="sk_test_sample_stripe_sec_key"
STRIPE_WEBHOOK_SECRET="whsec_sample_stripe_webhook_secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## ⚡ Quickstart & Local Setup

Run the following commands in your terminal:

```bash
# 1. Install dependencies
npm install

# 2. Push Prisma schema & generate client
npx prisma db push

# 3. Seed database with realistic sample data
npx prisma db seed

# 4. Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set Environment Variables (`DATABASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GEMINI_API_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).
4. Set Build Command: `npx prisma generate && next build`.
5. Deploy!
