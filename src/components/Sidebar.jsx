import React from 'react'
import Logo from './Logo.jsx'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
]

function DashboardIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Sidebar({ page, onNavigate }) {
  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside className="hidden sm:flex w-56 shrink-0 border-r border-border bg-surface/60 backdrop-blur flex-col">
        <div className="h-[65px] flex items-center px-5 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent3 shadow-glow shrink-0">
            <Logo className="w-5 h-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold tracking-tight leading-none">MelFemTrade</p>
            <p className="text-[11px] text-gray-400 leading-none mt-1">Trading Journal</p>
          </div>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = page === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:scale-[1.03] justify-start
                  ${
                    active
                      ? 'bg-accent/15 text-accent3 border border-accent/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface2 border border-transparent'
                  }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <header className="sm:hidden sticky top-0 z-20 flex items-center px-4 h-14 border-b border-border bg-surface/70 backdrop-blur">
        <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent3 shadow-glow shrink-0">
          <Logo className="w-4 h-4" />
        </div>
        <div className="ml-2.5">
          <p className="text-sm font-semibold tracking-tight leading-none">MelFemTrade</p>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-20 flex border-t border-border bg-surface/80 backdrop-blur">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-all
                ${active ? 'text-accent3' : 'text-gray-400'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
