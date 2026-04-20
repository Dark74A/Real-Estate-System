import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getDealsByAgent } from '../../services/api'

export default function MyDealsPage() {
  const { user }   = useAuth()
  const [sales,    setSales]   = useState([])
  const [rentals,  setRentals] = useState([])
  const [loading,  setLoading] = useState(true)
  const [tab,      setTab]     = useState('sales')

  useEffect(() => {
    getDealsByAgent(user.id).then(r => {
      setSales(r.data.sales || [])
      setRentals(r.data.rentals || [])
    }).finally(() => setLoading(false))
  }, [user.id])

  const totalRev = [...sales, ...rentals]
    .reduce((s, d) => s + Number(d.salePrice || d.rentPrice || 0), 0)

  const fmt = n => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—'
  const fmtCr = n => {
    if (!n) return '₹0'
    if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`
    if (n >= 100000)   return `₹${(n/100000).toFixed(2)} L`
    return fmt(n)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Deals</div>
          <div className="page-subtitle">Your closed sales and rentals</div>
        </div>
        <div style={{background:'var(--card)', borderRadius:10, padding:'10px 18px', boxShadow:'var(--shadow)', textAlign:'right'}}>
          <div style={{fontSize:12, color:'var(--muted)'}}>Total Revenue</div>
          <div style={{fontSize:20, fontWeight:700, color:'var(--success)'}}>{fmtCr(totalRev)}</div>
        </div>
      </div>

      <div className="stat-grid" style={{marginBottom:20}}>
        <div className="stat-card orange"><div className="stat-label">Sales</div><div className="stat-value">{sales.length}</div></div>
        <div className="stat-card" style={{borderLeftColor:'#a855f7'}}><div className="stat-label">Rentals</div><div className="stat-value">{rentals.length}</div></div>
        <div className="stat-card green"><div className="stat-label">Total Deals</div><div className="stat-value">{sales.length + rentals.length}</div></div>
      </div>

      <div className="card">
        <div className="tabs">
          <button className={`tab-btn${tab==='sales'?' active':''}`} onClick={() => setTab('sales')}>🏷 Sales ({sales.length})</button>
          <button className={`tab-btn${tab==='rentals'?' active':''}`} onClick={() => setTab('rentals')}>🔑 Rentals ({rentals.length})</button>
        </div>

        {loading ? <div className="loading">Loading…</div> : tab === 'sales' ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Listing #</th><th>Property</th><th>Buyer</th><th>Sale Price</th><th>Date Closed</th></tr></thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr><td colSpan={5}><div className="empty"><div className="empty-icon">🏷</div><p>No sales closed yet</p></div></td></tr>
                ) : sales.map(s => (
                  <tr key={s.listingId}>
                    <td><strong>#{s.listingId}</strong></td>
                    <td>
                      <div style={{fontWeight:500}}>{s.buildingName||'—'}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{s.city} · Unit {s.unitNumber}</div>
                    </td>
                    <td>
                      <div style={{fontWeight:500}}>{s.buyerName}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{s.buyerPhone}</div>
                    </td>
                    <td><strong style={{color:'var(--success)'}}>{fmt(s.salePrice)}</strong></td>
                    <td>{s.dateClosed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Listing #</th><th>Property</th><th>Tenant</th><th>Rent/mo</th><th>Date Closed</th></tr></thead>
              <tbody>
                {rentals.length === 0 ? (
                  <tr><td colSpan={5}><div className="empty"><div className="empty-icon">🔑</div><p>No rentals closed yet</p></div></td></tr>
                ) : rentals.map(r => (
                  <tr key={r.listingId}>
                    <td><strong>#{r.listingId}</strong></td>
                    <td>
                      <div style={{fontWeight:500}}>{r.buildingName||'—'}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{r.city} · Unit {r.unitNumber}</div>
                    </td>
                    <td>
                      <div style={{fontWeight:500}}>{r.tenantName}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{r.tenantPhone}</div>
                    </td>
                    <td><strong style={{color:'var(--accent)'}}>{fmt(r.rentPrice)}</strong></td>
                    <td>{r.dateClosed}</td>
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
