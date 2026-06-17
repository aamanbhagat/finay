"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { InputRow } from "@/components/tools/input-row";
import { ResultSummary } from "@/components/tools/result-summary";
import { useUrlNumberState } from "@/lib/use-url-state";
import { calculateFd, calculateRd } from "@/lib/finance";
import { formatINR, cn } from "@/lib/utils";

const DonutChart = dynamic(
  () => import("@/components/tools/donut-chart").then((m) => m.DonutChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-surface" /> },
);

const DEFAULTS = { amount: 100000, rate: 7.25, years: 5 };

type Mode = "fd" | "rd";

export function FdRdCalculator() {
  const [mode, setMode] = useState<Mode>("fd");
  const [state, set] = useUrlNumberState(DEFAULTS);

  const result = useMemo(() => {
    if (mode === "fd") {
      const r = calculateFd({
        principal: state.amount,
        annualRatePct: state.rate,
        years: state.years,
        compoundingPerYear: 4,
      });
      return { invested: r.principal, returns: r.interest, total: r.maturity };
    }
    const r = calculateRd({
      monthlyDeposit: state.amount,
      annualRatePct: state.rate,
      years: state.years,
    });
    return { invested: r.invested, returns: r.interest, total: r.maturity };
  }, [mode, state]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-xl border border-border bg-surface-2 p-6 sm:p-7">
        <div role="tablist" aria-label="Deposit type" className="inline-flex rounded-(--radius) border border-border p-1">
          {(["fd", "rd"] as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-[2px] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                mode === m ? "bg-accent text-navy" : "text-muted hover:text-foreground",
              )}
            >
              {m === "fd" ? "Fixed Deposit" : "Recurring Deposit"}
            </button>
          ))}
        </div>
        <InputRow
          label={mode === "fd" ? "Deposit amount" : "Monthly deposit"}
          value={state.amount}
          min={500}
          max={mode === "fd" ? 10000000 : 200000}
          step={500}
          onChange={set.amount}
          currency
        />
        <InputRow
          label="Interest rate"
          value={state.rate}
          min={1}
          max={15}
          step={0.05}
          onChange={set.rate}
          suffix="%"
        />
        <InputRow
          label="Tenure"
          value={state.years}
          min={1}
          max={20}
          step={1}
          onChange={set.years}
          suffix=" yrs"
        />
      </div>

      <div className="space-y-6">
        <ResultSummary
          stats={[
            { label: "Invested", value: formatINR(result.invested) },
            { label: "Interest", value: formatINR(result.returns) },
            { label: "Maturity", value: formatINR(result.total), emphasis: true },
          ]}
        />
        <div className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6">
          <DonutChart
            data={[
              { name: "Invested", value: result.invested, color: "#5b6b7f" },
              { name: "Interest", value: result.returns, color: "#f4b942" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
