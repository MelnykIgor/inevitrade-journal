import React, { useMemo, useState } from 'react'
import { Panel } from './ui.jsx'
import DayDetailModal from './DayDetailModal.jsx'
import { groupTradesByDay, formatMoney } from '../utils.js'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(n) {
  return String(n).padStart(2, '0')
}

function dateKey(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

export default function CalendarPage({ trades }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(null)

  const dayStats = useMemo(() => groupTradesByDay(trades), [trades])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  // monthly totals
  const monthStats = useMemo(() => {
    let pnl = 0
    let trades_ = 0
    let activeDays = 0
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(year, month, d)
      const stat = dayStats[key]
      if (stat) {
        pnl += stat.pnl
        trades_ += stat.count
        activeDays += 1
      }
    }
    return { pnl, trades: trades_, activeDays }
  }, [dayStats, year, month, daysInMonth])

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }
  function goToday() {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2.5 py-1 rounded-md bg-accent/10 border border-accent/30 text-accent3 font-medium">
            Monthly P&L: {formatMoney(monthStats.pnl)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-surface2 border border-border text-gray-300">
            {monthStats.trades} trades · {monthStats.activeDays} days
          </span>
        </div>
      </div>

      <Panel hoverable={false}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="px-3 py-1.5 rounded-lg border border-border hover:border-accent/40 text-sm text-gray-300 transition-all hover:scale-[1.08]"
            aria-label="Previous month"
          >
            ←
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button
              onClick={goToday}
              className="px-2.5 py-1 rounded-md border border-border hover:border-accent/40 text-xs text-gray-400 transition-all hover:scale-[1.05]"
            >
              This month
            </button>
          </div>
          <button
            onClick={nextMonth}
            className="px-3 py-1.5 rounded-lg border border-border hover:border-accent/40 text-sm text-gray-300 transition-all hover:scale-[1.08]"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="text-center text-[11px] uppercase tracking-wide text-gray-500 py-1">
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((d, idx) => {
            if (d === null) {
              return <div key={idx} className="rounded-lg border border-transparent min-h-[88px]" />
            }
            const key = dateKey(year, month, d)
            const stat = dayStats[key]
            const isToday =
              today.getFullYear() === year && today.getMonth() === month && today.getDate() === d

            let cellClass = 'border-border bg-surface2'
            if (stat) {
              if (stat.pnl > 0) cellClass = 'border-win/30 bg-win/10'
              else if (stat.pnl < 0) cellClass = 'border-loss/30 bg-loss/10'
              else cellClass = 'border-accent/20 bg-accent/5'
            }

            return (
              <div
                key={idx}
                onClick={() => stat && setSelectedDate(key)}
                className={`rounded-lg border min-h-[88px] p-2 flex flex-col gap-1 transition-all ${cellClass} ${
                  isToday ? 'ring-1 ring-accent/60' : ''
                } ${stat ? 'cursor-pointer hover:scale-[1.03] hover:shadow-glow hover:border-accent/50' : ''}`}
              >
                <span className="text-xs text-gray-400">{d}</span>
                {stat && (
                  <div className="flex flex-col gap-0.5 mt-auto">
                    <span
                      className={`text-sm font-semibold ${
                        stat.pnl > 0 ? 'text-win' : stat.pnl < 0 ? 'text-loss' : 'text-gray-300'
                      }`}
                    >
                      {formatMoney(stat.pnl)}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {stat.count} trade{stat.count > 1 ? 's' : ''}
                    </span>
                    {stat.winRate !== null && (
                      <span className="text-[11px] text-gray-500">{stat.winRate.toFixed(0)}% WR</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Panel>

      <DayDetailModal date={selectedDate} trades={trades} onClose={() => setSelectedDate(null)} />
    </div>
  )
}
