import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("rounded-xl border bg-white text-slate-950 shadow-sm", className)} {...props} />;
}
