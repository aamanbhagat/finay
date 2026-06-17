"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatINR } from "@/lib/utils";

interface Point {
  year: number;
  invested: number;
  value: number;
}

/** Stacked area: principal invested (navy) + projected value (gold). */
export function GrowthChart({ data }: { data: Point[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="value-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.55} />
              <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="invested-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b6b7f" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#5b6b7f" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
            unit="y"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-muted)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : `${(v / 1e5).toFixed(0)}L`)}
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              fontSize: 12,
            }}
            labelFormatter={(year) => `Year ${year}`}
            formatter={(value, name) => [
              formatINR(Number(value)),
              name === "value" ? "Projected" : "Invested",
            ]}
          />
          <Area
            type="monotone"
            dataKey="invested"
            stroke="#5b6b7f"
            strokeWidth={1.5}
            fill="url(#invested-fill)"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-gold)"
            strokeWidth={2}
            fill="url(#value-fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
