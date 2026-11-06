import type { ReactNode } from "react"

interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-px w-6 bg-gradient-to-r from-indigo-500 via-amber-400 to-teal-400" />
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
