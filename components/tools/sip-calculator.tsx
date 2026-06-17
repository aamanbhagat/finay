"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { InputRow } from "@/components/tools/input-row";
import { ResultSummary } from "@/components/tools/result-summary";
import { useUrlNumberState } from "@/lib/use-url-state";
import { calculateSip } from "@/lib/finance";
import { formatINR } from "@/lib/utils";

const GrowthChart = dynamic(
  () => import("@/components/tools/growth-chart").then((m) => m.GrowthChart),
  { ssr: false, loading: () => <div className="h-72 animate-pulse rounded-lg bg-surface" /> },
);
const DonutChart = dynamic(
  () => import("@/components/tools/donut-chart").then((m) => m.DonutChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-surface" /> },
);

const DEFAULTS = { amount: 10000, rate: 12, years: 15 };

export function SipCalculator() {
  const [state, set] = useUrlNumberState(DEFAULTS);

  const result = useMemo(
    () =>
      calculateSip({
        monthlyInvestment: state.amount,
        annualRatePct: state.rate,
        years: state.years,
      }),
    [state],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-xl border border-border bg-surface-2 p-6 sm:p-7">
        <InputRow
          label="Monthly investment"
          value={state.amount}
          min={500}
          max={500000}
          step={500}
          onChange={set.amount}
          currency
        />
        <InputRow
          label="Expected annual return"
          value={state.rate}
          min={1}
          max={30}
          step={0.5}
          onChange={set.rate}
          suffix="%"
        />
        <InputRow
          label="Time period"
          value={state.years}
          min={1}
          max={40}
          step={1}
          onChange={set.years}
          suffix=" yrs"
        />
      </div>

      <div className="space-y-6">
        <ResultSummary
          stats={[
            { label: "Invested", value: formatINR(result.totalInvested) },
            { label: "Returns", value: formatINR(result.totalGains) },
            { label: "Future value", value: formatINR(result.futureValue), emphasis: true },
          ]}
        />
        <div className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6">
          <GrowthChart data={result.series} />
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6">
          <DonutChart
            data={[
              { name: "Invested", value: result.totalInvested, color: "#5b6b7f" },
              { name: "Returns", value: result.totalGains, color: "#f4b942" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
