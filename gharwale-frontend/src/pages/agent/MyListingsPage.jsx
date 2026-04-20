import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAgentListings } from '../../services/api'
import { useNavigate } from 'react-router-dom'

export default function MyListingsPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [listings, setListings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('all')

  useEffect(() => {
    getAgentListings(user.id).then(r => setListings(r.data)).finally(() => setLoading(false))
  }, [user.id])

  const statusColors = { Open:'badge-green', Closed:'badge-gray', Sold:'badge-blue', Rented:'badge-purple' }

  const filtered = filter === 'all' ? listings : listings.filter(l => l.status.toLowerCase() === filter)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Listings</div>
          <div className="page-subtitle">All listings assigned to you</div>
        </div>
        <button className="btn btn-success" onClick={() => navigate('/agent/close')}>✅ Close a Deal</button>
      </div>

      <div className="card">
        <div className="toolbar">
          {['all','open','sold','rented'].map(s => (
            <button key={s} className={`btn btn-sm ${filter===s?'btn-primary':'btn-ghost'}`}
              onClick={() => setFilter(s)} style={{textTransform:'capitalize'}}>
              {s} {s==='all' ? `(${listings.length})` :
                   `(${listings.filter(l=>l.status.toLowerCase()===s).length})`}
            </button>
          ))}
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Property</th><th>Unit</th><th>Owner</th><th>Type / Price</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7}><div className="empty"><div className="empty-icon">📋</div><p>No listings in this category</p></div></td></tr>
                ) : filtered.map(l => (
                  <tr key={l.listingId}>
                    <td><strong>#{l.listingId}</strong></td>
                    <td>
                      <div style={{fontWeight:500}}>{l.buildingName || `Building #${l.propertyId}`}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{l.locality}, {l.city}</div>
                    </td>
                    <td>{l.unitNumber} · Floor {l.floor}<br/><span style={{fontSize:12,color:'var(--muted)'}}>{l.bedrooms} bed · {l.bathrooms} bath</span></td>
                    <td>
                      <div style={{fontWeight:500}}>{l.ownerName}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{l.ownerPhone}</div>
                    </td>
                    <td>
                      {l.details?.map(d => (
                        <div key={d.listingType} style={{marginBottom:2}}>
                          <span className={`badge ${d.listingType==='SALE'?'badge-orange':'badge-purple'}`} style={{marginRight:4}}>{d.listingType}</span>
                          <strong>₹{Number(d.listingPrice).toLocaleString('en-IN')}</strong>
                        </div>
                      ))}
                    </td>
                    <td><span className={`badge ${statusColors[l.status]||'badge-gray'}`}>{l.status}</span></td>
                    <td>
                      {l.status === 'Open' && (
                        <button className="btn btn-sm btn-success"
                          onClick={() => navigate('/agent/close', { state: { listingId: l.listingId, listingType: l.details?.[0]?.listingType } })}>
                          Close Deal
                        </button>
                      )}
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
