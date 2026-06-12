import React from 'react'

export function Panel({ title, className = '', hoverable = true, children }) {
  return (
    <div
      className={`bg-surface backdrop-blur-sm border border-border rounded-xl p-4 sm:p-5 transition-all duration-200 ${
        hoverable ? 'hover:border-accent/40 hover:scale-[1.01] hover:shadow-glow' : ''
      } ${className}`}
    >
      {title && (
        <h3 className="text-xs font-semibold uppercase tracking-wide text-accent3 mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, valueClass = '', accent = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 flex flex-col gap-1 transition-all
      ${accent ? 'border-accent/40 bg-gradient-to-br from-accent/15 via-surface to-surface shadow-glow backdrop-blur-sm' : 'border-border bg-surface backdrop-blur-sm'}
      hover:border-accent/40 hover:scale-[1.03] hover:shadow-glow duration-200`}
    >
      <span className="text-[11px] uppercase tracking-wider text-gray-400">{label}</span>
      <span className={`text-2xl font-semibold tracking-tight ${valueClass}`}>{value}</span>
      {sub && <span className="text-[11px] text-gray-500">{sub}</span>}
    </div>
  )
}
