import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type KpiAccent = "indigo" | "teal" | "amber" | "coral" | "violet"

const accents: Record<
  KpiAccent,
  { card: string; icon: string; bar: string; glow: string }
> = {
  indigo: {
    card: "border-indigo-200/80 bg-indigo-50/70 dark:border-indigo-500/20 dark:bg-indigo-500/[0.07]",
    icon: "border-indigo-200 bg-indigo-100 text-indigo-700 dark:border-indigo-500/25 dark:bg-indigo-500/15 dark:text-indigo-300",
    bar: "from-indigo-500 via-violet-500 to-indigo-400",
    glow: "bg-indigo-400/25",
  },
  teal: {
    card: "border-teal-200/80 bg-teal-50/70 dark:border-teal-500/20 dark:bg-teal-500/[0.07]",
    icon: "border-teal-200 bg-teal-100 text-teal-700 dark:border-teal-500/25 dark:bg-teal-500/15 dark:text-teal-300",
    bar: "from-teal-500 via-cyan-400 to-teal-300",
    glow: "bg-teal-400/25",
  },
  amber: {
    card: "border-amber-200/80 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/[0.07]",
    icon: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-300",
    bar: "from-amber-500 via-orange-400 to-amber-300",
    glow: "bg-amber-400/30",
  },
  coral: {
    card: "border-rose-200/80 bg-rose-50/70 dark:border-rose-500/20 dark:bg-rose-500/[0.07]",
    icon: "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/15 dark:text-rose-300",
    bar: "from-rose-500 via-orange-400 to-rose-300",
    glow: "bg-rose-400/25",
  },
  violet: {
    card: "border-violet-200/80 bg-violet-50/70 dark:border-violet-500/20 dark:bg-violet-500/[0.07]",
    icon: "border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/15 dark:text-violet-300",
    bar: "from-violet-500 via-fuchsia-400 to-violet-300",
    glow: "bg-violet-400/25",
  },
}

interface KpiCardProps {
  label: string
  value: string
  hint?: string
  delta?: { value: string; direction: "up" | "down"; good?: boolean }
  icon: LucideIcon
  variant?: "default" | "dark"
  accent?: KpiAccent
  delay?: string
  className?: string
}

export function KpiCard({
  label,
  value,
  hint,
  delta,
  icon: Icon,
  variant = "default",
  accent = "indigo",
  delay,
  className,
}: KpiCardProps) {
  const isDark = variant === "dark"
  const tone = accents[accent]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-4 animate-slide-in-up",
        isDark
          ? "border-white/10 bg-gradient-to-br from-[#1e2745] via-[#282250] to-[#3a2040] text-white shadow-lg shadow-indigo-950/20"
          : tone.card,
        className,
      )}
      style={delay ? { animationDelay: delay } : undefined}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl",
          isDark ? "bg-amber-400/20" : tone.glow,
        )}
      />
      {isDark && <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r",
          isDark ? "from-amber-400 via-orange-400 to-rose-400" : tone.bar,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-[10px] font-medium uppercase tracking-[0.14em]",
            isDark ? "text-white/55" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-md border",
            isDark ? "border-white/15 bg-white/10 text-amber-300" : tone.icon,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>

      <p className="relative mt-3 text-[26px] font-semibold leading-none tracking-tight text-tabular">{value}</p>

      <div className="relative mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-medium",
              isDark
                ? "bg-white/10 text-amber-300"
                : (delta.good ?? delta.direction === "up")
                  ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : "bg-rose-100/80 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
            )}
          >
            {delta.direction === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {delta.value}
          </span>
        )}
        {hint && <span className={isDark ? "text-white/45" : "text-muted-foreground"}>{hint}</span>}
      </div>
    </div>
  )
}
