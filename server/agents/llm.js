// Picks which AI provider powers the agents, based on what's configured.
// Defaults to Gemini (free tier, no credit card) if GEMINI_API_KEY is set;
// falls back to Anthropic if ANTHROPIC_API_KEY is set instead. Set
// LLM_PROVIDER=anthropic explicitly to force Anthropic even if both are set.

import Anthropic from "@anthropic-ai/sdk";
import * as gemini from "./gemini.js";

function activeProvider() {
  const forced = process.env.LLM_PROVIDER;
  if (forced) return forced;
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "gemini"; // will throw a clear "missing key" error when called
}

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set on the server. Add it to server/.env");
  }
  return new Anthropic({ apiKey });
}

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export function currentProvider() {
  return activeProvider();
}

export function currentModel() {
  return activeProvider() === "gemini"
    ? process.env.GEMINI_MODEL || "gemini-2.5-flash"
    : process.env.CLAUDE_MODEL || "claude-sonnet-5";
}

// Structured JSON generation — used for the multi-agent trip plan.
export async function generateJSON(prompt) {
  if (activeProvider() === "gemini") {
    return gemini.generateJSON(prompt);
  }

  const client = getAnthropicClient();
  const message = await client.messages.create({
    model: process.env.CLAUDE_MODEL || "claude-sonnet-5",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });
  const textBlock = message.content.find((b) => b.type === "text");
  return extractJson(textBlock.text);
}

// Conversational reply — used for the AI Chat Assistant.
export async function chatReply(messages, systemPrompt) {
  if (activeProvider() === "gemini") {
    return gemini.chatReply(messages, systemPrompt);
  }

  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || "claude-sonnet-5",
    max_tokens: 600,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "";
}
