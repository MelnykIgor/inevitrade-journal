import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import DashboardPage from './components/DashboardPage.jsx'
import CalendarPage from './components/CalendarPage.jsx'
import { computeStats, buildBalanceSeries, netPnl } from './utils.js'
import { supabase } from './supabase.js'

const TRADES_KEY = 'inevitrade_trades_v2'
const BALANCE_KEY = 'inevitrade_start_balance_v2'

const emptyTrade = {
  date: new Date().toISOString().slice(0, 10),
  pair: '',
  tf: '15m',
  position: 'Long',
  result: 'Win',
  pnl: '',
  fee: '',
  margin: '',
  leverage: '',
  rr: '',
  exit: 'TP',
  notes: '',
}

function saveTrades(trades) {
  localStorage.setItem(TRADES_KEY, JSON.stringify(trades))
}

export default function App() {
  const [page, setPage] = useState('dashboard')
 const [trades, setTrades] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyTrade)
  const [editingId, setEditingId] = useState(null)

  const [startBalanceInput, setStartBalanceInput] = useState('259')
  const [editingBalance, setEditingBalance] = useState(false)

  const [filters, setFilters] = useState({ result: 'All', position: 'All', from: '', to: '' })

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY * 0.08
      document.documentElement.style.setProperty('--parallax-y', `${y}px`)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
  async function loadData() {
    const { data: tradesData, error: tradesError } =
      await supabase
        .from('trades')
        .select('*')
        .order('date', { ascending: false })

    if (!tradesError && tradesData) {
      setTrades(tradesData)
    }

    const { data: settingsData } =
      await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single()

    if (settingsData) {
      setStartBalanceInput(String(settingsData.start_balance))
    }
  }

  loadData()
}, [])

  const startBalance = Number(startBalanceInput) || 0

  const stats = useMemo(() => computeStats(trades), [trades])
  const balanceSeries = useMemo(() => buildBalanceSeries(trades, startBalance), [trades, startBalance])
  const currentBalance = startBalance + stats.net

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

 async function handleAdd(e) {
    e.preventDefault()
    if (!form.pair.trim()) return
    const payload = {
      ...form,
      pair: form.pair.toUpperCase(),
      pnl: Number(form.pnl) || 0,
      fee: Number(form.fee) || 0,
      margin: Number(form.margin) || 0,
      leverage: form.leverage
        ? String(form.leverage).replace(/x$/i, '') + 'x'
        : '',
    }
  if (editingId !== null) {
  const { error } = await supabase
    .from('trades')
    .update(payload)
    .eq('id', editingId)

  if (!error) {
    setTrades((prev) =>
      prev.map((t) => (t.id === editingId ? { ...payload, id: editingId } : t))
    )
  }

  setEditingId(null)
} else {
  const newTrade = {
    ...payload,
    id: Date.now(),
  }

  const { error } = await supabase
    .from('trades')
    .insert([newTrade])

  if (!error) {
    setTrades((prev) => [newTrade, ...prev])
  }
}
    setForm(emptyTrade)
    setShowForm(false)
  }

  function handleEdit(trade) {
    setForm({
      ...emptyTrade,
      ...trade,
      leverage: trade.leverage ? String(trade.leverage).replace(/x$/i, '') : '',
      pnl: trade.pnl,
      fee: trade.fee,
      margin: trade.margin,
    })
    setEditingId(trade.id)
    setShowForm(true)
  }

  function handleCancelForm() {
    setForm(emptyTrade)
    setEditingId(null)
    setShowForm(false)
  }

 async function handleDelete(id) {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id)

  if (!error) {
    setTrades((prev) => prev.filter((t) => t.id !== id))
  }

  if (editingId === id) handleCancelForm()
}

  // running balance per row, computed from chronological order
  const balanceByTradeId = useMemo(() => {
    const sorted = [...trades].sort((a, b) => {
      if (a.date === b.date) return (a.id || 0) - (b.id || 0)
      return new Date(a.date) - new Date(b.date)
    })
    let running = startBalance
    const map = {}
    sorted.forEach((t) => {
      running += netPnl(t)
      map[t.id] = running
    })
    return map
  }, [trades, startBalance])

  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      if (filters.result !== 'All' && t.result !== filters.result) return false
      if (filters.position !== 'All' && t.position !== filters.position) return false
      if (filters.from && t.date < filters.from) return false
      if (filters.to && t.date > filters.to) return false
      return true
    })
  }, [trades, filters])

  return (
    <div className="min-h-screen flex flex-col sm:flex-row text-gray-100">
      <div className="space-bg">
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
        <div className="nebula nebula-4" />
        <div className="star-layer" />
        <div className="star-layer-3" />
      </div>
      <Sidebar page={page} onNavigate={setPage} />
      <main className="flex-1 px-4 sm:px-6 py-6 pb-20 sm:pb-6">
        <div className="max-w-7xl mx-auto">
        {page === 'dashboard' && (
          <DashboardPage
            trades={filteredTrades}
            allTrades={trades}
            stats={stats}
            balanceSeries={balanceSeries}
            startBalance={startBalance}
            currentBalance={currentBalance}
            balanceByTradeId={balanceByTradeId}
            showForm={showForm}
            setShowForm={setShowForm}
            form={form}
            handleChange={handleChange}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleCancelForm={handleCancelForm}
            editingId={editingId}
            editingBalance={editingBalance}
            setEditingBalance={setEditingBalance}
            startBalanceInput={startBalanceInput}
            setStartBalanceInput={setStartBalanceInput}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        {page === 'calendar' && <CalendarPage trades={trades} />}
        </div>
      </main>
    </div>
  )
}
