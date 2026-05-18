# Zendu

Calm, focused learning. Browse short topic-based learning paths made of YouTube modules,
mark each one complete, and finish with an AI-generated 5-question quiz.

Built with React + Vite, Tailwind, Supabase (auth + data), and a Vercel serverless
function calling the Anthropic API for quiz generation.

## Run locally

```bash
npm install
npm run dev
```

Create a `.env.local` with:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...   # only needed for the /api/quiz function
```

The app works without Supabase configured — topics fall back to a seed list and
progress is saved in `localStorage`. Quiz generation always requires
`ANTHROPIC_API_KEY` set on the serverless function.

To run the quiz API locally, use the Vercel CLI:

```bash
npx vercel dev
```

## Supabase setup

Run `supabase/schema.sql` in the Supabase SQL editor. It creates the four tables,
enables RLS, and seeds the three sample topics with their modules.

## Deploy

Push to GitHub and import into Vercel. Set the three env vars in the project settings.

## Prompt

The original spec is in [`PROMPTS.txt`](./PROMPTS.txt).
