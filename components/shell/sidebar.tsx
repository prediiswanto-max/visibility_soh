"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes, Building2, ChevronsUpDown, LayoutDashboard, PanelLeftClose } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { warehouse } from "@/lib/wms-data"

export function Sidebar({
  onNavigate,
  onToggle,
}: {
  onNavigate?: () => void
  onToggle?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === "/"

  return (
    <aside className="flex h-full min-h-screen w-64 flex-col border-r border-sidebar-border/70 bg-sidebar px-3 py-4 text-sidebar-foreground">
      <div className="flex items-start justify-between gap-2 pr-1">
        <Link
          href="/"
          onClick={onNavigate}
          className="group flex min-w-0 items-center gap-2.5 px-2"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm transition-transform duration-300 group-hover:-rotate-3">
            <Boxes className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-semibold tracking-tight">
              KARGO<span className="text-sidebar-primary">.</span>
            </span>
            <span className="block font-mono text-[8px] uppercase tracking-[0.22em] text-sidebar-foreground/35">
              Warehouse OS
            </span>
          </span>
        </Link>

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="mt-0.5 hidden h-7 w-7 shrink-0 place-items-center rounded-md text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground lg:grid"
            aria-label="Hide sidebar"
            title="Hide sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-7">
        <p className="px-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-sidebar-foreground/35">
          Workspace
        </p>
        <button
          type="button"
          className="mt-2 flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 px-2.5 py-2 text-left transition-colors hover:bg-sidebar-accent/60"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-sidebar-accent text-sidebar-primary">
            <Building2 className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium">Cakung DC</span>
            <span className="block truncate font-mono text-[9px] text-sidebar-foreground/40">
              {warehouse.code} · {warehouse.docksOnline}/{warehouse.docksTotal} docks
            </span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/30" />
        </button>
      </div>

      <nav className="mt-7 flex-1">
        <p className="px-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-sidebar-foreground/35">
          Menu
        </p>
        <div className="mt-2">
          <Link
            href="/"
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-200",
              isActive
                ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/55 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            )}
          >
            <LayoutDashboard
              className={cn(
                "h-4 w-4",
                isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/40",
              )}
            />
            <span>Dashboard</span>
            {isActive && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary-foreground/60" />
            )}
          </Link>
        </div>
      </nav>

      <div className="mt-auto border-t border-sidebar-border/60 pt-3">
        <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-accent text-[11px] font-semibold text-sidebar-foreground">
              {warehouse.manager.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-sidebar-foreground">
              {warehouse.manager.name}
            </p>
            <p className="truncate text-[10px] text-sidebar-foreground/40">
              {warehouse.manager.role}
            </p>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-sidebar-foreground/30">
            Shift A
          </span>
        </div>
      </div>
    </aside>
  )
}
