import React from 'react'
import { StatCard } from './ui.jsx'
import OverallStatistics from './OverallStatistics.jsx'
import { formatMoney, netPnl } from '../utils.js'

const resultStyles = {
  Win: 'bg-win/10 text-win border border-win/30',
  Loss: 'bg-loss/10 text-loss border border-loss/30',
  BE: 'bg-be/10 text-be border border-be/30',
}

const exitStyles = {
  TP: 'text-win',
  SL: 'text-loss',
  'Manual Close': 'text-gray-400',
}

export default function DashboardPage({
  trades,
  allTrades,
  stats,
  balanceSeries,
  startBalance,
  currentBalance,
  balanceByTradeId,
  showForm,
  setShowForm,
  form,
  handleChange,
  handleAdd,
  handleDelete,
  handleEdit,
  handleCancelForm,
  editingId,
  editingBalance,
  setEditingBalance,
  startBalanceInput,
  setStartBalanceInput,
  filters,
  setFilters,
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-gray-400">Current balance</p>
            {editingBalance ? (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400">Start:</span>
                <input
                  type="number"
                  value={startBalanceInput}
                  onChange={(e) => setStartBalanceInput(e.target.value)}
                  onBlur={() => setEditingBalance(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingBalance(false)}
                  autoFocus
                  className="bg-surface2 border border-accent/50 rounded-lg px-2 py-1 text-sm w-28 focus:outline-none"
                />
              </div>
            ) : (
              <button
                onClick={() => setEditingBalance(true)}
                className="text-xl font-semibold tracking-tight text-accent3 hover:text-accent transition-colors"
                title="Click to edit starting balance"
              >
                {formatMoney(currentBalance)}
              </button>
            )}
          </div>
          <button
            onClick={() => (showForm ? handleCancelForm() : setShowForm(true))}
            className="bg-accent hover:bg-accent2 transition-all hover:scale-[1.05] text-white text-sm font-medium px-3 py-2 rounded-lg shadow-glow"
          >
            {showForm ? 'Cancel' : '+ New trade'}
          </button>
        </div>
      </div>

      {/* Top stats */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        <StatCard label="Trades" value={stats.total} accent />
        <StatCard
          label="Win rate"
          value={stats.total > 0 ? `${stats.winRate.toFixed(1)}%` : '—'}
          sub={`${stats.wins}W / ${stats.losses}L / ${stats.bes}BE`}
        />
        <StatCard
          label="Net P&L"
          value={formatMoney(stats.net)}
          valueClass={stats.net >= 0 ? 'text-win' : 'text-loss'}
        />
        <StatCard
          label="Avg P&L"
          value={formatMoney(stats.avgPnl)}
          sub="per trade"
          valueClass={stats.avgPnl >= 0 ? 'text-win' : 'text-loss'}
        />
        <StatCard
          label="Avg RR"
          value={stats.avgRR !== null ? `1:${stats.avgRR.toFixed(2)}` : '—'}
          sub="risk:reward"
        />
        <StatCard label="Biggest win" value={formatMoney(stats.biggestWin)} valueClass="text-win" />
        <StatCard label="Biggest loss" value={formatMoney(stats.biggestLoss)} valueClass="text-loss" />
        <StatCard
          label="Profit factor"
          value={
            stats.profitFactor === null
              ? '—'
              : stats.profitFactor === Infinity
              ? '∞'
              : stats.profitFactor.toFixed(2)
          }
          sub="gross profit/loss"
        />
      </section>

      {/* Add trade form */}
      {showForm && (
        <section className="bg-surface backdrop-blur-sm border border-accent/30 rounded-xl p-4 sm:p-5 shadow-glow">
          <h2 className="text-sm font-semibold mb-4 text-accent3">
            {editingId !== null ? 'Edit trade' : 'New trade'}
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Date</label>
              <input
                type="date"
                lang="en-US"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Pair</label>
              <input
                type="text"
                name="pair"
                value={form.pair}
                onChange={handleChange}
                placeholder="BTCUSD"
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent uppercase"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Timeframe</label>
              <input
                type="text"
                name="tf"
                value={form.tf}
                onChange={handleChange}
                placeholder="15m"
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Position</label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option>Long</option>
                <option>Short</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Result</label>
              <select
                name="result"
                value={form.result}
                onChange={handleChange}
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option>Win</option>
                <option>Loss</option>
                <option>BE</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">P&L ($)</label>
              <input
                type="number"
                step="0.01"
                name="pnl"
                value={form.pnl}
                onChange={handleChange}
                placeholder="0.00"
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Fee ($)</label>
              <input
                type="number"
                step="0.01"
                name="fee"
                value={form.fee}
                onChange={handleChange}
                placeholder="0.00"
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Margin used ($)</label>
              <input
                type="number"
                step="0.01"
                name="margin"
                value={form.margin}
                onChange={handleChange}
                placeholder="500"
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Leverage</label>
              <input
                type="number"
                step="1"
                name="leverage"
                value={form.leverage}
                onChange={handleChange}
                placeholder="20"
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">RR</label>
              <input
                type="text"
                name="rr"
                value={form.rr}
                onChange={handleChange}
                placeholder="1:2.5"
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Exit</label>
              <select
                name="exit"
                value={form.exit}
                onChange={handleChange}
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option>TP</option>
                <option>SL</option>
                <option>Manual Close</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 col-span-2 sm:col-span-3 lg:col-span-4">
              <label className="text-xs text-gray-400">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="What went well, what to improve, emotional state..."
                rows={2}
                className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <div className="flex items-end col-span-2 sm:col-span-1">
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent2 transition-all hover:scale-[1.02] text-white text-sm font-medium px-3 py-2 rounded-lg shadow-glow"
              >
                {editingId !== null ? 'Update trade' : 'Save trade'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Filters */}
      <section className="bg-surface backdrop-blur-sm border border-border rounded-xl p-3 sm:p-4 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Search pair</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="BTCUSD"
            className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent w-32 uppercase"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Result</label>
          <select
            value={filters.result}
            onChange={(e) => setFilters((f) => ({ ...f, result: e.target.value }))}
            className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
          >
            <option>All</option>
            <option>Win</option>
            <option>Loss</option>
            <option>BE</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Direction</label>
          <select
            value={filters.position}
            onChange={(e) => setFilters((f) => ({ ...f, position: e.target.value }))}
            className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
          >
            <option>All</option>
            <option>Long</option>
            <option>Short</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">From</label>
          <input
            type="date"
            lang="en-US"
            value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">To</label>
          <input
            type="date"
            lang="en-US"
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
          />
        </div>
        {(filters.search || filters.result !== 'All' || filters.position !== 'All' || filters.from || filters.to) && (
          <button
            onClick={() => setFilters({ search: '', result: 'All', position: 'All', from: '', to: '' })}
            className="text-xs font-medium text-accent3 border border-accent/30 bg-accent/5 rounded-lg px-3 py-1.5 hover:bg-accent/15 transition-all hover:scale-[1.05]"
          >
            Clear filters
          </button>
        )}
        <span className="text-xs text-gray-500 ml-auto">
          {trades.length} of {allTrades.length} trades
        </span>
      </section>

      {/* Trade table */}
      <section className="bg-surface backdrop-blur-sm border border-border rounded-xl overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-accent3">Trade log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-border">
                <th className="px-3 py-2 font-medium whitespace-nowrap">Date</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Pair</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">TF</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Position</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Result</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">P&L</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Fee</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Net P&L</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Balance</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Margin</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Leverage</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">RR</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Exit</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Notes</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 && (
                <tr>
                  <td colSpan={15} className="px-4 py-8 text-center text-gray-500">
                    {allTrades.length === 0
                      ? 'No trades yet. Add your first trade with the "+ New trade" button.'
                      : 'No trades match the current filters.'}
                  </td>
                </tr>
              )}
              {trades.map((t) => (
                <tr
                  key={t.id}
                  className={`border-b border-border/60 hover:bg-surface2/50 ${
                    editingId === t.id ? 'bg-accent/10' : ''
                  }`}
                >
                  <td className="px-3 py-2 whitespace-nowrap">{t.date}</td>
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{t.pair}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{t.tf}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={t.position === 'Long' ? 'text-win' : 'text-loss'}>
                      {t.position}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${resultStyles[t.result]}`}>
                      {t.result}
                    </span>
                  </td>
                  <td
                    className={`px-3 py-2 whitespace-nowrap font-medium ${
                      Number(t.pnl) > 0 ? 'text-win' : Number(t.pnl) < 0 ? 'text-loss' : 'text-gray-400'
                    }`}
                  >
                    {formatMoney(t.pnl)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-400">
                    {t.fee ? `-${formatMoney(t.fee)}` : '—'}
                  </td>
                  <td
                    className={`px-3 py-2 whitespace-nowrap font-medium ${
                      netPnl(t) > 0 ? 'text-win' : netPnl(t) < 0 ? 'text-loss' : 'text-gray-400'
                    }`}
                  >
                    {formatMoney(netPnl(t))}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-300">
                    {formatMoney(balanceByTradeId[t.id] ?? 0)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-400">
                    {t.margin ? formatMoney(t.margin) : '—'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-400">{t.leverage || '—'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{t.rr || '—'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={exitStyles[t.exit] || 'text-gray-400'}>{t.exit || '—'}</span>
                  </td>
                  <td className="px-3 py-2 text-gray-400 max-w-[100px] truncate" title={t.notes || ''}>
                    {t.notes || '—'}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(t)}
                        className="text-xs font-medium text-accent3 border border-accent/30 bg-accent/5 rounded-md px-2.5 py-1 hover:bg-accent/15 hover:border-accent/50 transition-all hover:scale-[1.05]"
                        aria-label="Edit trade"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-xs font-medium text-loss/80 border border-loss/30 bg-loss/5 rounded-md px-2.5 py-1 hover:bg-loss/15 hover:text-loss hover:border-loss/50 transition-all hover:scale-[1.05]"
                        aria-label="Delete trade"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Overall statistics */}
      <OverallStatistics stats={stats} balanceSeries={balanceSeries} startBalance={startBalance} trades={allTrades} />
    </div>
  )
}
