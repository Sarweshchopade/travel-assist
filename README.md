# Yatra AI — AI Personalized Tourism Assistant

A multi-page React application where a "multi-agent" AI system (Planner, Booking,
Weather, Budget, Culture, Safety, Language, Event, Concierge agents) plans a trip
end-to-end — itinerary, hotel picks, live weather, budget tracking, culture &
safety notes, local phrases, nearby events, a route map, an AI chat assistant,
and analytics — plus real flight/hotel search, user accounts with saved trip
history, and a mobile app preview page.

```
travel-assistant/
├── client/                 React 18 + Vite + Tailwind v4 + Framer Motion + Recharts
├── server/                 Express API: AI agents, auth, trips DB, live booking
│   ├── agents/
│   │   ├── llm.js            Provider switcher (Gemini free tier / Anthropic)
│   │   ├── gemini.js         Google Gemini integration (default, free)
│   │   ├── planPrompt.js     The multi-agent orchestration prompt
│   │   └── duffel.js         Real flight/hotel search (Amadeus's free-tier
│   │                          replacement — see "Real booking data" below)
│   ├── db/                  Postgres schema + connection pool + migration script
│   ├── middleware/           JWT auth middleware
│   └── routes/                auth.js, trips.js, booking.js
├── .github/workflows/ci.yml  Lint + build + smoke-test on every push/PR
└── render.yaml              One-click Render blueprint for the backend
```

## What's real vs. AI-generated

