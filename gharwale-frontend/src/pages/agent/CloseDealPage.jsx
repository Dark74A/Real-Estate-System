import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { closeSaleDeal, closeRentalDeal, getAgentListings } from '../../services/api'
import { useToast } from '../../components/Toast'

const BLANK_PERSON = { firstName:'', lastName:'', phone:'', email:'' }

export default function CloseDealPage() {
  const { user }    = useAuth()
  const location    = useLocation()
  const toast       = useToast()
  const [type,      setType]     = useState(location.state?.listingType || 'SALE')
  const [listings,  setListings] = useState([])
  const [listingId, setListingId] = useState(location.state?.listingId || '')
  const [dateClosed, setDateClosed] = useState(new Date().toISOString().split('T')[0])
  const [price,     setPrice]    = useState('')
  const [person,    setPerson]   = useState(BLANK_PERSON)
  const [success,   setSuccess]  = useState(false)
  const [loading,   setLoading]  = useState(false)

  useEffect(() => {
    getAgentListings(user.id).then(r =>
      setListings(r.data.filter(l => l.status === 'Open'))
    )
  }, [user.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!listingId) return toast('Select a listing', 'error')
    setLoading(true)
    try {
      const payload = {
        listingId: parseInt(listingId),
        agentId:   user.id,
        dateClosed,
        ...(type === 'SALE'
          ? { salePrice: price, buyerPhone: person.phone, buyerEmail: person.email, buyerFirstName: person.firstName, buyerLastName: person.lastName }
          : { rentPrice: price, tenantPhone: person.phone, tenantEmail: person.email, tenantFirstName: person.firstName, tenantLastName: person.lastName }
        )
      }
      type === 'SALE' ? await closeSaleDeal(payload) : await closeRentalDeal(payload)
      toast('Deal closed successfully! 🎉', 'success')
      setSuccess(true)
    } catch (err) {
      toast(err.response?.data || 'Error closing deal', 'error')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setSuccess(false); setListingId(''); setPrice(''); setPerson(BLANK_PERSON) }

  if (success) {
    return (
      <div>
        <div className="page-title" style={{marginBottom:24}}>Close a Deal</div>
        <div className="card" style={{textAlign:'center', padding:'60px 20px'}}>
          <div style={{fontSize:60, marginBottom:16}}>🎉</div>
          <h2 style={{fontSize:22, fontWeight:700, marginBottom:8}}>Deal Closed Successfully!</h2>
          <p style={{color:'var(--muted)', marginBottom:24}}>The listing status has been updated automatically.</p>
          <div style={{display:'flex', gap:12, justifyContent:'center'}}>
            <button className="btn btn-primary" onClick={reset}>Close Another Deal</button>
            <a href="/agent/deals" className="btn btn-ghost">View My Deals</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Close a Deal</div>
          <div className="page-subtitle">Record a sale or rental closing</div>
        </div>
      </div>

      <div className="card" style={{maxWidth:640}}>
        {/* Deal type toggle */}
        <div className="role-tabs" style={{marginBottom:24}}>
          <button className={`role-tab${type==='SALE'?' active':''}`} onClick={() => setType('SALE')}>
            🏷 Sale Deal
          </button>
          <button className={`role-tab${type==='RENT'?' active':''}`} onClick={() => setType('RENT')}>
            🔑 Rental Deal
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{fontWeight:600, fontSize:12.5, color:'var(--muted)', marginBottom:10, textTransform:'uppercase', letterSpacing:'.5px'}}>Deal Info</div>
          <div className="form-grid" style={{marginBottom:20}}>
            <div className="form-group full">
              <label>Listing *</label>
              <select required value={listingId} onChange={e => setListingId(e.target.value)}>
                <option value="">Select open listing…</option>
                {listings.map(l => (
                  <option key={l.listingId} value={l.listingId}>
                    #{l.listingId} — {l.buildingName || `Building #${l.propertyId}`}, Unit {l.unitNumber}, {l.city}
                  </option>
                ))}
              </select>
              {listings.length === 0 && <span style={{fontSize:12, color:'var(--danger)'}}>No open listings assigned to you</span>}
            </div>
            <div className="form-group">
              <label>{type === 'SALE' ? 'Sale Price (₹)' : 'Monthly Rent (₹)'} *</label>
              <input required type="number" step="0.01" placeholder="e.g. 4500000" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Date Closed *</label>
              <input required type="date" value={dateClosed} onChange={e => setDateClosed(e.target.value)} />
            </div>
          </div>

          <hr className="divider" />
          <div style={{fontWeight:600, fontSize:12.5, color:'var(--muted)', margin:'16px 0 10px', textTransform:'uppercase', letterSpacing:'.5px'}}>
            {type === 'SALE' ? 'Buyer' : 'Tenant'} Details
          </div>
          <p style={{fontSize:12.5, color:'var(--muted)', marginBottom:12}}>
            Enter phone or email to look up an existing person, or fill all fields to create a new one.
          </p>
          <div className="form-grid">
            <div className="form-group">
              <label>Phone (lookup)</label>
              <input placeholder="10-digit phone" value={person.phone} onChange={e => setPerson({...person, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email (lookup)</label>
              <input type="email" placeholder="email@example.com" value={person.email} onChange={e => setPerson({...person, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>First Name (if new)</label>
              <input value={person.firstName} onChange={e => setPerson({...person, firstName: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={person.lastName} onChange={e => setPerson({...person, lastName: e.target.value})} />
            </div>
          </div>

          <div className="modal-footer" style={{paddingTop:20}}>
            <button type="submit" className="btn btn-success" disabled={loading} style={{minWidth:160}}>
              {loading ? 'Processing…' : `✅ Close ${type === 'SALE' ? 'Sale' : 'Rental'} Deal`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
