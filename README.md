# Pathwright

Paste a PRD or feature spec → get a mapped user flow and the edge cases it's
missing, before it reaches design review. (Working name — rename freely
before you ship; "Pathwright" is just a placeholder, not associated with
any existing product.)

This is a working v1 of the core engine: the AI generation loop runs
end-to-end today. Auth, persistence, and billing are scaffolded with clear
next steps below — wire those in before charging real users.

## Run it locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000. Paste a spec, hit Generate.

Get an API key at https://console.anthropic.com.

## What's already working

- Full generate pipeline: spec text → Claude → structured JSON → rendered
  flow + categorized edge cases + open questions
- Basic in-memory rate limiting per IP (20 requests/hour) so a stray crawler
  or abuse can't run up your API bill — replace this before launch, see below
- A visual design system (ink/paper/signal palette, Space Grotesk + Inter +
  JetBrains Mono) distinct from generic AI-tool defaults

## What's NOT done yet (your next milestones, in order)

### 1. Auth + persistence (Supabase)
Right now nothing is saved — every generation is thrown away on refresh.

- Create a free project at https://supabase.com
- Add Supabase auth (email/magic link is fastest to ship)
- Add a `generations` table: `id, user_id, spec_text, result_json, created_at`
- Save each generation on success, add a `/history` page that lists past ones
- This is also where you enforce real usage limits tied to plan tier,
  replacing the IP-based rate limit in `app/api/generate/route.ts`

### 2. Billing (Stripe)
- Create a Stripe account, add one Product with a monthly Price (e.g. $15-19/mo)
- Use Stripe Checkout for the upgrade flow, Stripe Customer Portal for
  cancel/manage
- Add a `stripe_customer_id` and `plan` column to your Supabase `users` table
- Add a webhook handler (`/api/stripe/webhook`) that listens for
  `checkout.session.completed` and `customer.subscription.deleted` to flip
  the `plan` column
- Gate generation count by plan: e.g. free = 3/month, paid = unlimited

### 3. Deploy
- Push to GitHub, import the repo into Vercel, add your env vars in the
  Vercel dashboard, deploy
- Point a domain at it (Vercel handles DNS instructions)

### 4. After that, in priority order
- Export generated flow as Markdown/PDF (you already have the docx/pdf
  patterns from this conversation's toolkit if you want to extend that)
- Team workspaces (shared history, shared billing seat)
- A second input mode (e.g. screenshot or URL capture) once you've validated
  people pay for the PRD-to-flow loop specifically

## Why this scope, not the full Figr feature set

Figr ships ~15 modules (context graph, Figma sync, screen recording
analysis, analytics ingestion, etc.). Building all of that before anyone's
paid you for the core loop is the most common way solo SaaS projects stall.
This scaffold deliberately ships ONE sharp wedge — PRD/spec → flow + edge
cases — all the way to "a stranger could pay for this," so you find out fast
whether the wedge itself has demand before expanding.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Anthropic Claude API (`claude-sonnet-4-6`)
- Supabase (auth + Postgres) — to be wired in
- Stripe (billing) — to be wired in
- Vercel (hosting)