| Feature | Source |
|---|---|
| Itinerary, culture notes, safety tips, language phrases, event picks | Generated live by an LLM, structured per-agent (`server/agents/planPrompt.js`) |
| AI Chat Assistant | Live conversation, aware of your generated trip |
| Weather | Real forecast from [Open-Meteo](https://open-meteo.com) (free, no key) |
| Map | Real OpenStreetMap embed of AI-picked route stops (free, no key) |
| **Flight search** (Flights page) | **Real** live search via [Duffel](https://duffel.com) (free sandbox, 300+ airlines) |
| **Hotel inventory** (Hotels page → "Live hotel inventory") | **Real** hotel listings via Duffel Stays (free sandbox) |
| Accounts, saved trips | Real Postgres database, JWT sessions, bcrypt-hashed passwords |

## AI provider: free by default (Google Gemini)

This app supports two AI providers, switched automatically based on which key
you set:

- **Google Gemini** (default, recommended) — genuinely free, no credit card,
  via [Google AI Studio](https://aistudio.google.com/apikey). Generous daily
  quota for a project like this, and Gemini's native JSON mode makes the
  structured trip-plan output very reliable.
- **Anthropic Claude** — higher quality, but pay-as-you-go; needs a funded
  account at [console.anthropic.com](https://console.anthropic.com).

Set `GEMINI_API_KEY` to use Gemini, or `ANTHROPIC_API_KEY` to use Claude. If
both are set, Gemini wins by default — force a specific one with
`LLM_PROVIDER=gemini` or `LLM_PROVIDER=anthropic` in `server/.env`.

## Real booking data: Duffel (Amadeus's self-service API was shut down)

Amadeus permanently decommissioned its self-service developer portal on
17 July 2026 — self-service keys were disabled, and only their
sales-mediated Enterprise tier remains. This app uses **Duffel** instead,
which is the standard modern replacement: instant self-serve signup, no sales
call, a free unlimited test mode (`duffel_test_...` keys) backed by a sandbox
airline ("Duffel Airways") for realistic route/schedule data, plus real hotel
inventory via Duffel Stays.

Get a free token in under a minute: [app.duffel.com/join](https://app.duffel.com/join)
→ Developers → Access tokens.

> Test-mode keys return realistic route structure and sandbox pricing, not
> bookable live fares. Switch to a `duffel_live_...` key (paid) for real
> bookable pricing.

## 1. Run it locally

### Backend

```bash
cd server
cp .env.example .env
npm install
```

Fill in `server/.env`:
- `GEMINI_API_KEY` — free, from https://aistudio.google.com/apikey (or use
  `ANTHROPIC_API_KEY` instead if you prefer Claude and have API credits)
- `DATABASE_URL` — optional, needed for accounts/saved trips. Easiest free
  option: create a project at [neon.tech](https://neon.tech) or
  [supabase.com](https://supabase.com) and paste the connection string it gives you.
- `JWT_SECRET` — optional, any random string, needed alongside `DATABASE_URL`
- `DUFFEL_API_KEY` — optional, needed for the Flights page and live hotel
  search. Free instantly at https://app.duffel.com/join

Then, if you set `DATABASE_URL`, create the tables once:

```bash
npm run migrate
```

Start the API:

```bash
npm run dev        # http://localhost:8787
```

Every feature works independently — if you skip `DATABASE_URL` or
`DUFFEL_API_KEY`, the app still runs fine; just accounts/saved-trips or live
booking search are disabled with a clear message instead of a crash.

### Frontend

```bash
cd client
cp .env.example .env    # VITE_API_URL defaults to http://localhost:8787
npm install
npm run dev              # http://localhost:5173
```

Open http://localhost:5173, click **Plan your trip**, fill the form, and the
agents generate a real itinerary. Sign up from the landing page nav to unlock
saving trips.

## 2. Deploy it

You're deploying **three** things at most (skip the ones you don't need):

### A. Database → Neon or Supabase (free)

1. Create a project at [neon.tech](https://neon.tech) (fastest) or [supabase.com](https://supabase.com).
2. Copy the Postgres connection string.
3. Run `DATABASE_URL="<that string>" npm run migrate` once, from your machine or
   from the Render shell after deploying the backend (step B).

### B. Backend → Render (or Railway / Fly.io / any Node host)

1. Push this repo to GitHub.
2. On [Render](https://render.com), **New → Blueprint**, point it at this repo —
   it reads `render.yaml` automatically. Or create a Web Service manually with:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
3. Add environment variables in the Render dashboard: `GEMINI_API_KEY` (or
   `ANTHROPIC_API_KEY`), `DATABASE_URL`, `JWT_SECRET`, `DUFFEL_API_KEY`, and
   `CLIENT_ORIGIN` (set after step C, then redeploy).
4. Note the resulting URL, e.g. `https://yatra-ai-server.onrender.com`.
5. **Free-tier note:** Render's free web services spin down after inactivity —
   the first request after idle can take 30–60 seconds to wake back up. That's
   expected, not a bug.

### C. Frontend → Vercel (or Netlify)

1. On [Vercel](https://vercel.com), **New Project** → import the repo → set
   **Root Directory** to `client`.
2. Add environment variable `VITE_API_URL` = your Render backend URL from step B.
3. Deploy. Vercel auto-detects Vite; `vercel.json` handles client-side routing.

   **Netlify alternative**: base directory `client`, build command `npm run build`,
   publish directory `dist`, same `VITE_API_URL` env var, plus a `_redirects`
   file containing `/* /index.html 200` if you're not using `vercel.json`.
4. **Use your project's stable domain**, not the random per-deploy preview URL.
   In Vercel this is your production deployment's `<project-name>.vercel.app`
   address (find it on the project's Overview page, next to the "Production"
   deployment) — it stays the same across pushes, unlike preview URLs like
   `your-project-abc123-yourteam.vercel.app`, which change on every deploy.
5. Go back to Render and set `CLIENT_ORIGIN` to that stable Vercel URL exactly
   (no trailing slash) so CORS allows it, then redeploy the backend.

Both Vercel and Render redeploy automatically on every `git push` to `main` —
that's your continuous deployment, no extra config needed.

## 3. CI/CD

`.github/workflows/ci.yml` runs on every push and pull request to `main`:
- **Client job**: `npm ci` → `npm run lint` (oxlint) → `npm run build` (Vite)
- **Server job**: installs deps, syntax-checks every `.js` file, boots the
  server and hits `/api/health` as a smoke test

This is intentionally infrastructure-agnostic: it catches breakage before merge,
while Vercel/Render handle actual deployment via their own GitHub integration
(no deploy secrets needed in Actions).

## Troubleshooting

- **"Network Error" generating a trip** — almost always CORS. Open browser
  DevTools → Console. If you see `blocked by CORS policy`, the origin shown
  doesn't match `CLIENT_ORIGIN` on Render — update it to your exact frontend
  URL (see step C.4–5 above) and redeploy.
- **"Your credit balance is too low"** — this is Anthropic billing, not a bug.
  Either fund your Anthropic account at console.anthropic.com → Billing, or
  switch to the free Gemini provider by setting `GEMINI_API_KEY` on Render
  (Gemini is used automatically once that key is present).
- **`Cannot GET /` on your backend URL** — expected. The API only defines
  routes under `/api/...`, not a homepage. Check `/api/health` instead.
- **First request is very slow** — Render's free tier sleeps after inactivity;
  the first request wakes it up and can take up to a minute.

## Notes

- Trip data is cached in `sessionStorage`, so refreshing a dashboard page
  doesn't lose your generated plan (guests) — logged-in users can hit **Save
  trip** on the Overview page to persist it to Postgres and revisit it under
  **My Trips**.
- Auth uses bcrypt-hashed passwords and JWTs (30-day expiry) sent as a Bearer
  token — no cookies, so it works cleanly across the separate frontend/backend
  domains typical of this deploy setup.
- If neither AI key is set, `/api/plan` and `/api/chat` return a clear error
  that surfaces in the UI. Same pattern for missing `DATABASE_URL` (auth
  routes) and missing `DUFFEL_API_KEY` (booking routes) — nothing crashes silently.
