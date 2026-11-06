export type StockStatus = "healthy" | "low" | "out" | "excess"

export interface Product {
  sku: string
  name: string
  category: "Electronics" | "Packaging" | "Apparel" | "Home & Living" | "Industrial"
  unit: string
  onHand: number
  reserved: number
  status: StockStatus
}

export const warehouse = {
  code: "WH-JKT-01",
  name: "Cakung Distribution Center",
  city: "Jakarta Timur, ID",
  shift: "Shift A · 06:00 – 14:00",
  docksOnline: 4,
  docksTotal: 6,
  sqm: 18400,
  manager: { name: "Rangga Pratama", role: "Floor Manager", initials: "RP" },
}

/**
 * Seed rows for the dashboard preview.
 * The live dashboard reads public.daily_soh; these are only used when the
 * table is empty or Supabase is unreachable.
 */
export const products: Product[] = [
  { sku: "SKU-EL-1042", name: "USB-C Hub 7-in-1", category: "Electronics", unit: "pcs", onHand: 1480, reserved: 220, status: "healthy" },
  { sku: "SKU-EL-1088", name: "Wireless Barcode Scanner", category: "Electronics", unit: "pcs", onHand: 120, reserved: 46, status: "low" },
  { sku: "SKU-EL-2010", name: 'Thermal Label Printer 4"', category: "Electronics", unit: "pcs", onHand: 0, reserved: 0, status: "out" },
  { sku: "SKU-PK-3021", name: "Corrugated Box 40×30×30", category: "Packaging", unit: "pcs", onHand: 8600, reserved: 1400, status: "healthy" },
  { sku: "SKU-PK-3044", name: "Kraft Mailer 25×35", category: "Packaging", unit: "pcs", onHand: 2400, reserved: 900, status: "low" },
  { sku: "SKU-PK-3060", name: "Bubble Wrap Roll 1.2m", category: "Packaging", unit: "roll", onHand: 540, reserved: 80, status: "healthy" },
  { sku: "SKU-PK-3072", name: "Packing Tape 48mm", category: "Packaging", unit: "roll", onHand: 1900, reserved: 340, status: "healthy" },
  { sku: "SKU-AP-4102", name: "Cotton Tee — Black / L", category: "Apparel", unit: "pcs", onHand: 940, reserved: 310, status: "healthy" },
  { sku: "SKU-AP-4118", name: "Oversized Hoodie — Sand / M", category: "Apparel", unit: "pcs", onHand: 210, reserved: 120, status: "low" },
  { sku: "SKU-AP-4136", name: "Canvas Tote 12oz", category: "Apparel", unit: "pcs", onHand: 3100, reserved: 640, status: "healthy" },
  { sku: "SKU-HL-5207", name: "Ceramic Mug 320ml", category: "Home & Living", unit: "pcs", onHand: 760, reserved: 140, status: "healthy" },
  { sku: "SKU-HL-5233", name: "Bamboo Cutting Board", category: "Home & Living", unit: "pcs", onHand: 0, reserved: 0, status: "out" },
  { sku: "SKU-HL-5261", name: "Linen Throw Blanket", category: "Home & Living", unit: "pcs", onHand: 1850, reserved: 320, status: "excess" },
  { sku: "SKU-HL-5288", name: "Scented Candle 200g", category: "Home & Living", unit: "pcs", onHand: 320, reserved: 90, status: "healthy" },
  { sku: "SKU-IN-6310", name: "Stretch Wrap 500mm", category: "Industrial", unit: "roll", onHand: 6200, reserved: 1100, status: "excess" },
  { sku: "SKU-IN-6338", name: "Pallet EUR 1200×800", category: "Industrial", unit: "pcs", onHand: 410, reserved: 60, status: "healthy" },
  { sku: "SKU-IN-6355", name: "Safety Gloves — L", category: "Industrial", unit: "pair", onHand: 95, reserved: 55, status: "low" },
  { sku: "SKU-IN-6371", name: "Strapping Band 19mm", category: "Industrial", unit: "roll", onHand: 12600, reserved: 800, status: "excess" },
]
