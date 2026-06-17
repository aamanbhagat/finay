"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatINR, formatINRCompact } from "@/lib/utils";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
}

/** Donut with a center total + value legend. Used for invested-vs-returns splits. */
export function DonutChart({ data, centerLabel = "Total" }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <div className="relative h-60 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={72}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "var(--shadow-md)",
              }}
              formatter={(value) => formatINR(Number(value))}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            {centerLabel}
          </span>
          <span className="tnum mt-1 font-display text-2xl font-medium tracking-tight text-foreground">
            {formatINRCompact(total)}
          </span>
        </div>
      </div>

      <ul className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
        {data.map((d) => (
          <li key={d.name} className="inline-flex items-center gap-2">
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-muted">{d.name}</span>
            <span className="tnum font-semibold text-foreground">{formatINRCompact(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
