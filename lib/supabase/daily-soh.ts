import type { SupabaseClient } from "@supabase/supabase-js"
import { products, type Product } from "@/lib/wms-data"
import { createSupabaseServerClient } from "./server"

export interface DailySohRow {
  id?: number
  material_id: string
  material_desc: string
  ket_product: string | null
  kat_product: string | null
  case_qty: number
  case_uom: string | null
  pack_qty: number
  uom: string | null
  soh_unres: number
  qty_so: number
  qty_del: number
  qty_loss: number
  so_perday: number
  avg_quartal: number | null
  status_stock_product: string | null
  plan_dorring: number
  antre_dorring: number
  created_at?: string
  updated_at?: string
}

export type DailySohSource = "live" | "demo" | "error"

export interface DailySohSnapshot {
  rows: DailySohRow[]
  source: DailySohSource
  updatedAt: string | null
  message?: string
}

export type StockGroup = "overstock" | "kurang" | "deadstock" | "cukup" | "discontinue"

export const stockGroupOrder: StockGroup[] = [
  "overstock",
  "kurang",
  "deadstock",
  "cukup",
  "discontinue",
]

export const stockGroupLabels: Record<StockGroup, string> = {
  overstock: "Overstock",
  kurang: "Kurang",
  deadstock: "Deadstock",
  cukup: "Cukup",
  discontinue: "Discontinue",
}

export interface StockGroupStat {
  group: StockGroup
  label: string
  items: number
  soh: number
  qtySo: number
  qtyDel: number
  qtyLoss: number
  soPerDay: number
  share: number
}

export interface VelocityStat {
  velocity: string
  count: number
  share: number
}

export interface ItemCounts {
  soh: number
  so: number
  delv: number
  loss: number
  soPerDay: number
  discontinue: number
}

export interface DailySohSummary {
  materials: number
  soh: number
  qtySo: number
  qtyDel: number
  qtyLoss: number
  soPerDay: number
  uomCount: number
  itemCounts: ItemCounts
  groups: StockGroupStat[]
  velocities: VelocityStat[]
}

const DEMO_UPDATED_AT = "2026-11-06T08:47:00+00:00"
const PAGE_SIZE = 1000
const MAX_ROWS = 10000

const demoStatusLabel = {
  healthy: "Stok Cukup",
  low: "Stok Kurang",
  out: "Stok Kosong",
  excess: "Overstok",
} as const

const demoVelocity = {
  healthy: "Fast",
  low: "Medium",
  out: "Slow",
  excess: "Remnant",
} as const

function buildDemoRows(list: Product[]): DailySohRow[] {
  return list.map((product, index) => {
    const soPerDay = Math.max(1, Math.round(product.onHand * 0.045))

    return {
      id: index + 1,
      material_id: product.sku,
      material_desc: product.name,
      ket_product: product.category,
      kat_product: demoVelocity[product.status],
      case_qty: 12,
      case_uom: "BOX",
      pack_qty: 1,
      uom: product.unit,
      soh_unres: Math.max(0, product.onHand - product.reserved),
      qty_so: product.reserved,
      qty_del: Math.round(product.onHand * 0.08),
      qty_loss: 0,
      so_perday: soPerDay,
      avg_quartal: soPerDay * 90,
      status_stock_product: demoStatusLabel[product.status],
      plan_dorring: Math.round(product.onHand * 0.06),
      antre_dorring: Math.round(product.reserved * 0.4),
      created_at: DEMO_UPDATED_AT,
      updated_at: DEMO_UPDATED_AT,
    }
  })
}

export const demoDailySoh = buildDemoRows(products)

function toNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeRow(row: Record<string, unknown>): DailySohRow {
  return {
    id: typeof row.id === "number" ? row.id : undefined,
    material_id: String(row.material_id ?? ""),
    material_desc: String(row.material_desc ?? ""),
    ket_product: row.ket_product ? String(row.ket_product) : null,
    kat_product: row.kat_product ? String(row.kat_product) : null,
    case_qty: toNumber(row.case_qty),
    case_uom: row.case_uom ? String(row.case_uom) : null,
    pack_qty: toNumber(row.pack_qty),
    uom: row.uom ? String(row.uom) : null,
    soh_unres: toNumber(row.soh_unres),
    qty_so: toNumber(row.qty_so),
    qty_del: toNumber(row.qty_del),
    qty_loss: toNumber(row.qty_loss),
    so_perday: toNumber(row.so_perday),
    avg_quartal: toNullableNumber(row.avg_quartal),
    status_stock_product: row.status_stock_product ? String(row.status_stock_product) : null,
    plan_dorring: toNumber(row.plan_dorring),
    antre_dorring: toNumber(row.antre_dorring),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  }
}

async function fetchAllRows(supabase: SupabaseClient): Promise<DailySohRow[]> {
  const rows: DailySohRow[] = []

  for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("daily_soh")
      .select("*")
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) throw error

    const pageRows = (data ?? []).map((row) => normalizeRow(row as Record<string, unknown>))
    rows.push(...pageRows)

    if (pageRows.length < PAGE_SIZE) break
  }

  return rows
}

/**
 * Reads the current stock file from public.daily_soh.
 * The table is a rolling stock file (no snapshot_date column), so newer rows
 * can coexist with older imports. The dashboard uses the newest updated_at
 * value only for the "last updated" label.
 */
