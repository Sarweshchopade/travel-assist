// Real weather via Open-Meteo — free, no API key required.
// Docs: https://open-meteo.com/

const WEATHER_CODES = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mostly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud-sun" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Fog", icon: "cloud-fog" },
  48: { label: "Depositing fog", icon: "cloud-fog" },
  51: { label: "Light drizzle", icon: "cloud-drizzle" },
  53: { label: "Drizzle", icon: "cloud-drizzle" },
  55: { label: "Dense drizzle", icon: "cloud-drizzle" },
  61: { label: "Light rain", icon: "cloud-rain" },
  63: { label: "Rain", icon: "cloud-rain" },
  65: { label: "Heavy rain", icon: "cloud-rain" },
  71: { label: "Light snow", icon: "cloud-snow" },
  73: { label: "Snow", icon: "cloud-snow" },
  75: { label: "Heavy snow", icon: "cloud-snow" },
  80: { label: "Rain showers", icon: "cloud-rain-wind" },
  81: { label: "Rain showers", icon: "cloud-rain-wind" },
  82: { label: "Violent showers", icon: "cloud-rain-wind" },
  95: { label: "Thunderstorm", icon: "cloud-lightning" },
  96: { label: "Thunderstorm w/ hail", icon: "cloud-lightning" },
  99: { label: "Severe thunderstorm", icon: "cloud-lightning" },
};

export function describeWeatherCode(code) {
  return WEATHER_CODES[code] || { label: "Unknown", icon: "cloud" };
}

export async function geocodeCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name
  )}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding request failed");
  const data = await res.json();
  if (!data.results || !data.results.length) {
    throw new Error(`Could not find location "${name}"`);
  }
  const r = data.results[0];
  return {
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  };
}

export async function fetchForecast(latitude, longitude, days = 4) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&forecast_days=${days}&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Forecast request failed");
  return res.json();
}

export async function getDestinationWeather(destinationName, days = 4) {
  const place = await geocodeCity(destinationName);
  const forecast = await fetchForecast(place.latitude, place.longitude, days);
  return { place, forecast };
}
