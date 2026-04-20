import { useEffect, useState } from 'react'
import {
  getAgents, createAgent, updateAgent, deleteAgent,
  setAgentStatus, getEmploymentHistory
} from '../../services/api'
import { useToast } from '../../components/Toast'

const BLANK = { firstName:'', middleName:'', lastName:'', phoneNo:'', email:'', licenseNo:'', salary:'', aadhaarNumber:'' }

export default function AgentsPage() {
  const [agents,  setAgents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(BLANK)
  const [empModal, setEmpModal] = useState(null)   // { agent, history[] }
  const [empLoading, setEmpLoading] = useState(false)
  const toast = useToast()

  const load = () => {
    setLoading(true)
    getAgents().then(r => setAgents(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd  = () => { setEditing(null); setForm(BLANK); setShowForm(true) }
  const openEdit = (a) => {
    setEditing(a)
    setForm({ firstName: a.firstName, middleName: a.middleName || '', lastName: a.lastName || '',
              phoneNo: a.phoneNo, email: a.email, licenseNo: a.licenseNo,
              salary: a.salary, aadhaarNumber: a.aadhaarNumber })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateAgent(editing.agentId, form)
        toast('Agent updated', 'success')
      } else {
        await createAgent(form)
        toast('Agent created', 'success')
      }
      setShowForm(false); load()
    } catch (err) {
      toast(err.response?.data || 'Error saving agent', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this agent?')) return
    try { await deleteAgent(id); toast('Agent deleted', 'success'); load() }
    catch (err) { toast(err.response?.data || 'Cannot delete agent', 'error') }
  }

  const toggleStatus = async (a) => {
    const next = a.agentStatus === 'Active' ? 'Inactive' : 'Active'
    try {
      await setAgentStatus(a.agentId, next)
      toast(`Agent set to ${next}`, 'success')
      load()
    } catch (err) { toast(err.response?.data || 'Error', 'error') }
  }

  const openEmpHistory = async (a) => {
    setEmpLoading(true)
    setEmpModal({ agent: a, history: [] })
    const r = await getEmploymentHistory(a.agentId)
    console.log(r.data);
    setEmpModal({ agent: a, history: r.data })
    setEmpLoading(false)
  }

  const filtered = agents.filter(a =>
    `${a.firstName} ${a.lastName} ${a.email} ${a.licenseNo}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Agents</div>
          <div className="page-subtitle">Manage all registered agents</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Agent</button>
      </div>

      <div className="card">
        <div className="toolbar">
          <input className="search-input" placeholder="Search agents…" value={search}
            onChange={e => setSearch(e.target.value)} />
          <span className="text-muted" style={{fontSize:13}}>{filtered.length} agents</span>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Phone</th>
                  <th>License</th><th>Salary</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7}><div className="empty"><div className="empty-icon">👤</div><p>No agents found</p></div></td></tr>
                ) : filtered.map(a => (
                  <tr key={a.agentId}>
                    <td><strong>{a.firstName} {a.lastName}</strong></td>
                    <td>{a.email}</td>
                    <td>{a.phoneNo}</td>
                    <td><code style={{fontSize:12}}>{a.licenseNo}</code></td>
                    <td>₹{Number(a.salary).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${a.agentStatus === 'Active' ? 'badge-green' : 'badge-red'}`}>
                        {a.agentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-sm btn-ghost" onClick={() => openEdit(a)}>✏️</button>
                        <button className="btn btn-sm btn-outline" onClick={() => toggleStatus(a)}>
                          {a.agentStatus === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-sm btn-ghost" onClick={() => openEmpHistory(a)}>📋 History</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.agentId)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Agent Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Agent' : 'Add New Agent'}</div>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Middle Name</label>
                  <input value={form.middleName} onChange={e => setForm({...form, middleName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input required value={form.phoneNo} onChange={e => setForm({...form, phoneNo: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>License No *</label>
                  <input required value={form.licenseNo} onChange={e => setForm({...form, licenseNo: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Salary (₹) *</label>
                  <input required type="number" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Aadhaar (12 digits) *</label>
                  <input required maxLength={12} pattern="[0-9]{12}" value={form.aadhaarNumber}
                    onChange={e => setForm({...form, aadhaarNumber: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create Agent'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employment History Modal */}
      {empModal && (
        <div className="modal-overlay" onClick={() => setEmpModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">📋 Employment History — {empModal.agent.firstName} {empModal.agent.lastName}</div>
              <button className="modal-close" onClick={() => setEmpModal(null)}>×</button>
            </div>
            {empLoading ? <div className="loading">Loading…</div> : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Date of Joining</th><th>Date of Leaving</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {empModal.history.length === 0 ? (
                      <tr><td colSpan={3}><div className="empty"><p>No history records</p></div></td></tr>
                    ) : empModal.history.map((h, i) => (
                      <tr key={i}>
                        <td>{h.dateOfJoining}</td>
                        <td>{h.dateOfLeaving || '—'}</td>
                        <td><span className={`badge ${h.status === 'Current' ? 'badge-green' : 'badge-gray'}`}>{h.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
