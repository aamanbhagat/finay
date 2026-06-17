import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-navy font-semibold hover:brightness-105 shadow-sm shadow-accent/20",
  outline: "border border-border bg-transparent text-foreground hover:bg-surface",
  ghost: "bg-transparent text-foreground hover:bg-surface",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-(--radius) transition-[filter,background-color,color] focus-visible:outline-2";

interface CommonProps {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return <button className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return <Link className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props} />;
}
