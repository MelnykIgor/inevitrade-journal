import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Panel } from './ui.jsx'
import { formatMoney, buildDrawdownSeries, pairBreakdown } from '../utils.js'

const RESULT_COLORS = {
  Win: '#34d399',
  Loss: '#f87171',
  BE: '#9ca3af',
}

function ResultBreakdown({ stats }) {
  const data = [
    { name: 'Win', value: stats.wins },
    { name: 'Loss', value: stats.losses },
    { name: 'BE', value: stats.bes },
  ]
  const hasData = stats.total > 0

  return (
    <Panel title="Result breakdown">
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 shrink-0">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={32}
                  outerRadius={48}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={RESULT_COLORS[entry.name]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full rounded-full border-4 border-border flex items-center justify-center" />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold">{stats.total}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">Total</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: RESULT_COLORS[d.name] }}
              />
              <span className="text-gray-300">{d.name}</span>
              <span className="text-gray-500">
                {d.value} ({stats.total > 0 ? ((d.value / stats.total) * 100).toFixed(1) : '0.0'}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

function RateBars({ title, items }) {
  return (
    <Panel title={title}>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No data</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-300">{item.label}</span>
                <span className="text-gray-400">
                  {item.rate !== null ? `${item.rate.toFixed(1)}%` : '—'}
                  <span className="text-gray-600 ml-1">({item.count})</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent3"
                  style={{ width: `${item.rate ?? 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

function PnlOverview({ stats }) {
  return (
    <Panel title="P&L overview">
      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Gross profit</span>
          <span className="text-win font-medium">{formatMoney(stats.grossProfit)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Gross loss</span>
          <span className="text-loss font-medium">{formatMoney(stats.grossLoss)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Total fees</span>
          <span className="text-loss font-medium">-{formatMoney(stats.totalFees)}</span>
        </div>
        <div className="border-t border-border pt-2.5 flex justify-between">
          <span className="text-gray-200 font-medium">Net P&L</span>
          <span className={`font-semibold ${stats.net >= 0 ? 'text-win' : 'text-loss'}`}>
            {formatMoney(stats.net)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Profit factor</span>
          <span className="text-accent3 font-medium">
            {stats.profitFactor === null
              ? '—'
              : stats.profitFactor === Infinity
              ? '∞'
              : stats.profitFactor.toFixed(2)}
          </span>
        </div>
      </div>
    </Panel>
  )
}

function DrawdownChart({ series }) {
  const data = React.useMemo(() => buildDrawdownSeries(series), [series])
  const hasData = data.length > 1
  const maxDD = data.reduce((m, p) => Math.min(m, p.drawdownPct), 0)

  return (
    <Panel title="Drawdown" hoverable={false}>
      {!hasData ? (
        <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
          Add trades to see drawdown history
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-2">
            Max drawdown: <span className="text-loss font-medium">{maxDD.toFixed(2)}%</span>
          </p>
          <div className="h-48 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#2c2240" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#2c2240' }}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: '#2c2240' }}
                  tickLine={false}
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  width={50}
                  domain={['auto', 0]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1530',
                    border: '1px solid #2c2240',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#a78bfa' }}
                  formatter={(value) => [`${value.toFixed(2)}%`, 'Drawdown']}
                />
                <Area
                  type="monotone"
                  dataKey="drawdownPct"
                  stroke="#f87171"
                  fill="#f87171"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Panel>
  )
}

function PairPerformance({ trades }) {
  const data = React.useMemo(() => pairBreakdown(trades), [trades])

  return (
    <Panel title="Pair performance">
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No data</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {data.map((p) => {
            const maxAbs = Math.max(...data.map((d) => Math.abs(d.net)), 1)
            const widthPct = (Math.abs(p.net) / maxAbs) * 100
            return (
              <div key={p.pair}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-200 font-medium">{p.pair}</span>
                  <span className={p.net >= 0 ? 'text-win' : 'text-loss'}>
                    {formatMoney(p.net)}
                    <span className="text-gray-500 ml-1">
                      ({p.count}, {p.winRate !== null ? `${p.winRate.toFixed(0)}% WR` : '—'})
                    </span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surface2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.net >= 0 ? 'bg-win' : 'bg-loss'}`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}

function BalanceChart({ series, startBalance }) {
  const hasData = series.length > 1

  return (
    <Panel title="Balance over time" hoverable={false}>
      {!hasData ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
          Add trades to see balance history
        </div>
      ) : (
        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#2c2240" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={{ stroke: '#2c2240' }}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={{ stroke: '#2c2240' }}
                tickLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`}
                width={70}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1530',
                  border: '1px solid #2c2240',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#a78bfa' }}
                formatter={(value) => [formatMoney(value), 'Balance']}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  )
}

export default function OverallStatistics({ stats, balanceSeries, startBalance, trades }) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold tracking-tight">Overall statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResultBreakdown stats={stats} />
        <RateBars title="Win rate by direction" items={stats.winRateByDirection} />
        <PnlOverview stats={stats} />
        <RateBars title="Win rate by timeframe" items={stats.winRateByTimeframe} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceChart series={balanceSeries} startBalance={startBalance} />
        <DrawdownChart series={balanceSeries} />
      </div>
      <PairPerformance trades={trades} />
    </section>
  )
}
