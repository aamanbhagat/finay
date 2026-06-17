"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { InputRow } from "@/components/tools/input-row";
import { ResultSummary } from "@/components/tools/result-summary";
import { useUrlNumberState } from "@/lib/use-url-state";
import { calculateCompoundInterest } from "@/lib/finance";
import { formatINR } from "@/lib/utils";

const GrowthChart = dynamic(
  () => import("@/components/tools/growth-chart").then((m) => m.GrowthChart),
  { ssr: false, loading: () => <div className="h-72 animate-pulse rounded-lg bg-surface" /> },
);

const DEFAULTS = { principal: 100000, rate: 8, years: 20, freq: 12 };

export function CompoundInterestCalculator() {
  const [state, set] = useUrlNumberState(DEFAULTS);

  const result = useMemo(
    () =>
      calculateCompoundInterest({
        principal: state.principal,
        annualRatePct: state.rate,
        years: state.years,
        compoundingPerYear: (state.freq === 1 || state.freq === 2 || state.freq === 4
          ? state.freq
          : 12) as 1 | 2 | 4 | 12,
      }),
    [state],
  );

  // Map to GrowthChart shape (invested = principal flat line for visual reference).
  const chartData = result.series.map((p) => ({
    year: p.year,
    invested: state.principal,
    value: p.value,
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-xl border border-border bg-surface-2 p-6 sm:p-7">
        <InputRow
          label="Principal"
          value={state.principal}
          min={1000}
          max={10000000}
          step={1000}
          onChange={set.principal}
          currency
        />
        <InputRow
          label="Annual rate"
          value={state.rate}
          min={1}
          max={30}
          step={0.25}
          onChange={set.rate}
          suffix="%"
        />
        <InputRow
          label="Years"
          value={state.years}
          min={1}
          max={50}
          step={1}
          onChange={set.years}
          suffix=" yrs"
        />
        <InputRow
          label="Compounding (per year)"
          value={state.freq}
          min={1}
          max={12}
          step={1}
          onChange={set.freq}
        />
      </div>

      <div className="space-y-6">
        <ResultSummary
          stats={[
            { label: "Principal", value: formatINR(state.principal) },
            { label: "Interest", value: formatINR(result.interest) },
            { label: "Final value", value: formatINR(result.finalValue), emphasis: true },
          ]}
        />
        <div className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6">
          <GrowthChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
