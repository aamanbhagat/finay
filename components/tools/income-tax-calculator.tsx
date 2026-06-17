"use client";

import { useMemo } from "react";
import { InputRow } from "@/components/tools/input-row";
import { useUrlNumberState } from "@/lib/use-url-state";
import { calculateIncomeTax } from "@/lib/finance";
import { formatINR, cn } from "@/lib/utils";

const DEFAULTS = { income: 1500000, deductions: 250000 };

function RegimeCard({
  title,
  totalTax,
  takeHome,
  active,
}: {
  title: string;
  totalTax: number;
  takeHome: number;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5 transition-colors",
        active ? "border-accent bg-accent/10" : "border-border bg-surface-2",
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {active && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy">
            Lower tax
          </span>
        )}
      </div>
      <dl className="mt-4 grid gap-3">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted">Tax + cess</dt>
          <dd className="tnum font-display text-2xl font-semibold">{formatINR(totalTax)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest text-muted">Take-home</dt>
          <dd className="tnum text-base font-medium">{formatINR(takeHome)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function IncomeTaxCalculator() {
  const [state, set] = useUrlNumberState(DEFAULTS);

  const result = useMemo(
    () =>
      calculateIncomeTax({
        grossIncome: state.income,
        oldDeductions: state.deductions,
      }),
    [state],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-xl border border-border bg-surface-2 p-6 sm:p-7">
        <InputRow
          label="Gross annual income"
          value={state.income}
          min={300000}
          max={50000000}
          step={10000}
          onChange={set.income}
          currency
        />
        <InputRow
          label="Old-regime deductions (80C + 80D + HRA + 24(b))"
          value={state.deductions}
          min={0}
          max={1000000}
          step={5000}
          onChange={set.deductions}
          currency
        />
        <p className="text-xs leading-relaxed text-muted">
          Illustrative FY 2025-26 slabs. Includes standard deduction (₹75k new / ₹50k old) and 4% cess. Surcharge for very
          high incomes is not modelled. Verify with a tax professional before filing.
        </p>
      </div>

      <div className="space-y-4">
        <RegimeCard
          title="New regime"
          totalTax={result.newRegime.totalTax}
          takeHome={state.income - result.newRegime.totalTax}
          active={result.cheaper === "new"}
        />
        <RegimeCard
          title="Old regime"
          totalTax={result.oldRegime.totalTax}
          takeHome={state.income - result.oldRegime.totalTax}
          active={result.cheaper === "old"}
        />
        <p className="rounded-lg border border-border bg-surface p-4 text-sm">
          The <strong>{result.cheaper === "new" ? "new" : "old"}</strong> regime saves you{" "}
          <strong className="text-accent-ink">{formatINR(result.savings)}</strong>.
        </p>
      </div>
    </div>
  );
}
