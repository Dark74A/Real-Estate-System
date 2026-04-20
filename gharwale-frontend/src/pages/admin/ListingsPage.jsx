import { useEffect, useState } from 'react'
import { getListings, createListing, deleteListing, getAgents, getBuildings, getUnits, assignAgent } from '../../services/api'
import { useToast } from '../../components/Toast'

const BLANK = { propertyId:'', unitNumber:'', ownerPhone:'', ownerEmail:'', ownerFirstName:'', ownerLastName:'', listingType:'SALE', listingPrice:'', listingDate: new Date().toISOString().split('T')[0] }

export default function ListingsPage() {
  const [listings,  setListings]  = useState([])
  const [agents,    setAgents]    = useState([])
  const [buildings, setBuildings] = useState([])
  const [units,     setUnits]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [cityFilter, setCityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState(BLANK)
  const [assignModal, setAssignModal] = useState(null)
  const [assignAgentId, setAssignAgentId] = useState('')
  const toast = useToast()

  const load = () => {
    setLoading(true)
    const params = {}
    if (cityFilter) params.city = cityFilter
    if (statusFilter) params.status = statusFilter
    getListings(params).then(r => setListings(r.data)).finally(() => setLoading(false))
  }

  useEffect(load, [cityFilter, statusFilter])
  useEffect(() => {
    getAgents().then(r => setAgents(r.data))
    getBuildings().then(r => setBuildings(r.data))
  }, [])

  const onBuildingChange = async (pid) => {
    setForm(f => ({...f, propertyId: pid, unitNumber: ''}))
    if (pid) { const r = await getUnits(pid); setUnits(r.data) }
    else setUnits([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createListing(form)
      toast('Listing created', 'success')
      setShowForm(false); setForm(BLANK); load()
    } catch (err) { toast(err.response?.data || 'Error creating listing', 'error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete listing?')) return
    try { await deleteListing(id); toast('Deleted', 'success'); load() }
    catch (err) { toast(err.response?.data || 'Cannot delete', 'error') }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    try {
      await assignAgent({ agentId: parseInt(assignAgentId), listingId: assignModal.listingId })
      toast('Agent assigned', 'success')
      setAssignModal(null)
    } catch (err) { toast(err.response?.data || 'Error', 'error') }
  }

  const statusColors = { Open:'badge-green', Closed:'badge-gray', Sold:'badge-blue', Rented:'badge-purple' }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Listings</div>
          <div className="page-subtitle">All property listings</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(BLANK); setShowForm(true) }}>+ New Listing</button>
      </div>

      <div className="card">
        <div className="toolbar">
          <input className="search-input" placeholder="Filter by city…" value={cityFilter} onChange={e => setCityFilter(e.target.value)} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{padding:'8px 12px', borderRadius:7, border:'1.5px solid var(--border)', fontSize:13}}>
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
          <span className="text-muted" style={{fontSize:13}}>{listings.length} listings</span>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Property</th><th>Unit</th><th>Owner</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {listings.length === 0 ? (
                  <tr><td colSpan={8}><div className="empty"><div className="empty-icon">📋</div><p>No listings found</p></div></td></tr>
                ) : listings.map(l => (
                  <tr key={l.listingId}>
                    <td><strong>#{l.listingId}</strong></td>
                    <td>
                      <div style={{fontWeight:500}}>{l.buildingName || `Building #${l.propertyId}`}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{l.locality}, {l.city}</div>
                    </td>
                    <td>{l.unitNumber} · Floor {l.floor}</td>
                    <td>
                      <div style={{fontWeight:500}}>{l.ownerName}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{l.ownerPhone}</div>
                    </td>
                    <td>
                      {l.details?.map(d => (
                        <span key={d.listingType} className={`badge ${d.listingType==='SALE'?'badge-orange':'badge-purple'}`} style={{marginRight:4}}>
                          {d.listingType}
                        </span>
                      ))}
                    </td>
                    <td>
                      {l.details?.map(d => (
                        <div key={d.listingType} style={{fontSize:13}}>
                          ₹{Number(d.listingPrice).toLocaleString('en-IN')}
                        </div>
                      ))}
                    </td>
                    <td><span className={`badge ${statusColors[l.status]||'badge-gray'}`}>{l.status}</span></td>
                    <td>
                      <div className="actions-cell">
                        {l.status === 'Open' && (
                          <button className="btn btn-sm btn-outline" onClick={() => { setAssignModal(l); setAssignAgentId('') }}>👤 Assign</button>
                        )}
                        {l.status === 'Open' && (
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(l.listingId)}>🗑</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create listing modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">New Listing</div>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{fontWeight:600, fontSize:13, color:'var(--muted)', marginBottom:8}}>PROPERTY</div>
              <div className="form-grid" style={{marginBottom:16}}>
                <div className="form-group">
                  <label>Building *</label>
                  <select required value={form.propertyId} onChange={e => onBuildingChange(e.target.value)}>
                    <option value="">Select building…</option>
                    {buildings.map(b => <option key={b.propertyId} value={b.propertyId}>{b.buildingName || b.buildingNumber} — {b.city}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Unit *</label>
                  <select required value={form.unitNumber} onChange={e => setForm({...form, unitNumber: e.target.value})}>
                    <option value="">Select unit…</option>
                    {units.map(u => <option key={u.unitNumber} value={u.unitNumber}>{u.unitNumber} (Floor {u.floor}, {u.bedrooms}BHK)</option>)}
                  </select>
                </div>
              </div>
              <div style={{fontWeight:600, fontSize:13, color:'var(--muted)', marginBottom:8}}>OWNER</div>
              <div className="form-grid" style={{marginBottom:16}}>
                <div className="form-group"><label>Phone (lookup)</label>
                  <input value={form.ownerPhone} placeholder="Existing owner phone" onChange={e => setForm({...form, ownerPhone: e.target.value})} /></div>
                <div className="form-group"><label>Email (lookup)</label>
                  <input type="email" value={form.ownerEmail} placeholder="Existing owner email" onChange={e => setForm({...form, ownerEmail: e.target.value})} /></div>
                <div className="form-group"><label>First Name (if new)</label>
                  <input value={form.ownerFirstName} onChange={e => setForm({...form, ownerFirstName: e.target.value})} /></div>
                <div className="form-group"><label>Last Name</label>
                  <input value={form.ownerLastName} onChange={e => setForm({...form, ownerLastName: e.target.value})} /></div>
              </div>
              <div style={{fontWeight:600, fontSize:13, color:'var(--muted)', marginBottom:8}}>LISTING DETAILS</div>
              <div className="form-grid">
                <div className="form-group"><label>Type *</label>
                  <select value={form.listingType} onChange={e => setForm({...form, listingType: e.target.value})}>
                    <option value="SALE">For Sale</option>
                    <option value="RENT">For Rent</option>
                  </select>
                </div>
                <div className="form-group"><label>Price (₹) *</label>
                  <input required type="number" step="0.01" value={form.listingPrice} onChange={e => setForm({...form, listingPrice: e.target.value})} /></div>
                <div className="form-group"><label>Listing Date *</label>
                  <input required type="date" value={form.listingDate} onChange={e => setForm({...form, listingDate: e.target.value})} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign agent modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Assign Agent — Listing #{assignModal.listingId}</div>
              <button className="modal-close" onClick={() => setAssignModal(null)}>×</button>
            </div>
            <form onSubmit={handleAssign}>
              <div className="form-group" style={{marginBottom:16}}>
                <label>Select Agent *</label>
                <select required value={assignAgentId} onChange={e => setAssignAgentId(e.target.value)}>
                  <option value="">Choose agent…</option>
                  {agents.filter(a => a.agentStatus === 'Active').map(a => (
                    <option key={a.agentId} value={a.agentId}>{a.firstName} {a.lastName} — {a.email}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setAssignModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
