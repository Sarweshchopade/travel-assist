// Builds the orchestrator system prompt that asks Claude to reason as
// eight specialised travel agents and return one structured JSON payload.
// Doing this as a single, well-structured call (rather than 8 separate
// round trips) keeps latency and cost sane while still genuinely having
// the model produce distinct, agent-attributed reasoning for each domain.

export function buildPlanPrompt({
  destination,
  days,
  budget,
  currency,
  travelers,
  travelType,
  interests,
  foodPreference,
  pace,
}) {
  return `You are a multi-agent AI travel planning system for Indian & international tourism. You simulate EIGHT specialist agents that collaborate on one trip brief:

1. Planner Agent - builds the day-wise itinerary
2. Booking Agent - recommends hotels (realistic names/style for the destination, plausible prices, ratings)
3. Budget Agent - allocates and tracks the total budget across categories
4. Culture Agent - shares etiquette, history, and must-try local food
5. Safety Agent - emergency numbers, nearest hospital type, safety tips
6. Language Agent - 3 useful local phrases with English + phonetic transliteration
7. Event Agent - local festivals/events/markets happening around the trip dates
8. Concierge Agent - a short warm welcome message summarizing the plan

TRIP BRIEF
Destination: ${destination}
Duration: ${days} days
Total budget: ${currency} ${budget}
Travelers: ${travelers}
Travel type: ${travelType}
Interests: ${interests}
Food preference: ${foodPreference}
Pace: ${pace}

Respond with ONLY valid JSON (no markdown fences, no commentary) matching EXACTLY this shape:

{
  "destination": "string",
  "days": number,
  "welcomeMessage": "string, 1-2 warm sentences from the Concierge Agent",
  "itinerary": [
    { "day": number, "title": "string", "summary": "string", "activities": ["string", "string", "string"] }
  ],
  "hotels": [
    { "name": "string", "area": "string", "pricePerNight": number, "rating": number, "amenities": ["string"], "recommended": boolean }
  ],
  "budget": {
    "total": number,
    "currency": "${currency}",
    "categories": [
      { "name": "Hotels", "amount": number },
      { "name": "Food", "amount": number },
      { "name": "Transport", "amount": number },
      { "name": "Activities", "amount": number }
    ],
    "tip": "string, one money-saving tip"
  },
  "culture": {
    "about": "string, 2-3 sentences",
    "etiquette": ["string", "string", "string"],
    "mustTryFood": [ { "name": "string", "description": "string" } ]
  },
  "safety": {
    "emergencyNumber": "string",
    "nearestHospitalType": "string",
    "touristPoliceNumber": "string",
    "tips": ["string", "string", "string"]
  },
  "language": {
    "localLanguage": "string",
    "phrases": [ { "phrase": "string", "translation": "string", "pronunciation": "string" } ]
  },
  "events": [
    { "name": "string", "date": "string", "location": "string", "description": "string" }
  ],
  "route": [
    { "name": "string", "lat": number, "lng": number, "time": "string" }
  ]
}

Rules:
- "route" must contain ${Math.min(Number(days) * 2, 8)} realistic stop points for the itinerary with real-world plausible latitude/longitude for ${destination}.
- Budget category amounts must sum to approximately the total budget.
- Keep arrays concise: itinerary has exactly ${days} entries, hotels has 3 entries, mustTryFood has 4 entries, phrases has 4 entries, events has 3 entries.
- All numbers are plain numbers, not strings.
- Output raw JSON only.`;
}
