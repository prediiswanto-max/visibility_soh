import { cn } from "@/lib/utils"
import type { StockStatus } from "@/lib/wms-data"

export type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "primary" | "dark"

const tones: Record<Tone, string> = {
  neutral: "border-border bg-secondary/70 text-secondary-foreground",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300",
  warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300",
  danger: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300",
  info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300",
  primary: "border-primary/20 bg-primary text-primary-foreground",
  dark: "border-sidebar-border bg-sidebar text-sidebar-foreground",
}

export function StatusBadge({
  children,
  tone = "neutral",
  dot = true,
  className,
}: {
  children: React.ReactNode
  tone?: Tone
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />}
      {children}
    </span>
  )
}

export const stockTone: Record<StockStatus, Tone> = {
  healthy: "success",
  low: "warning",
  out: "danger",
  excess: "info",
}
