export function formatMoney(n) {
  const num = Number(n) || 0
  const sign = num < 0 ? '-' : ''
  return `${sign}$${Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function netPnl(t) {
  return (Number(t.pnl) || 0) - (Number(t.fee) || 0)
}

export function computeStats(trades) {
  const total = trades.length
  const wins = trades.filter((t) => t.result === 'Win').length
  const losses = trades.filter((t) => t.result === 'Loss').length
  const bes = trades.filter((t) => t.result === 'BE').length
  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0

  const totalFees = trades.reduce((acc, t) => acc + (Number(t.fee) || 0), 0)
  const net = trades.reduce((acc, t) => acc + netPnl(t), 0)
  const avgPnl = total > 0 ? net / total : 0

  const grossProfit = trades
    .filter((t) => netPnl(t) > 0)
    .reduce((a, t) => a + netPnl(t), 0)
  const grossLoss = trades
    .filter((t) => netPnl(t) < 0)
    .reduce((a, t) => a + netPnl(t), 0)

  const profitFactor =
    grossLoss !== 0 ? Math.abs(grossProfit / grossLoss) : grossProfit > 0 ? Infinity : null

  const biggestWin = trades.reduce((m, t) => Math.max(m, netPnl(t)), 0)
  const biggestLoss = trades.reduce((m, t) => Math.min(m, netPnl(t)), 0)

  // average RR: parse "1:2.5" -> 2.5
  const rrValues = trades
    .map((t) => {
      const match = String(t.rr || '').match(/1:([\d.]+)/)
      return match ? parseFloat(match[1]) : null
    })
    .filter((v) => v !== null && !isNaN(v))
  const avgRR = rrValues.length > 0 ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length : null

  // win rate by direction
  const directions = ['Long', 'Short']
  const winRateByDirection = directions
    .map((dir) => {
      const dirTrades = trades.filter((t) => t.position === dir)
      const dirWins = dirTrades.filter((t) => t.result === 'Win').length
      const dirLosses = dirTrades.filter((t) => t.result === 'Loss').length
      const dirTotal = dirWins + dirLosses
      return {
        label: dir,
        rate: dirTotal > 0 ? (dirWins / dirTotal) * 100 : null,
        count: dirTrades.length,
      }
    })
    .filter((d) => d.count > 0)

  // win rate by timeframe
  const tfMap = {}
  trades.forEach((t) => {
    const tf = t.tf || 'N/A'
    if (!tfMap[tf]) tfMap[tf] = { wins: 0, losses: 0, count: 0 }
    tfMap[tf].count += 1
    if (t.result === 'Win') tfMap[tf].wins += 1
    if (t.result === 'Loss') tfMap[tf].losses += 1
  })
  const winRateByTimeframe = Object.entries(tfMap).map(([tf, v]) => ({
    label: tf,
    rate: v.wins + v.losses > 0 ? (v.wins / (v.wins + v.losses)) * 100 : null,
    count: v.count,
  }))

  return {
    total,
    wins,
    losses,
    bes,
    winRate,
    net,
    totalFees,
    avgPnl,
    grossProfit,
    grossLoss,
    profitFactor,
    biggestWin,
    biggestLoss,
    avgRR,
    winRateByDirection,
    winRateByTimeframe,
  }
}

// Build cumulative balance series from startBalance + ordered trades (oldest first)
export function buildBalanceSeries(trades, startBalance) {
  const sorted = [...trades].sort((a, b) => {
    if (a.date === b.date) return (a.id || 0) - (b.id || 0)
    return new Date(a.date) - new Date(b.date)
  })
  let running = Number(startBalance) || 0
  const series = [{ index: 0, label: 'Start', balance: running }]
  sorted.forEach((t, i) => {
    running += netPnl(t)
    series.push({ index: i + 1, label: t.date, balance: running })
  })
  return series
}

// Group trades by date string (YYYY-MM-DD) and compute per-day stats
export function groupTradesByDay(trades) {
  const map = {}
  trades.forEach((t) => {
    const key = t.date
    if (!map[key]) map[key] = { pnl: 0, count: 0, wins: 0, losses: 0, bes: 0 }
    map[key].pnl += netPnl(t)
    map[key].count += 1
    if (t.result === 'Win') map[key].wins += 1
    else if (t.result === 'Loss') map[key].losses += 1
    else map[key].bes += 1
  })
  Object.values(map).forEach((d) => {
    const decisive = d.wins + d.losses
    d.winRate = decisive > 0 ? (d.wins / decisive) * 100 : null
  })
  return map
}

// Drawdown series based on balance series; returns array with drawdown % at each point
export function buildDrawdownSeries(balanceSeries) {
  let peak = balanceSeries.length > 0 ? balanceSeries[0].balance : 0
  return balanceSeries.map((p) => {
    peak = Math.max(peak, p.balance)
    const drawdownPct = peak > 0 ? ((p.balance - peak) / peak) * 100 : 0
    return { ...p, drawdownPct }
  })
}

export function maxDrawdown(balanceSeries) {
  const series = buildDrawdownSeries(balanceSeries)
  return series.reduce((m, p) => Math.min(m, p.drawdownPct), 0)
}

// Per-pair performance breakdown
export function pairBreakdown(trades) {
  const map = {}
  trades.forEach((t) => {
    const pair = t.pair || 'N/A'
    if (!map[pair]) map[pair] = { pair, net: 0, count: 0, wins: 0, losses: 0 }
    map[pair].net += netPnl(t)
    map[pair].count += 1
    if (t.result === 'Win') map[pair].wins += 1
    if (t.result === 'Loss') map[pair].losses += 1
  })
  return Object.values(map)
    .map((p) => ({
      ...p,
      winRate: p.wins + p.losses > 0 ? (p.wins / (p.wins + p.losses)) * 100 : null,
    }))
    .sort((a, b) => b.net - a.net)
}
