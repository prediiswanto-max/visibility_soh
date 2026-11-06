"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber } from "@/lib/format"
import {
  groupForStatus,
  stockGroupLabels,
  type DailySohRow,
  type StockGroup,
} from "@/lib/supabase/daily-soh"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 5
const TABLE_GROUPS: StockGroup[] = ["overstock", "kurang", "deadstock", "cukup"]

const styles: Record<StockGroup, { dot: string; top: string }> = {
  overstock: { dot: "bg-emerald-500", top: "border-t-emerald-400/80" },
  kurang: { dot: "bg-rose-500", top: "border-t-rose-400/80" },
  deadstock: { dot: "bg-amber-500", top: "border-t-amber-400/80" },
  cukup: { dot: "bg-sky-500", top: "border-t-sky-400/80" },
  discontinue: { dot: "bg-violet-500", top: "border-t-violet-400/80" },
}

function pageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total]
  if (current >= total - 3) {
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total]
}

function exportCsv(group: StockGroup, rows: DailySohRow[]) {
  const header = [
    "No",
    "Material",
    "Material Desc",
    "SOH",
    "Qty SO",
    "Qty Delv",
    "Qty Loss",
    "SO/Day",
    "Plan Dorring",
    "Antre Dorring",
    "Kategori Produk",
  ]
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`
  const lines = [
    header,
    ...rows.map((row, index) => [
      index + 1,
      row.material_id,
      row.material_desc,
      row.soh_unres,
      row.qty_so,
      row.qty_del,
      row.qty_loss,
      row.so_perday,
      row.plan_dorring,
      row.antre_dorring,
      row.kat_product ?? "",
    ]),
  ].map((line) => line.map(escape).join(","))

  const blob = new Blob([`\ufeff${lines.join("\r\n")}`], {
    type: "text/csv;charset=utf-8;",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `daily-soh-${group}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function GroupTable({
  group,
  rows,
  query,
}: {
  group: StockGroup
  rows: DailySohRow[]
  query: string
}) {
  const [page, setPage] = useState(0)
  const label = stockGroupLabels[group]
  const style = styles[group]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows

    return rows.filter((row) =>
      [
        row.material_id,
        row.material_desc,
        row.ket_product,
        row.kat_product,
        row.status_stock_product,
      ].some((value) => value?.toLowerCase().includes(q)),
    )
  }, [rows, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const start = currentPage * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  return (
    <Card className={cn("gap-0 overflow-hidden border-border/80 border-t-2 py-0 shadow-none", style.top)}>
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", style.dot)} />
          <h3 className="truncate text-[12px] font-semibold tracking-tight">{label}</h3>
          <span className="rounded-full border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
            {formatNumber(filtered.length)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-6 gap-1 px-2 text-[10px]"
          disabled={filtered.length === 0}
          onClick={() => exportCsv(group, filtered)}
        >
          <Download className="h-3 w-3" />
          Excel
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[920px]">
          <TableHeader>
            <TableRow className="bg-muted/25 hover:bg-muted/25">
              <TableHead className="h-7 w-8 px-2 text-[9px] uppercase tracking-[0.08em]">No</TableHead>
              <TableHead className="h-7 px-2 text-[9px] uppercase tracking-[0.08em]">Material</TableHead>
              <TableHead className="h-7 px-2 text-[9px] uppercase tracking-[0.08em]">Material desc</TableHead>
              <TableHead className="h-7 px-2 text-right text-[9px] uppercase tracking-[0.08em]">SOH</TableHead>
              <TableHead className="h-7 px-2 text-right text-[9px] uppercase tracking-[0.08em]">Qty SO</TableHead>
              <TableHead className="h-7 px-2 text-right text-[9px] uppercase tracking-[0.08em]">Qty delv</TableHead>
              <TableHead className="h-7 px-2 text-right text-[9px] uppercase tracking-[0.08em]">Qty loss</TableHead>
              <TableHead className="h-7 px-2 text-right text-[9px] uppercase tracking-[0.08em]">SO / day</TableHead>
              <TableHead className="h-7 px-2 text-right text-[9px] uppercase tracking-[0.08em]">Plan Dorring</TableHead>
              <TableHead className="h-7 px-2 text-right text-[9px] uppercase tracking-[0.08em]">Antre Dorring</TableHead>
              <TableHead className="h-7 px-2 text-[9px] uppercase tracking-[0.08em]">Kategori</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-20 text-center text-[11px] text-muted-foreground">
                  No materials match your search.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((row, index) => (
                <TableRow key={row.id ?? row.material_id} className="text-[11px]">
                  <TableCell className="px-2 py-2 font-mono text-[10px] text-muted-foreground">
                    {start + index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-2 font-mono text-[10px]">
                    {row.material_id}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate px-2 py-2 font-medium">
                    {row.material_desc}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-2 text-right font-mono text-tabular">
                    {formatNumber(row.soh_unres)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-2 text-right font-mono text-tabular">
                    {formatNumber(row.qty_so)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-2 text-right font-mono text-tabular">
                    {formatNumber(row.qty_del)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-2 text-right font-mono text-tabular">
                    {formatNumber(row.qty_loss)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-2 text-right font-mono text-tabular">
                    {formatNumber(row.so_perday)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-2 text-right font-mono text-tabular">
                    {formatNumber(row.plan_dorring)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-2 text-right font-mono text-tabular">
                    {formatNumber(row.antre_dorring)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-2 py-2 text-[10px] text-muted-foreground">
                    {row.kat_product ?? "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/70 px-3 py-2 text-[10px] text-muted-foreground">
        <span className="font-mono">
          {filtered.length === 0
            ? "0 rows"
            : `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${formatNumber(filtered.length)}`}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            disabled={currentPage === 0}
            onClick={() => setPage(Math.max(0, currentPage - 1))}
            aria-label={`Previous ${label} page`}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>

          {pageItems(currentPage + 1, pageCount).map((item, index) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-0.5 font-mono text-[9px]">
                …
              </span>
            ) : (
              <Button
                key={item}
                variant={item === currentPage + 1 ? "default" : "outline"}
                size="sm"
                className="h-6 min-w-6 px-1.5 text-[10px]"
                onClick={() => setPage(item - 1)}
              >
                {item}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
            aria-label={`Next ${label} page`}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function StockGroupTables({ rows }: { rows: DailySohRow[] }) {
  const [query, setQuery] = useState("")

  const grouped = useMemo(() => {
    const map = new Map<StockGroup, DailySohRow[]>()
    for (const group of TABLE_GROUPS) map.set(group, [])

    for (const row of rows) {
      const group = groupForStatus(row.status_stock_product)
      map.get(group)?.push(row)
    }

    for (const list of map.values()) {
      list.sort((a, b) =>
        a.material_id.localeCompare(b.material_id, undefined, { numeric: true }),
      )
    }

    return TABLE_GROUPS.map((group) => ({ group, rows: map.get(group) ?? [] }))
  }, [rows])

  return (
    <div>
      <div className="flex flex-col gap-2 border-b border-border/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search material across all tables…"
            className="h-8 pl-8 text-[11px]"
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          5 rows per table · {formatNumber(rows.length)} materials
        </p>
      </div>

      <div className="grid gap-3 p-4 xl:grid-cols-2">
        {grouped.map(({ group, rows: groupRows }) => (
          <GroupTable
            key={`${group}-${query}`}
            group={group}
            rows={groupRows}
            query={query}
          />
        ))}
      </div>
    </div>
  )
}
