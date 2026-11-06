import {
  Activity,
  Ban,
  Boxes,
  ClipboardList,
  Gauge,
  Layers,
  PackageCheck,
  Table2,
  TriangleAlert,
} from "lucide-react"
import { PageHeader } from "@/components/shell/page-header"
import { KpiCard } from "@/components/shell/kpi-card"
import { Section } from "@/components/shell/section"
import { RefreshButton } from "@/components/shell/refresh-button"
import { StockGroupCards } from "@/components/overview/stock-group-cards"
import { StockGroupTables } from "@/components/overview/stock-group-tables"
import { VelocityBreakdown } from "@/components/overview/velocity-breakdown"
import { formatNumber } from "@/lib/format"
import { getLatestDailySoh, summarizeDailySoh } from "@/lib/supabase/daily-soh"
import { warehouse } from "@/lib/wms-data"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const sourceStyles = {
  live: {
    label: "Supabase live",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  demo: {
    label: "Preview data",
    chip: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  error: {
    label: "Connection error",
    chip: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300",
    dot: "bg-rose-500",
  },
}

function formatUpdatedAt(value: string | null): string {
  if (!value) return "Not available"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default async function OverviewPage() {
  const dailySoh = await getLatestDailySoh()
  const summary = summarizeDailySoh(dailySoh.rows)
  const source = sourceStyles[dailySoh.source]
  const updatedLabel = formatUpdatedAt(dailySoh.updatedAt)
  const discontinue = summary.groups.find((group) => group.group === "discontinue")

  return (
    <>
      <PageHeader
        eyebrow={`${warehouse.code} · Updated ${updatedLabel}`}
        title="Stock dashboard"
        description="Current stock overview from public.daily_soh — stock on hand, demand, delivery, loss, and product velocity."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium",
                source.chip,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", source.dot)} />
              {source.label}
            </span>
            <RefreshButton />
          </div>
        }
      />

      {dailySoh.source !== "live" && dailySoh.message && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-200/80 bg-amber-50/60 px-3.5 py-2.5 text-[11px] text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
          {dailySoh.message}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          variant="dark"
          label="Total SOH"
          value={formatNumber(Math.round(summary.soh))}
          hint={`${formatNumber(summary.itemCounts.soh)} items`}
          icon={Boxes}
          accent="amber"
        />
        <KpiCard
          label="Total SO"
          value={formatNumber(Math.round(summary.qtySo))}
          hint={`${formatNumber(summary.itemCounts.so)} items`}
          icon={ClipboardList}
          accent="indigo"
          delay="60ms"
        />
        <KpiCard
          label="Qty delivered"
          value={formatNumber(Math.round(summary.qtyDel))}
          hint={`${formatNumber(summary.itemCounts.delv)} items`}
          icon={PackageCheck}
          accent="teal"
          delay="120ms"
        />
        <KpiCard
          label="Qty loss"
          value={formatNumber(Math.round(summary.qtyLoss))}
          hint={`${formatNumber(summary.itemCounts.loss)} items`}
          icon={TriangleAlert}
          accent="coral"
          delay="180ms"
        />
        <KpiCard
          label="SO / day"
          value={formatNumber(Math.round(summary.soPerDay))}
          hint={`${formatNumber(summary.itemCounts.soPerDay)} items`}
          icon={Gauge}
          accent="amber"
          delay="240ms"
        />
        <KpiCard
          label="Discontinued"
          value={formatNumber(Math.round(discontinue?.soh ?? 0))}
          hint={`${formatNumber(summary.itemCounts.discontinue)} items`}
          icon={Ban}
          accent="violet"
          delay="300ms"
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <Section
          className="xl:col-span-2"
          title="Stock by status"
          description="SOH and item distribution across the four active statuses"
          icon={Layers}
          tone="indigo"
        >
          <StockGroupCards groups={summary.groups} />
        </Section>

        <Section
          title="Product velocity"
          description="Item mix from kat_product"
          icon={Activity}
          tone="amber"
        >
          <VelocityBreakdown data={summary.velocities} />
        </Section>
      </div>

      <Section
        className="mt-3"
        title="Detail stock by status"
        description="Overstock, Kurang, Deadstock, and Cukup — five rows per table"
        icon={Table2}
        tone="teal"
        bodyClassName="p-0"
      >
        <StockGroupTables rows={dailySoh.rows} />
      </Section>
    </>
  )
}
