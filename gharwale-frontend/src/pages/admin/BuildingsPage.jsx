import { useEffect, useState } from 'react'
import { getBuildings, createBuilding, updateBuilding, deleteBuilding, getUnits, addUnit } from '../../services/api'
import { useToast } from '../../components/Toast'

const BLANK_B = { buildingName:'', buildingNumber:'', locality:'', city:'', pincode:'', buildingType:'APARTMENT', yearOfConstruction: new Date().getFullYear() }
const BLANK_U = { unitNumber:'', bedrooms:2, bathrooms:1, area:'', carpetArea:'', kitchen:1, facing:'North', floor:0 }
const FACING = ['North','South','East','West','NorthEast','NorthWest','SouthEast','SouthWest']

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [showBForm, setShowBForm] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [bForm,     setBForm]     = useState(BLANK_B)
  const [unitsModal, setUnitsModal] = useState(null)  // { building, units[] }
  const [uForm,     setUForm]     = useState(BLANK_U)
  const [showUForm, setShowUForm] = useState(false)
  const toast = useToast()

  const load = () => { setLoading(true); getBuildings().then(r => setBuildings(r.data)).finally(() => setLoading(false)) }
  useEffect(load, [])

  const openAddB  = () => { setEditing(null); setBForm(BLANK_B); setShowBForm(true) }
  const openEditB = (b) => {
    setEditing(b)
    setBForm({ buildingName: b.buildingName||'', buildingNumber: b.buildingNumber, locality: b.locality,
               city: b.city, pincode: b.pincode, buildingType: b.buildingType, yearOfConstruction: b.yearOfConstruction })
    setShowBForm(true)
  }

  const handleBSubmit = async (e) => {
    e.preventDefault()
    try {
      editing ? await updateBuilding(editing.propertyId, bForm) : await createBuilding(bForm)
      toast(editing ? 'Building updated' : 'Building created', 'success')
      setShowBForm(false); load()
    } catch (err) { toast(err.response?.data || 'Error', 'error') }
  }

  const handleDeleteB = async (id) => {
    if (!confirm('Delete building?')) return
    try { await deleteBuilding(id); toast('Deleted', 'success'); load() }
    catch (err) { toast(err.response?.data || 'Cannot delete', 'error') }
  }

  const openUnits = async (b) => {
    const r = await getUnits(b.propertyId)
    setUnitsModal({ building: b, units: r.data })
    setShowUForm(false); setUForm(BLANK_U)
  }

  const handleAddUnit = async (e) => {
    e.preventDefault()
    try {
      await addUnit(unitsModal.building.propertyId, uForm)
      toast('Unit added', 'success')
      const r = await getUnits(unitsModal.building.propertyId)
      setUnitsModal(prev => ({ ...prev, units: r.data }))
      setShowUForm(false); setUForm(BLANK_U)
    } catch (err) { toast(err.response?.data || 'Error', 'error') }
  }

  const filtered = buildings.filter(b =>
    `${b.buildingName} ${b.city} ${b.locality} ${b.buildingNumber}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Buildings & Units</div>
          <div className="page-subtitle">Manage properties and their units</div>
        </div>
        <button className="btn btn-primary" onClick={openAddB}>+ Add Building</button>
      </div>

      <div className="card">
        <div className="toolbar">
          <input className="search-input" placeholder="Search buildings…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Building</th><th>Locality</th><th>City</th><th>Pincode</th><th>Type</th><th>Year</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7}><div className="empty"><div className="empty-icon">🏢</div><p>No buildings found</p></div></td></tr>
                ) : filtered.map(b => (
                  <tr key={b.propertyId}>
                    <td><strong>{b.buildingName || '—'}</strong><br/><span style={{fontSize:12,color:'var(--muted)'}}>#{b.buildingNumber}</span></td>
                    <td>{b.locality}</td>
                    <td>{b.city}</td>
                    <td>{b.pincode}</td>
                    <td><span className={`badge ${b.buildingType === 'APARTMENT' ? 'badge-blue' : 'badge-orange'}`}>{b.buildingType}</span></td>
                    <td>{b.yearOfConstruction}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-sm btn-ghost" onClick={() => openEditB(b)}>✏️</button>
                        <button className="btn btn-sm btn-outline" onClick={() => openUnits(b)}>🚪 Units</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteB(b.propertyId)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Building form modal */}
      {showBForm && (
        <div className="modal-overlay" onClick={() => setShowBForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Building' : 'Add Building'}</div>
              <button className="modal-close" onClick={() => setShowBForm(false)}>×</button>
            </div>
            <form onSubmit={handleBSubmit}>
              <div className="form-grid">
                <div className="form-group"><label>Building Name</label>
                  <input value={bForm.buildingName} onChange={e => setBForm({...bForm, buildingName: e.target.value})} /></div>
                <div className="form-group"><label>Building Number *</label>
                  <input required value={bForm.buildingNumber} onChange={e => setBForm({...bForm, buildingNumber: e.target.value})} /></div>
                <div className="form-group full"><label>Locality *</label>
                  <input required value={bForm.locality} onChange={e => setBForm({...bForm, locality: e.target.value})} /></div>
                <div className="form-group"><label>City *</label>
                  <input required value={bForm.city} onChange={e => setBForm({...bForm, city: e.target.value})} /></div>
                <div className="form-group"><label>Pincode *</label>
                  <input required maxLength={6} pattern="[0-9]{6}" value={bForm.pincode} onChange={e => setBForm({...bForm, pincode: e.target.value})} /></div>
                <div className="form-group"><label>Type *</label>
                  <select value={bForm.buildingType} onChange={e => setBForm({...bForm, buildingType: e.target.value})}>
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                  </select>
                </div>
                <div className="form-group"><label>Year of Construction *</label>
                  <input required type="number" value={bForm.yearOfConstruction} onChange={e => setBForm({...bForm, yearOfConstruction: e.target.value})} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowBForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Units modal */}
      {unitsModal && (
        <div className="modal-overlay" onClick={() => setUnitsModal(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">🚪 Units — {unitsModal.building.buildingName || unitsModal.building.buildingNumber}</div>
              <button className="modal-close" onClick={() => setUnitsModal(null)}>×</button>
            </div>
            <div className="table-wrap" style={{marginBottom:16}}>
              <table>
                <thead><tr><th>Unit</th><th>Floor</th><th>Beds</th><th>Baths</th><th>Area (sq ft)</th><th>Facing</th></tr></thead>
                <tbody>
                  {unitsModal.units.length === 0 ? (
                    <tr><td colSpan={6}><div className="empty"><p>No units yet</p></div></td></tr>
                  ) : unitsModal.units.map(u => (
                    <tr key={u.unitNumber}>
                      <td><strong>{u.unitNumber}</strong></td>
                      <td>{u.floor}</td><td>{u.bedrooms}</td><td>{u.bathrooms}</td>
                      <td>{u.area}</td><td>{u.facing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!showUForm ? (
              <button className="btn btn-outline" onClick={() => setShowUForm(true)}>+ Add Unit</button>
            ) : (
              <form onSubmit={handleAddUnit}>
                <div style={{fontWeight:600, marginBottom:10, fontSize:14}}>New Unit</div>
                <div className="form-grid-3">
                  <div className="form-group"><label>Unit No *</label>
                    <input required value={uForm.unitNumber} onChange={e => setUForm({...uForm, unitNumber: e.target.value})} /></div>
                  <div className="form-group"><label>Floor *</label>
                    <input required type="number" min={0} value={uForm.floor} onChange={e => setUForm({...uForm, floor: e.target.value})} /></div>
                  <div className="form-group"><label>Bedrooms *</label>
                    <input required type="number" min={0} value={uForm.bedrooms} onChange={e => setUForm({...uForm, bedrooms: e.target.value})} /></div>
                  <div className="form-group"><label>Bathrooms *</label>
                    <input required type="number" min={0} value={uForm.bathrooms} onChange={e => setUForm({...uForm, bathrooms: e.target.value})} /></div>
                  <div className="form-group"><label>Area (sq ft) *</label>
                    <input required type="number" step="0.01" value={uForm.area} onChange={e => setUForm({...uForm, area: e.target.value})} /></div>
                  <div className="form-group"><label>Carpet Area</label>
                    <input type="number" step="0.01" value={uForm.carpetArea} onChange={e => setUForm({...uForm, carpetArea: e.target.value})} /></div>
                  <div className="form-group"><label>Kitchen</label>
                    <input type="number" min={0} value={uForm.kitchen} onChange={e => setUForm({...uForm, kitchen: e.target.value})} /></div>
                  <div className="form-group"><label>Facing *</label>
                    <select value={uForm.facing} onChange={e => setUForm({...uForm, facing: e.target.value})}>
                      {FACING.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer" style={{paddingTop:12}}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowUForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Add Unit</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
