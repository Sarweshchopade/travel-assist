// Real flight search via Duffel — the standard self-serve replacement for
// Amadeus's self-service API, which Amadeus fully decommissioned on
// 17 July 2026 (self-service keys were disabled; only their sales-mediated
// Enterprise portal remains). Duffel's test mode is free indefinitely and
// returns realistic route/schedule structure via its "Duffel Airways"
// sandbox airline. Get a free token at https://app.duffel.com (Developers →
// Access Tokens) — no sales call required.
//
// Docs: https://duffel.com/docs/api/overview/welcome

const BASE_URL = "https://api.duffel.com";
const DUFFEL_VERSION = "v2";

function getToken() {
  const token = process.env.DUFFEL_API_KEY;
  if (!token) {
    throw new Error(
      "DUFFEL_API_KEY is not set. Get a free token at https://app.duffel.com (Developers → Access Tokens)."
    );
  }
  return token;
}

async function duffelRequest(path, { method = "GET", body, query } = {}) {
  const url = new URL(BASE_URL + path);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });
  }

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Duffel-Version": DUFFEL_VERSION,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) {
    const message =
      json?.errors?.map((e) => e.message).join("; ") ||
      `Duffel request failed with status ${res.status}`;
    throw new Error(message);
  }
  return json;
}

export async function searchFlights({
  originLocationCode,
  destinationLocationCode,
  departureDate,
  returnDate,
  adults = 1,
}) {
  const slices = [
    {
      origin: originLocationCode,
      destination: destinationLocationCode,
      departure_date: departureDate,
    },
  ];
  if (returnDate) {
    slices.push({
      origin: destinationLocationCode,
      destination: originLocationCode,
      departure_date: returnDate,
    });
  }

  const passengers = Array.from({ length: Number(adults) || 1 }, () => ({
    type: "adult",
  }));

  const { data } = await duffelRequest("/air/offer_requests", {
    method: "POST",
    query: { return_offers: true },
    body: { data: { cabin_class: "economy", slices, passengers } },
  });

  const offers = data.offers || [];

  return offers.slice(0, 10).map((offer) => {
    const slice = offer.slices[0];
    const firstSeg = slice.segments[0];
    const lastSeg = slice.segments[slice.segments.length - 1];
    return {
      id: offer.id,
      price: offer.total_amount,
      currency: offer.total_currency,
      airline: firstSeg.operating_carrier?.name || firstSeg.marketing_carrier?.name,
      stops: slice.segments.length - 1,
      duration: slice.duration || "",
      departure: { code: firstSeg.origin.iata_code, at: firstSeg.departing_at },
      arrival: { code: lastSeg.destination.iata_code, at: lastSeg.arriving_at },
      liveMode: Boolean(offer.live_mode),
    };
  });
}

// Free geocoding (no key) — turns a city name into coordinates for Duffel
// Stays, which searches by geographic location rather than city codes.
async function geocodeCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    cityName
  )}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.results?.length) {
    throw new Error(`Could not find a location matching "${cityName}"`);
  }
  const r = json.results[0];
  return { latitude: r.latitude, longitude: r.longitude, name: r.name, country: r.country };
}

export async function searchHotelsByCity(cityName, { checkInDate, checkOutDate, guests = 2, rooms = 1 } = {}) {
  const place = await geocodeCity(cityName);

  const { data } = await duffelRequest("/stays/search", {
    method: "POST",
    body: {
      data: {
        location: {
          geographic_coordinates: { latitude: place.latitude, longitude: place.longitude },
          radius: 15,
        },
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        guests: Array.from({ length: Number(guests) || 1 }, () => ({ type: "adult" })),
        rooms: Number(rooms) || 1,
      },
    },
  });

  const results = data.results || data.accommodation || [];

  return {
    place: { name: place.name, country: place.country },
    hotels: results.slice(0, 12).map((r) => ({
      id: r.id,
      name: r.accommodation?.name || r.name,
      rating: r.accommodation?.rating,
      cheapestPrice: r.cheapest_rate_total_amount,
      currency: r.cheapest_rate_currency,
      location: r.accommodation?.location?.address?.city_name,
    })),
  };
}
