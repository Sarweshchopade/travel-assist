import { motion } from "framer-motion";
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
} from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { Panel, EmptyState } from "../../components/Panel";
import { describeWeatherCode } from "../../api/weather";

const ICONS = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-fog": CloudFog,
  "cloud-drizzle": CloudRain,
  "cloud-rain": CloudRain,
  "cloud-rain-wind": CloudRain,
  "cloud-snow": CloudSnow,
  "cloud-lightning": CloudLightning,
};

function WeatherIcon({ code, ...props }) {
  const { icon } = describeWeatherCode(code);
  const Icon = ICONS[icon] || Cloud;
  return <Icon {...props} />;
}

export default function Weather() {
  const { weather, tripInput } = useTrip();

  if (!weather) {
    return (
      <EmptyState
        icon={CloudSun}
        title="Weather unavailable"
        description="We couldn't fetch live weather for this destination. The rest of your trip is unaffected."
      />
    );
  }

  const { place, forecast } = weather;
  const current = forecast.current;
  const daily = forecast.daily;

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-mist mb-1">
              {place.name}, {place.country} · Weather Agent
            </p>
            <div className="flex items-center gap-4">
              <WeatherIcon code={current.weather_code} size={48} className="text-marigold" />
              <div>
                <p className="font-display text-5xl text-paper">
                  {Math.round(current.temperature_2m)}°C
                </p>
                <p className="text-sm text-mist">
                  {describeWeatherCode(current.weather_code).label} · Feels like{" "}
                  {Math.round(current.apparent_temperature)}°C
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <Stat icon={Droplets} label="Humidity" value={`${current.relative_humidity_2m}%`} />
            <Stat icon={Wind} label="Wind" value={`${Math.round(current.wind_speed_10m)} km/h`} />
            <Stat icon={Thermometer} label="Feels like" value={`${Math.round(current.apparent_temperature)}°C`} />
          </div>
        </div>
      </Panel>

      <Panel title={`${tripInput?.days || daily.time.length}-day forecast`} icon={CloudSun} delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {daily.time.map((date, i) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl bg-surface-2/60 border border-border p-4 text-center"
            >
              <p className="text-xs text-mist mb-2">
                {new Date(date).toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
              </p>
              <WeatherIcon code={daily.weather_code[i]} size={26} className="mx-auto text-teal" />
              <p className="text-sm text-paper mt-2 font-semibold">
                {Math.round(daily.temperature_2m_max[i])}° / {Math.round(daily.temperature_2m_min[i])}°
              </p>
              <p className="text-[11px] text-mist mt-1">
                {daily.precipitation_probability_max[i]}% rain
              </p>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon size={16} className="text-mist mx-auto mb-1" />
      <p className="text-sm text-paper font-semibold">{value}</p>
      <p className="text-[11px] text-mist">{label}</p>
    </div>
  );
}
