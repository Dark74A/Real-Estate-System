import { useEffect, useState } from 'react'
import { getSummary, getAgentPerformance } from '../../services/api'

export default function ReportsPage() {
  const [summary, setSummary] = useState(null)
  const [perf,    setPerf]    = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy,  setSortBy]  = useState('totalDeals')

  useEffect(() => {
    Promise.all([getSummary(), getAgentPerformance()])
      .then(([s, p]) => { setSummary(s.data); setPerf(p.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading reports…</div>

  const fmt  = n => n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0'
  const fmtCr = n => {
    if (!n) return '₹0'
    if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`
    if (n >= 100000)   return `₹${(n/100000).toFixed(2)} L`
    return fmt(n)
  }

  const sorted = [...perf].sort((a,b) => b[sortBy] - a[sortBy])
  const maxDeals = sorted[0]?.totalDeals || 1

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Reports</div>
          <div className="page-subtitle">Business performance overview</div>
        </div>
      </div>

      {/* Revenue summary */}
      <div className="stat-grid" style={{marginBottom:24}}>
        <div className="stat-card orange">
          <div className="stat-label">Total Sale Revenue</div>
          <div className="stat-value" style={{fontSize:22}}>{fmtCr(summary.totalSaleRevenue)}</div>
          <div className="stat-sub">{summary.totalSales} deals closed</div>
        </div>
        <div className="stat-card" style={{borderLeftColor:'#a855f7'}}>
          <div className="stat-label">Total Rental Revenue</div>
          <div className="stat-value" style={{fontSize:22}}>{fmtCr(summary.totalRentalRevenue)}</div>
          <div className="stat-sub">{summary.totalRentals} rentals closed</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Active Agents</div>
          <div className="stat-value">{summary.activeAgents}</div>
          <div className="stat-sub">of {summary.totalAgents} total</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open Listings</div>
          <div className="stat-value">{summary.openListings}</div>
          <div className="stat-sub">of {summary.totalListings} total</div>
        </div>
      </div>

      {/* Agent performance table */}
      <div className="card">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
          <div style={{fontWeight:700, fontSize:15}}>Agent Performance</div>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{fontSize:12.5, color:'var(--muted)'}}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{padding:'5px 10px', borderRadius:6, border:'1px solid var(--border)', fontSize:13}}>
              <option value="totalDeals">Total Deals</option>
              <option value="salesCount">Sales</option>
              <option value="rentalsCount">Rentals</option>
              <option value="totalRevenue">Revenue</option>
            </select>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="empty"><div className="empty-icon">📊</div><p>No agent data yet</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Agent</th><th>Status</th><th>Sales</th><th>Rentals</th><th>Total Deals</th><th>Revenue</th><th>Performance</th></tr>
              </thead>
              <tbody>
                {sorted.map((a, i) => (
                  <tr key={a.agentId}>
                    <td>
                      <div style={{
                        width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center',
                        justifyContent:'center', fontWeight:700, fontSize:12,
                        background: i===0?'#fef3c7': i===1?'#f1f5f9': i===2?'#ffedd5':'var(--bg)',
                        color: i===0?'#92400e': i===1?'#475569': i===2?'#9a3412':'var(--muted)'
                      }}>{i+1}</div>
                    </td>
                    <td><strong>{a.agentName}</strong></td>
                    <td><span className={`badge ${a.agentStatus==='Active'?'badge-green':'badge-red'}`}>{a.agentStatus}</span></td>
                    <td>{a.salesCount}</td>
                    <td>{a.rentalsCount}</td>
                    <td><strong>{a.totalDeals}</strong></td>
                    <td>{fmtCr(a.totalRevenue)}</td>
                    <td style={{width:160}}>
                      <div style={{background:'var(--bg)', borderRadius:20, height:8, overflow:'hidden'}}>
                        <div style={{
                          height:'100%', borderRadius:20,
                          width: `${Math.max(4, (a.totalDeals / maxDeals) * 100)}%`,
                          background: i===0?'var(--warning)':i===1?'var(--muted)':'var(--accent)',
                          transition:'width .4s'
                        }}/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
