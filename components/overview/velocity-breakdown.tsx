import { formatNumber } from "@/lib/format"
import type { VelocityStat } from "@/lib/supabase/daily-soh"
import { cn } from "@/lib/utils"

const barColors: Record<string, string> = {
  Slow: "bg-indigo-500",
  Medium: "bg-amber-500",
  Remnant: "bg-emerald-500",
  Fast: "bg-rose-500",
  Inactive: "bg-muted-foreground/30",
}

export function VelocityBreakdown({ data }: { data: VelocityStat[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-[11px] text-muted-foreground">
        No velocity data in this file.
      </div>
    )
  }

  const max = Math.max(...data.map((item) => item.count), 1)
  const activeTotal = data.reduce((total, item) => total + item.count, 0)

  return (
    <div>
      <div className="space-y-3.5">
        {data.map((item) => (
          <div key={item.velocity}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-medium text-foreground">{item.velocity}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {formatNumber(item.count)}
                <span className="mx-1 opacity-50">·</span>
                {item.share.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500",
                  barColors[item.velocity] ?? "bg-muted-foreground/40",
                )}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-[10px]">
        <span className="text-muted-foreground">Active items</span>
        <span className="font-mono text-foreground">{formatNumber(activeTotal)}</span>
      </div>
    </div>
  )
}
