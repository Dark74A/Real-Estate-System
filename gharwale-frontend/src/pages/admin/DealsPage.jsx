import { useEffect, useState } from 'react'
import { getAllDeals } from '../../services/api'

export default function DealsPage() {
  const [sales,   setSales]   = useState([])
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('sales')

  useEffect(() => {
    getAllDeals().then(r => {
      setSales(r.data.sales || [])
      setRentals(r.data.rentals || [])
    }).finally(() => setLoading(false))
  }, [])

  const fmt = n => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—'

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Deals</div>
          <div className="page-subtitle">All closed sales and rentals</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <span className="badge badge-orange" style={{padding:'6px 14px', fontSize:13}}>{sales.length} Sales</span>
          <span className="badge badge-purple" style={{padding:'6px 14px', fontSize:13}}>{rentals.length} Rentals</span>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          <button className={`tab-btn${tab==='sales'?' active':''}`} onClick={() => setTab('sales')}>🏷 Sales ({sales.length})</button>
          <button className={`tab-btn${tab==='rentals'?' active':''}`} onClick={() => setTab('rentals')}>🔑 Rentals ({rentals.length})</button>
        </div>

        {loading ? <div className="loading">Loading…</div> : tab === 'sales' ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Listing</th><th>Property</th><th>Agent</th><th>Buyer</th><th>Sale Price</th><th>Date Closed</th></tr></thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr><td colSpan={6}><div className="empty"><div className="empty-icon">🏷</div><p>No sales yet</p></div></td></tr>
                ) : sales.map(s => (
                  <tr key={s.listingId}>
                    <td><strong>#{s.listingId}</strong></td>
                    <td>
                      <div style={{fontWeight:500}}>{s.buildingName || '—'}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{s.locality}, {s.city} · Unit {s.unitNumber}</div>
                    </td>
                    <td>{s.agentName || `Agent #${s.agentId}`}</td>
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
              <thead><tr><th>Listing</th><th>Property</th><th>Agent</th><th>Tenant</th><th>Rent/mo</th><th>Date Closed</th></tr></thead>
              <tbody>
                {rentals.length === 0 ? (
                  <tr><td colSpan={6}><div className="empty"><div className="empty-icon">🔑</div><p>No rentals yet</p></div></td></tr>
                ) : rentals.map(r => (
                  <tr key={r.listingId}>
                    <td><strong>#{r.listingId}</strong></td>
                    <td>
                      <div style={{fontWeight:500}}>{r.buildingName || '—'}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{r.locality}, {r.city} · Unit {r.unitNumber}</div>
                    </td>
                    <td>{r.agentName || `Agent #${r.agentId}`}</td>
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
