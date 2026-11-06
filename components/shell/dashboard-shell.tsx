"use client"

import { useState, type ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { cn } from "@/lib/utils"

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="app-canvas min-h-screen">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden overflow-hidden transition-[width] duration-300 ease-out lg:block",
          sidebarCollapsed ? "w-0" : "w-64",
        )}
      >
        <Sidebar onToggle={() => setSidebarCollapsed(true)} />
      </div>

      <div
        className={cn(
          "transition-[padding-left] duration-300 ease-out",
          sidebarCollapsed ? "lg:pl-0" : "lg:pl-64",
        )}
      >
        <Topbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
