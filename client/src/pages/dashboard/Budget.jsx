import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, Lightbulb } from "lucide-react";
import { useTrip } from "../../context/TripContext";
import { Panel } from "../../components/Panel";

const COLORS = ["#e8a33d", "#21b39a", "#7fb2f0", "#c1654a", "#a78bfa"];

export default function Budget() {
  const { plan } = useTrip();
  if (!plan?.budget) return null;

  const { total, currency, categories, tip } = plan.budget;
  const spent = categories.reduce((s, c) => s + Number(c.amount || 0), 0);
  const pct = total ? Math.min(100, Math.round((spent / total) * 100)) : 0;

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-5">
        <Panel title="Budget tracker" icon={Wallet}>
          <p className="text-xs text-mist mb-1">Total budget</p>
          <p className="font-display text-4xl text-paper mb-4">
            {currency} {Number(total).toLocaleString("en-IN")}
          </p>
          <div className="w-full h-2.5 rounded-full bg-surface-2 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal to-marigold transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-mist">
            {currency} {spent.toLocaleString("en-IN")} spent · {pct}% of budget
          </p>

          <div className="mt-5 space-y-2">
            {categories.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-paper">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {c.name}
                </span>
                <span className="text-mist">{currency} {Number(c.amount).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Spend by category" delay={0.1}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#131a3f",
                    border: "1px solid #2a3364",
                    borderRadius: 10,
                    color: "#f6f3ec",
                  }}
                  formatter={(v) => [`${currency} ${Number(v).toLocaleString("en-IN")}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {tip && (
        <Panel className="flex items-start gap-3" delay={0.15}>
          <div className="w-9 h-9 rounded-lg bg-teal/15 text-teal flex items-center justify-center shrink-0">
            <Lightbulb size={17} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-mist mb-1">Budget Agent tip</p>
            <p className="text-sm text-paper">{tip}</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
