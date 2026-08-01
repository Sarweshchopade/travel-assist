import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { buildPlanPrompt } from "./agents/planPrompt.js";
import { generateJSON, chatReply, currentProvider, currentModel } from "./agents/llm.js";
import authRoutes from "./routes/auth.js";
import tripsRoutes from "./routes/trips.js";
import bookingRoutes from "./routes/booking.js";
import { optionalAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    provider: currentProvider(),
    model: currentModel(),
    dbConfigured: Boolean(process.env.DATABASE_URL),
    bookingConfigured: Boolean(process.env.DUFFEL_API_KEY),
  });
});

// Multi-agent trip generation. optionalAuth so we know who's asking without
// requiring an account just to generate a plan.
app.post("/api/plan", optionalAuth, async (req, res) => {
  try {
    const {
      destination,
      days,
      budget,
      currency = "INR",
      travelers = "2 adults",
      travelType = "Family",
      interests = "History, culture, food",
      foodPreference = "No preference",
      pace = "Balanced",
    } = req.body || {};

    if (!destination || !days || !budget) {
      return res
        .status(400)
        .json({ error: "destination, days and budget are required" });
    }

    const prompt = buildPlanPrompt({
      destination,
      days,
      budget,
      currency,
      travelers,
      travelType,
      interests,
      foodPreference,
      pace,
    });

    const plan = await generateJSON(prompt);
    res.json({ plan });
  } catch (err) {
    console.error("[/api/plan]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Conversational AI Chat Assistant agent
app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], tripContext = null } = req.body || {};
    if (!messages.length) {
      return res.status(400).json({ error: "messages[] is required" });
    }

    const system = `You are the AI Chat Assistant inside a personalized tourism app. Be warm, concise (2-4 sentences unless asked for detail), and specific to the traveler's trip. ${
      tripContext
        ? `Current trip context (JSON): ${JSON.stringify(tripContext).slice(
            0,
            4000
          )}`
        : "No trip has been generated yet, so speak generally and encourage them to plan one."
    }`;

    const reply = await chatReply(messages, system);
    res.json({ reply });
  } catch (err) {
    console.error("[/api/chat]", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripsRoutes);
app.use("/api/booking", bookingRoutes);

// Central error guard so a missing DATABASE_URL/JWT_SECRET etc. returns a
// clean JSON error instead of crashing the process.
app.use((err, _req, res, _next) => {
  console.error("[unhandled]", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`AI Travel Assistant API running on http://localhost:${PORT}`);
  console.log(`AI provider: ${currentProvider()} (model: ${currentModel()})`);
  console.log(
    `Database: ${process.env.DATABASE_URL ? "configured" : "NOT configured (accounts/saved trips disabled)"}`
  );
  console.log(
    `Booking (Duffel): ${
      process.env.DUFFEL_API_KEY ? "configured" : "NOT configured (live hotel/flight search disabled)"
    }`
  );
});
