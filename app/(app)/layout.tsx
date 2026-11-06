import type React from "react"
import { Sidebar } from "@/components/shell/sidebar"
import { Topbar } from "@/components/shell/topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-canvas min-h-screen">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar />
      </div>

      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
