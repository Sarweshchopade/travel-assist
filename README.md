# Yatra AI — Multi-Agent AI Personalized Tourism Assistant

**A full-stack, production-deployed travel planning platform where a
multi-agent AI system generates a complete personalized trip — itinerary,
budget, culture, safety, language, and live bookings — from a single user
prompt.**

🔗 **Live demo:** 

## Overview

Yatra AI turns a short trip brief ("4 days in Jaipur, ₹25,000 budget, love
history and vegetarian food") into a fully personalized, multi-page travel
dashboard. Instead of a single AI response, the backend orchestrates **nine
specialized agent roles** — Planner, Booking, Weather, Budget, Culture,
Safety, Language, Event, and Concierge — into one coordinated generation,
each producing a distinct, structured part of the trip plan.

The app is a complete product, not a demo: real user accounts, a real
database, real third-party data (live weather, real flight/hotel search),
and a CI pipeline — deployed and live on the public internet.

## Key Features

- **Multi-agent AI trip generation** — one orchestrated prompt produces a
  structured JSON plan spanning itinerary, hotel picks, budget allocation,
  cultural etiquette, safety info, local phrases, and nearby events
- **Provider-agnostic AI layer** — automatically routes between Google
  Gemini (free tier) and Anthropic Claude, selectable via environment
  config with zero code changes, so the app isn't locked to one vendor
- **Live AI chat assistant** — a second conversational agent, context-aware
  of the generated trip, for follow-up questions
- **Real-time weather** — live forecasts via Open-Meteo, geocoded per
  destination
- **Real flight & hotel search** — live search against Duffel's flight/hotel
  API (300+ airlines), independent of the AI-generated recommendations
- **Interactive route map** — AI-picked stops rendered on an embedded
  OpenStreetMap route
- **Full accounts system** — signup/login with bcrypt-hashed passwords and
  JWT sessions, saved trip history backed by PostgreSQL
- **13-page responsive dashboard** — itinerary, hotels, flights, weather,
  budget (with charts), culture, events, safety, language, chat, map,
  analytics, and a mobile app preview — with animated transitions throughout
- **CI pipeline** — GitHub Actions lints, builds, and smoke-tests both the
  frontend and backend on every push

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4, Framer Motion, Recharts, React Router |
| Backend | Node.js, Express |
| Database | PostgreSQL (raw parameterized SQL, no ORM) |
| Auth | JWT + bcrypt |
| AI | Google Gemini / Anthropic Claude (provider-agnostic abstraction) |
| Live data | Duffel (flights/hotels), Open-Meteo (weather), OpenStreetMap (routing) |
| CI/CD | GitHub Actions, Vercel (frontend), Render (backend) |

## Architecture

```
React SPA (Vercel)  ─────HTTPS/JSON────▶  Express API (Render)
                                              │
                     ┌────────────────────────┼─────────────────────────┐
                     ▼                        ▼                         ▼
            LLM provider layer          PostgreSQL              Duffel API
         (Gemini free tier / Claude)   (users, trips)        (flights, hotels)
                     │
             Multi-agent prompt
          (Planner/Booking/Weather/
         Budget/Culture/Safety/...)
```

- The frontend never talks to the AI provider or database directly — all
  secrets stay server-side, with the client only calling the Express API.
- The **multi-agent generation** is one carefully structured LLM call that
  produces a single JSON payload with a distinct, labeled section per agent
  role — balancing the "multiple specialist agents" product experience
  against the latency/cost of truly independent API calls.
- Real-time weather and mapping are fetched independently of the AI, so
  those stay accurate regardless of what the LLM generates.

## Engineering Highlights

A few things worth calling out for a technical conversation about this project:

- **Vendor resilience by design.** When Amadeus (the original flight/hotel
  API) permanently shut down its self-service developer tier mid-project, I
  re-architected the booking integration around Duffel without touching any
  UI logic — the API layer was already isolated behind a clean internal
  interface. Similarly, the AI layer supports hot-swapping providers
  (Gemini ↔ Claude) via a single environment variable, so a pricing change,
  rate limit, or model deprecation on one provider doesn't take the app down.
- **Structured LLM output at scale.** The trip-generation prompt enforces a
  strict JSON schema across nine data domains in a single request, using
  native JSON mode where available (Gemini) for reliability rather than
  fragile prompt-based formatting instructions.
- **Auth designed for split-domain deployment.** Frontend and backend are
  deployed to different domains (Vercel + Render), so auth uses Bearer-token
  JWTs rather than cookies, sidestepping cross-site cookie/CORS complexity
  entirely.
- **Fails loud, not silent.** Every external dependency (AI provider,
  database, booking API) is optional at the code level and produces a clear,
  specific error message when unconfigured or unreachable, rather than a
  generic crash — the app degrades gracefully feature-by-feature.

## What This Project Demonstrates

Full-stack ownership from UI to database to third-party API integration to
deployment: React component architecture and animation, REST API design,
relational schema design, authentication/security fundamentals, working
with multiple external APIs under real-world constraints (rate limits,
deprecations, provider outages), and shipping to production with CI/CD
rather than stopping at "runs on my machine."

*Built by [Your Name] — [your portfolio/LinkedIn link]*
