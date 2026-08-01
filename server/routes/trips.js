import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All trip routes require a logged-in user.
router.use(requireAuth);

router.post("/", async (req, res) => {
  try {
    const { tripInput, plan, weather } = req.body || {};
    if (!tripInput || !plan) {
      return res.status(400).json({ error: "tripInput and plan are required" });
    }

    const result = await query(
      `INSERT INTO trips (user_id, destination, days, budget, currency, trip_input, plan, weather)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, destination, days, budget, currency, created_at`,
      [
        req.user.id,
        plan.destination || tripInput.destination,
        plan.days || tripInput.days,
        tripInput.budget,
        tripInput.currency || "INR",
        JSON.stringify(tripInput),
        JSON.stringify(plan),
        weather ? JSON.stringify(weather) : null,
      ]
    );

    res.status(201).json({ trip: result.rows[0] });
  } catch (err) {
    console.error("[POST /api/trips]", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, destination, days, budget, currency, created_at
       FROM trips WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ trips: result.rows });
  } catch (err) {
    console.error("[GET /api/trips]", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, destination, days, budget, currency, trip_input, plan, weather, created_at
       FROM trips WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Trip not found" });

    const row = result.rows[0];
    res.json({
      trip: {
        id: row.id,
        destination: row.destination,
        days: row.days,
        budget: row.budget,
        currency: row.currency,
        createdAt: row.created_at,
        tripInput: row.trip_input,
        plan: row.plan,
        weather: row.weather,
      },
    });
  } catch (err) {
    console.error("[GET /api/trips/:id]", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await query(
      "DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Trip not found" });
    res.json({ deleted: true });
  } catch (err) {
    console.error("[DELETE /api/trips/:id]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