export async function getLatestDailySoh(): Promise<DailySohSnapshot> {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return {
      rows: demoDailySoh,
      source: "demo",
      updatedAt: DEMO_UPDATED_AT,
      message: "Supabase not configured — showing demo data",
    }
  }

  try {
    const rows = await fetchAllRows(supabase)

    if (rows.length === 0) {
      return {
        rows: demoDailySoh,
        source: "demo",
        updatedAt: null,
        message: "Supabase connected · daily_soh is empty — showing preview data",
      }
    }

    const updatedAt = rows.reduce<string | null>((latest, row) => {
      const value = row.updated_at ?? row.created_at ?? null
      if (!value) return latest
      return !latest || value > latest ? value : latest
    }, null)

    return {
      rows,
      source: "live",
      updatedAt,
      message: `${rows.length} materials loaded from daily_soh`,
    }
  } catch (error) {
    console.warn(
      "[supabase] failed to read daily_soh:",
      error instanceof Error ? error.message : error,
    )

    return {
      rows: demoDailySoh,
      source: "error",
      updatedAt: DEMO_UPDATED_AT,
      message: "Could not read daily_soh — showing demo data",
    }
  }
}

export function groupForStatus(status: string | null): StockGroup {
  const value = (status ?? "").toLowerCase()
  if (/dead|npd/.test(value)) return "deadstock"
  if (/over|excess|lebih|full/.test(value)) return "overstock"
  if (/kurang|kosong|habis|empty|out|low|min|tipis|critical/.test(value)) return "kurang"
  if (/cukup|aman|healthy|in stock|normal|ok|ready|available/.test(value)) return "cukup"
  return "discontinue"
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

function percent(part: number, total: number): number {
  if (!total) return 0
  return Math.round((part / total) * 1000) / 10
}

function emptyGroup(group: StockGroup): StockGroupStat {
  return {
    group,
    label: stockGroupLabels[group],
    items: 0,
    soh: 0,
    qtySo: 0,
    qtyDel: 0,
    qtyLoss: 0,
    soPerDay: 0,
    share: 0,
  }
}

export function summarizeDailySoh(rows: DailySohRow[]): DailySohSummary {
  const groupMap = new Map<StockGroup, StockGroupStat>()
  const velocities = new Map<string, number>()
  const uoms = new Set<string>()

  let soh = 0
  let qtySo = 0
  let qtyDel = 0
  let qtyLoss = 0
  let soPerDay = 0

  let soItems = 0
  let delvItems = 0
  let lossItems = 0
  let soPerDayItems = 0

  for (const row of rows) {
    const group = groupForStatus(row.status_stock_product)
    const stat = groupMap.get(group) ?? emptyGroup(group)

    stat.items += 1
    stat.soh += row.soh_unres
    stat.qtySo += row.qty_so
    stat.qtyDel += row.qty_del
    stat.qtyLoss += row.qty_loss
    stat.soPerDay += row.so_perday
    groupMap.set(group, stat)

    soh += row.soh_unres
    qtySo += row.qty_so
    qtyDel += row.qty_del
    qtyLoss += row.qty_loss
    soPerDay += row.so_perday

    if (row.qty_so > 0) soItems += 1
    if (row.qty_del > 0) delvItems += 1
    if (row.qty_loss > 0) lossItems += 1
    if (row.so_perday > 0) soPerDayItems += 1
    if (row.uom) uoms.add(row.uom)

    if (group !== "discontinue") {
      const velocity = row.kat_product?.trim() || "Inactive"
      velocities.set(velocity, (velocities.get(velocity) ?? 0) + 1)
    }
  }

  const groups = stockGroupOrder.map((group) => {
    const stat = groupMap.get(group) ?? emptyGroup(group)
    return {
      ...stat,
      soh: round(stat.soh),
      qtySo: round(stat.qtySo),
      qtyDel: round(stat.qtyDel),
      qtyLoss: round(stat.qtyLoss),
      soPerDay: round(stat.soPerDay),
    }
  })

  const activeItems = rows.length - (groups.find((group) => group.group === "discontinue")?.items ?? 0)
  const groupsWithShare = groups.map((group) => ({
    ...group,
    share: group.group === "discontinue" ? 0 : percent(group.items, activeItems),
  }))

  const velocityOrder = ["Slow", "Medium", "Remnant", "Fast", "Inactive"]
  const extraVelocities = [...velocities.keys()].filter(
    (velocity) => !velocityOrder.includes(velocity),
  )

  const velocityStats = [...velocityOrder, ...extraVelocities].map((velocity) => {
    const count = velocities.get(velocity) ?? 0
    return {
      velocity,
      count,
      share: percent(count, activeItems),
    }
  })

  return {
    materials: rows.length,
    soh: round(soh),
    qtySo: round(qtySo),
    qtyDel: round(qtyDel),
    qtyLoss: round(qtyLoss),
    soPerDay: round(soPerDay),
    uomCount: uoms.size,
    itemCounts: {
      soh: rows.length,
      so: soItems,
      delv: delvItems,
      loss: lossItems,
      soPerDay: soPerDayItems,
      discontinue: groups.find((group) => group.group === "discontinue")?.items ?? 0,
    },
    groups: groupsWithShare,
    velocities: velocityStats,
  }
}
