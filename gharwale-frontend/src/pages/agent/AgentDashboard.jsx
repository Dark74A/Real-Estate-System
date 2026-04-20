import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAgentListings, getDealsByAgent } from '../../services/api'
import { useNavigate } from 'react-router-dom'

export default function AgentDashboard() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [listings, setListings] = useState([])
  const [sales,    setSales]    = useState([])
  const [rentals,  setRentals]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      getAgentListings(user.id),
      getDealsByAgent(user.id)
    ]).then(([l, d]) => {
      setListings(l.data)
      setSales(d.data.sales || [])
      setRentals(d.data.rentals || [])
    }).finally(() => setLoading(false))
  }, [user.id])

  const openListings = listings.filter(l => l.status === 'Open')
  const totalRevenue = [...sales, ...rentals]
    .reduce((sum, d) => sum + Number(d.salePrice || d.rentPrice || 0), 0)

  const fmtCr = n => {
    if (!n) return '₹0'
    if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`
    if (n >= 100000)   return `₹${(n/100000).toFixed(2)} L`
    return `₹${n.toLocaleString('en-IN')}`
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Welcome, {user.name} 👋</div>
          <div className="page-subtitle">Your performance overview</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Assigned Listings</div>
          <div className="stat-value">{listings.length}</div>
          <div className="stat-sub">{openListings.length} open</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Sales Closed</div>
          <div className="stat-value">{sales.length}</div>
        </div>
        <div className="stat-card" style={{borderLeftColor:'#a855f7'}}>
          <div className="stat-label">Rentals Closed</div>
          <div className="stat-value">{rentals.length}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value" style={{fontSize:22}}>{fmtCr(totalRevenue)}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{marginBottom:20}}>
        <div style={{fontWeight:700, fontSize:15, marginBottom:14}}>Quick Actions</div>
        <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
          <button className="btn btn-primary" onClick={() => navigate('/agent/listings')}>📋 My Listings</button>
          <button className="btn btn-success" onClick={() => navigate('/agent/close')}>✅ Close a Deal</button>
          <button className="btn btn-ghost"   onClick={() => navigate('/agent/deals')}>🤝 View My Deals</button>
        </div>
      </div>

      {/* Recent listings */}
      {!loading && openListings.length > 0 && (
        <div className="card">
          <div style={{fontWeight:700, fontSize:15, marginBottom:14}}>Open Listings ({openListings.length})</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Property</th><th>Unit</th><th>Type / Price</th><th>Status</th></tr></thead>
              <tbody>
                {openListings.slice(0, 6).map(l => (
                  <tr key={l.listingId}>
                    <td><strong>#{l.listingId}</strong></td>
                    <td>
                      <div style={{fontWeight:500}}>{l.buildingName || `Building #${l.propertyId}`}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{l.locality}, {l.city}</div>
                    </td>
                    <td>{l.unitNumber}</td>
                    <td>
                      {l.details?.map(d => (
                        <div key={d.listingType} style={{fontSize:13}}>
                          <span className={`badge ${d.listingType==='SALE'?'badge-orange':'badge-purple'}`} style={{marginRight:4}}>{d.listingType}</span>
                          ₹{Number(d.listingPrice).toLocaleString('en-IN')}
                        </div>
                      ))}
                    </td>
                    <td><span className="badge badge-green">Open</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
