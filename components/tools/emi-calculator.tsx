"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { InputRow } from "@/components/tools/input-row";
import { ResultSummary } from "@/components/tools/result-summary";
import { useUrlNumberState } from "@/lib/use-url-state";
import { calculateEmi } from "@/lib/finance";
import { formatINR } from "@/lib/utils";

const DonutChart = dynamic(
  () => import("@/components/tools/donut-chart").then((m) => m.DonutChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-surface" /> },
);

const DEFAULTS = { principal: 5000000, rate: 8.5, years: 20 };

export function EmiCalculator() {
  const [state, set] = useUrlNumberState(DEFAULTS);

  const result = useMemo(
    () =>
      calculateEmi({
        principal: state.principal,
        annualRatePct: state.rate,
        years: state.years,
      }),
    [state],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-xl border border-border bg-surface-2 p-6 sm:p-7">
        <InputRow
          label="Loan amount"
          value={state.principal}
          min={50000}
          max={100000000}
          step={10000}
          onChange={set.principal}
          currency
        />
        <InputRow
          label="Interest rate"
          value={state.rate}
          min={1}
          max={20}
          step={0.05}
          onChange={set.rate}
          suffix="%"
        />
        <InputRow
          label="Tenure"
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
            { label: "Monthly EMI", value: formatINR(result.emi), emphasis: true },
            { label: "Total interest", value: formatINR(result.totalInterest) },
            { label: "Total payment", value: formatINR(result.totalPayment) },
          ]}
        />
        <div className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6">
          <DonutChart
            data={[
              { name: "Principal", value: state.principal, color: "#5b6b7f" },
              { name: "Interest", value: result.totalInterest, color: "#f4b942" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
