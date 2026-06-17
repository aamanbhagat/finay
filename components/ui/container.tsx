import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

/** Centered max-width wrapper with responsive horizontal padding. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("container-px mx-auto w-full max-w-6xl", className)} {...props} />;
}
