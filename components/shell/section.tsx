import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type SectionTone = "indigo" | "teal" | "amber" | "coral" | "violet" | "sky"

const tones: Record<SectionTone, string> = {
  indigo:
    "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300",
  teal: "border-teal-200 bg-teal-50 text-teal-600 dark:border-teal-500/25 dark:bg-teal-500/10 dark:text-teal-300",
  amber:
    "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300",
  coral: "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300",
  violet:
    "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300",
  sky: "border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300",
}

interface SectionProps {
  title: string
  description?: string
  action?: ReactNode
  icon?: LucideIcon
  tone?: SectionTone
  children: ReactNode
  className?: string
  bodyClassName?: string
}

export function Section({
  title,
  description,
  action,
  icon: Icon,
  tone = "indigo",
  children,
  className,
  bodyClassName,
}: SectionProps) {
  return (
    <Card className={cn("gap-0 overflow-hidden border-border/80 py-0 shadow-none", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-border/70 px-4 py-3.5">
        <div className="flex min-w-0 items-start gap-2.5">
          {Icon && (
            <span
              className={cn(
                "mt-px grid h-7 w-7 shrink-0 place-items-center rounded-md border",
                tones[tone],
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-[13px] font-semibold tracking-tight text-foreground">{title}</h2>
            {description && <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className={cn("min-w-0 flex-1 p-4", bodyClassName)}>{children}</div>
    </Card>
  )
}
