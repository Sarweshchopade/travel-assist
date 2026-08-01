// Google Gemini via the free Google AI Studio tier — no credit card needed.
// Get a key instantly at https://aistudio.google.com/apikey
//
// Free tier (subject to Google's published limits, currently generous for a
// prototype/personal project): Flash-class models, ~1,500 requests/day.
// Pro-series models are paid-only, so we default to a Flash model.

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

function getModel() {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

function getKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey"
    );
  }
  return key;
}

async function callGemini(body) {
  const url = `${BASE_URL}/models/${getModel()}:generateContent?key=${getKey()}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(
      `Gemini returned a non-JSON response (status ${res.status}). This usually means a network/proxy issue reaching generativelanguage.googleapis.com, not a code bug.`
    );
  }

  if (!res.ok) {
    const message = json?.error?.message || `Gemini request failed with status ${res.status}`;
    throw new Error(message);
  }
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  if (!text) {
    throw new Error("Gemini returned an empty response (it may have been blocked by safety filters).");
  }
  return text;
}

// Generates structured JSON using Gemini's native JSON mode — much more
// reliable than asking a model to "please only return JSON" in plain text.
export async function generateJSON(prompt) {
  const text = await callGemini({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  });
  return JSON.parse(text);
}

// Multi-turn chat. `messages` is [{ role: "user"|"assistant", content }].
export async function chatReply(messages, systemPrompt) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = { contents };
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  return callGemini(body);
}
