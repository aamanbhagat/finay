"use client";

import { useId, type ChangeEvent } from "react";
import { formatIndianNumber, formatINRCompact } from "@/lib/utils";

interface InputRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  onChange: (value: number) => void;
  /** Convenience: prefixes ₹ and renders compact-INR bounds. */
  currency?: boolean;
  /** Format the min/max endpoint hints (overrides defaults). */
  formatBound?: (value: number) => string;
}

/** Premium input row: editable value chip + gold-filled range slider + bounds. */
export function InputRow({
  label,
  value,
  min,
  max,
  step,
  suffix,
  prefix,
  onChange,
  currency,
  formatBound,
}: InputRowProps) {
  const id = useId();
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    onChange(Number.isFinite(next) ? next : min);
  };

  const resolvedPrefix = prefix ?? (currency ? "₹" : undefined);
  const pct = max > min ? ((clamp(value) - min) / (max - min)) * 100 : 0;
  const fill = `linear-gradient(to right, var(--color-gold) 0%, var(--color-gold) ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`;
  const bound = formatBound ?? (currency ? formatINRCompact : (n: number) => formatIndianNumber(n));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium leading-tight text-foreground">
          {label}
        </label>
        <div className="inline-flex items-center rounded-lg border border-border bg-surface pl-2.5 pr-1 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25">
          {resolvedPrefix && <span className="font-mono text-xs text-faint">{resolvedPrefix}</span>}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handle}
            aria-label={label}
            className="tnum h-9 w-24 bg-transparent px-1.5 text-right text-sm font-semibold text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {suffix && <span className="pr-1.5 font-mono text-xs text-faint">{suffix}</span>}
        </div>
      </div>

      <input
        type="range"
        aria-label={label}
        value={clamp(value)}
        min={min}
        max={max}
        step={step}
        onChange={handle}
        className="slider"
        style={{ background: fill }}
      />

      <div className="flex justify-between font-mono text-[10px] uppercase tracking-wide text-faint">
        <span>{bound(min)}</span>
        <span>{bound(max)}</span>
      </div>
    </div>
  );
}
