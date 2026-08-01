import { Router } from "express";
import { searchFlights, searchHotelsByCity } from "../agents/duffel.js";

const router = Router();

router.get("/flights", async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, adults } = req.query;
    if (!origin || !destination || !departureDate) {
      return res
        .status(400)
        .json({ error: "origin, destination and departureDate are required" });
    }
    const flights = await searchFlights({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      returnDate,
      adults: adults ? Number(adults) : 1,
    });
    res.json({ flights });
  } catch (err) {
    console.error("[/api/booking/flights]", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/hotels", async (req, res) => {
  try {
    const { city, checkInDate, checkOutDate, guests, rooms } = req.query;
    if (!city || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ error: "city, checkInDate and checkOutDate are required" });
    }
    const result = await searchHotelsByCity(city, {
      checkInDate,
      checkOutDate,
      guests: guests ? Number(guests) : 2,
      rooms: rooms ? Number(rooms) : 1,
    });
    res.json(result);
  } catch (err) {
    console.error("[/api/booking/hotels]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
