import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3, Wallet, CalendarDays, MapPin, TrendingUp } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { Panel } from "../../components/Panel";

const COLORS = ["#e8a33d", "#21b39a", "#7fb2f0", "#c1654a", "#a78bfa"];

export default function Analytics() {
  const { plan } = useTrip();
  if (!plan) return null;

  const categories = plan.budget?.categories || [];
  const total = plan.budget?.total || 0;
  const spent = categories.reduce((s, c) => s + Number(c.amount || 0), 0);
  const perDay = plan.days ? Math.round(spent / plan.days) : 0;
  const activityCount = plan.itinerary?.reduce((s, d) => s + (d.activities?.length || 0), 0) || 0;
  const topCategory = [...categories].sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile icon={Wallet} label="Total spend" value={`₹${spent.toLocaleString("en-IN")}`} color="#e8a33d" />
        <StatTile icon={TrendingUp} label="Avg per day" value={`₹${perDay.toLocaleString("en-IN")}`} color="#21b39a" />
        <StatTile icon={CalendarDays} label="Planned activities" value={activityCount} color="#7fb2f0" />
        <StatTile icon={MapPin} label="Top spend category" value={topCategory?.name || "—"} color="#c1654a" />
      </div>

      <Panel title="Expense breakdown" icon={BarChart3}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories} margin={{ left: -20 }}>
              <CartesianGrid stroke="#2a3364" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#9aa3c7" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9aa3c7" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#131a3f",
                  border: "1px solid #2a3364",
                  borderRadius: 10,
                  color: "#f6f3ec",
                }}
                formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Amount"]}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {categories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Budget utilization" delay={0.1}>
        <div className="flex items-center gap-6">
          <div>
            <p className="font-display text-3xl text-paper">
              {total ? Math.round((spent / total) * 100) : 0}%
            </p>
            <p className="text-xs text-mist">of ₹{Number(total).toLocaleString("en-IN")} used</p>
          </div>
          <div className="flex-1 h-2.5 rounded-full bg-surface-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal to-marigold"
              style={{ width: `${total ? Math.min(100, (spent / total) * 100) : 0}%` }}
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, color }) {
  return (
    <div className="card-glass rounded-2xl p-5 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, color }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-mist">{label}</p>
        <p className="font-display text-lg text-paper truncate">{value}</p>
      </div>
    </div>
  );
}
