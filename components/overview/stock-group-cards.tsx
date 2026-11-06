import type { LucideIcon } from "lucide-react"
import { Archive, BadgeCheck, TrendingUp, TriangleAlert } from "lucide-react"
import { formatNumber } from "@/lib/format"
import type { StockGroup, StockGroupStat } from "@/lib/supabase/daily-soh"
import { cn } from "@/lib/utils"

type CardGroup = Exclude<StockGroup, "discontinue">

const styles: Record<
  CardGroup,
  { icon: LucideIcon; card: string; iconBox: string; bar: string; label: string }
> = {
  overstock: {
    icon: TrendingUp,
    card: "border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06]",
    iconBox:
      "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300",
    bar: "bg-emerald-500",
    label: "text-emerald-700 dark:text-emerald-300",
  },
  kurang: {
    icon: TriangleAlert,
    card: "border-rose-200/80 bg-rose-50/50 dark:border-rose-500/20 dark:bg-rose-500/[0.06]",
    iconBox:
      "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/15 dark:text-rose-300",
    bar: "bg-rose-500",
    label: "text-rose-700 dark:text-rose-300",
  },
  deadstock: {
    icon: Archive,
    card: "border-amber-200/80 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-500/[0.06]",
    iconBox:
      "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-300",
    bar: "bg-amber-500",
    label: "text-amber-700 dark:text-amber-300",
  },
  cukup: {
    icon: BadgeCheck,
    card: "border-sky-200/80 bg-sky-50/50 dark:border-sky-500/20 dark:bg-sky-500/[0.06]",
    iconBox:
      "border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-500/25 dark:bg-sky-500/15 dark:text-sky-300",
    bar: "bg-sky-500",
    label: "text-sky-700 dark:text-sky-300",
  },
}

const cardOrder: CardGroup[] = ["overstock", "kurang", "deadstock", "cukup"]

export function StockGroupCards({ groups }: { groups: StockGroupStat[] }) {
  const byGroup = new Map(groups.map((group) => [group.group, group]))

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cardOrder.map((group, index) => {
        const stat = byGroup.get(group)
        const style = styles[group]
        const Icon = style.icon

        if (!stat) return null

        return (
          <div
            key={group}
            className={cn(
              "relative overflow-hidden rounded-lg border p-3.5 animate-slide-in-up",
              style.card,
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-[0.12em]",
                    style.label,
                  )}
                >
                  {stat.label}
                </p>
                <p className="mt-2 text-[22px] font-semibold leading-none tracking-tight text-foreground text-tabular">
                  {formatNumber(Math.round(stat.soh))}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  SOH · {formatNumber(stat.items)} items
                </p>
              </div>
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-md border",
                  style.iconBox,
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px]">
              <span className="font-mono font-medium text-foreground">{stat.share.toFixed(1)}%</span>
              <span className="text-muted-foreground">of active stock</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/10">
              <div
                className={cn("h-full rounded-full", style.bar)}
                style={{ width: `${Math.max(2, stat.share)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
