import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { formatMoney, netPnl } from '../utils.js'

const RESULT_COLORS = {
  Win: '#34d399',
  Loss: '#f87171',
  BE: '#9ca3af',
}

const resultStyles = {
  Win: 'bg-win/10 text-win border border-win/30',
  Loss: 'bg-loss/10 text-loss border border-loss/30',
  BE: 'bg-be/10 text-be border border-be/30',
}

function formatDateLong(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function DayDetailModal({ date, trades, onClose }) {
  const dayTrades = useMemo(
    () => trades.filter((t) => t.date === date),
    [trades, date]
  )

  const summary = useMemo(() => {
    const net = dayTrades.reduce((a, t) => a + netPnl(t), 0)
    const fees = dayTrades.reduce((a, t) => a + (Number(t.fee) || 0), 0)
    const wins = dayTrades.filter((t) => t.result === 'Win').length
    const losses = dayTrades.filter((t) => t.result === 'Loss').length
    const bes = dayTrades.filter((t) => t.result === 'BE').length
    const decisive = wins + losses
    const winRate = decisive > 0 ? (wins / decisive) * 100 : null
    return { net, fees, wins, losses, bes, winRate, count: dayTrades.length }
  }, [dayTrades])

  const pieData = useMemo(() => {
    const data = [
      { name: 'Win', value: summary.wins },
      { name: 'Loss', value: summary.losses },
      { name: 'BE', value: summary.bes },
    ].filter((d) => d.value > 0)
    return data.length > 0 ? data : [{ name: 'Empty', value: 1 }]
  }, [summary])

  if (!date) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface3 backdrop-blur-md border border-accent/30 rounded-2xl shadow-glow p-6 text-center relative animate-[fadeIn_0.15s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-200 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface2"
          aria-label="Close"
        >
          ✕
        </button>

        <p className="text-sm text-gray-400">{formatDateLong(date)}</p>
        <p
          className={`text-4xl font-semibold mt-2 mb-4 ${
            summary.net > 0 ? 'text-win' : summary.net < 0 ? 'text-loss' : 'text-gray-300'
          }`}
        >
          {summary.net >= 0 ? '+' : ''}
          {formatMoney(summary.net)}
        </p>

        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={32}
                  outerRadius={44}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.name === 'Empty' ? '#2c2240' : RESULT_COLORS[entry.name]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-semibold text-accent3">
                {summary.winRate !== null ? `${summary.winRate.toFixed(0)}%` : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-5 text-xs text-gray-400 mb-5">
          <span>
            {summary.count} trade{summary.count !== 1 ? 's' : ''}
          </span>
          <span className={summary.net >= 0 ? 'text-win' : 'text-loss'}>
            Net {summary.net >= 0 ? '+' : ''}
            {formatMoney(summary.net)}
          </span>
          {summary.fees > 0 && <span className="text-loss">Fees -{formatMoney(summary.fees)}</span>}
        </div>

        <div className="flex flex-col gap-2 text-left max-h-64 overflow-y-auto">
          {dayTrades.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between text-sm bg-surface2 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-accent3">{t.pair}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${resultStyles[t.result]}`}>
                  {t.result}
                </span>
              </div>
              <span className={netPnl(t) >= 0 ? 'text-win' : 'text-loss'}>
                {netPnl(t) >= 0 ? '+' : ''}
                {formatMoney(netPnl(t))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
