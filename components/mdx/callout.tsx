import { Info, TriangleAlert, Lightbulb, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "tip" | "disclaimer";

const STYLES: Record<CalloutType, { icon: typeof Info; className: string; label: string }> = {
  info: { icon: Info, className: "border-sky-500/40 bg-sky-500/10", label: "Note" },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-500/40 bg-amber-500/10",
    label: "Warning",
  },
  tip: { icon: Lightbulb, className: "border-emerald-500/40 bg-emerald-500/10", label: "Tip" },
  disclaimer: {
    icon: ShieldAlert,
    className: "border-border bg-surface",
    label: "Disclaimer",
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon: Icon, className, label } = STYLES[type];
  return (
    <div className={cn("my-6 flex gap-3 rounded-(--radius) border p-4 text-[0.95em]", className)}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        <p className="m-0 mb-1 font-semibold not-prose">{title ?? label}</p>
        {children}
      </div>
    </div>
  );
}
