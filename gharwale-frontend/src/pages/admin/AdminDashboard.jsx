import { useEffect, useState } from 'react'
import { getSummary, getAgentPerformance } from '../../services/api'

export default function AdminDashboard() {
  const [summary, setSummary]   = useState(null)
  const [perf,    setPerf]      = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([getSummary(), getAgentPerformance()])
      .then(([s, p]) => { setSummary(s.data); setPerf(p.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard…</div>

  const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) ?? '0'
  const fmtCr = (n) => {
    if (!n) return '₹0'
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
    if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`
    return `₹${fmt(n)}`
  }

  const sorted = [...perf].sort((a, b) => b.totalDeals - a.totalDeals)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Overview of all activity</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Agents</div>
          <div className="stat-value">{summary.totalAgents}</div>
          <div className="stat-sub">{summary.activeAgents} active</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Open Listings</div>
          <div className="stat-value">{summary.openListings}</div>
          <div className="stat-sub">of {summary.totalListings} total</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Sales Closed</div>
          <div className="stat-value">{summary.totalSales}</div>
          <div className="stat-sub">{fmtCr(summary.totalSaleRevenue)} revenue</div>
        </div>
        <div className="stat-card" style={{borderLeftColor:'#a855f7'}}>
          <div className="stat-label">Rentals Closed</div>
          <div className="stat-value">{summary.totalRentals}</div>
          <div className="stat-sub">{fmtCr(summary.totalRentalRevenue)} revenue</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>🏆 Agent Leaderboard</div>
          <span className="badge badge-blue">{perf.length} agents</span>
        </div>
        {sorted.length === 0 ? (
          <div className="empty"><div className="empty-icon">🏆</div><p>No agent data yet</p></div>
        ) : (
          sorted.map((a, i) => (
            <div key={a.agentId} className="leaderboard-row">
              <div className={`leaderboard-rank rank-${i + 1}`}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div className="leaderboard-name">{a.agentName}</div>
                <div className="leaderboard-meta">
                  {a.salesCount} sales · {a.rentalsCount} rentals
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.totalDeals} deals</div>
                <div className="leaderboard-meta">{fmtCr(a.totalRevenue)}</div>
              </div>
              <span className={`badge ${a.agentStatus === 'Active' ? 'badge-green' : 'badge-red'}`}>
                {a.agentStatus}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
