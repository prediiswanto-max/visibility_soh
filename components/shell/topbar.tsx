"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronDown, Moon, PanelLeftOpen, Search, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MobileNav } from "./mobile-nav"
import { warehouse } from "@/lib/wms-data"

export function Topbar({
  sidebarCollapsed = false,
  onToggleSidebar,
}: {
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-indigo-500/50 via-amber-400/50 to-teal-400/40"
      />
      <div className="mx-auto flex h-14 w-full max-w-[1500px] items-center gap-2 px-4 lg:px-8">
        {sidebarCollapsed && onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden lg:inline-flex"
            aria-label="Show sidebar"
            title="Show sidebar"
            onClick={onToggleSidebar}
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        )}

        <MobileNav />

        <div className="relative hidden w-full max-w-sm items-center md:flex">
          <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search SKU, order, or ASN"
            className="h-8 rounded-md border-border/80 bg-card pl-8 pr-14 text-[13px] shadow-none"
          />
          <kbd className="pointer-events-none absolute right-2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <span className="mr-1 hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-700 md:flex dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
            Sync live · 08:47
          </span>

          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--warning)] ring-2 ring-background" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="ml-1 hidden items-center gap-2 border-l border-border pl-3 sm:flex">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
                {warehouse.manager.initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden xl:block">
              <p className="text-[12px] font-medium leading-tight">{warehouse.manager.name}</p>
              <p className="text-[10px] leading-tight text-muted-foreground">{warehouse.shift}</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground xl:block" />
          </div>
        </div>
      </div>
    </header>
  )
}
