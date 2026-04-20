import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { login } from '../services/api'

export default function LoginPage() {
  const [role, setRole]       = useState('ADMIN')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const { login: authLogin }  = useAuth()
  const toast                 = useToast()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await login({ role, email, password })
      authLogin(data)
      toast(`Welcome back, ${data.name}!`, 'success')
      navigate(role === 'ADMIN' ? '/admin' : '/agent')
    } catch (err) {
      setError(err.response?.data || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    if (role === 'ADMIN') { setEmail('admin@gharwale.com'); setPassword('admin123') }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <h1>Ghar<span>wale</span></h1>
          <p>Real Estate Management System</p>
        </div>

        <div className="role-tabs">
          <button className={`role-tab${role === 'ADMIN' ? ' active' : ''}`} onClick={() => { setRole('ADMIN'); setError('') }}>
            🏠 Admin / Office
          </button>
          <button className={`role-tab${role === 'AGENT' ? ' active' : ''}`} onClick={() => { setRole('AGENT'); setError('') }}>
            👤 Agent
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email" required
              placeholder={role === 'ADMIN' ? 'admin@gharwale.com' : 'agent@email.com'}
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" required
              placeholder="Enter password"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : `Sign in as ${role === 'ADMIN' ? 'Admin' : 'Agent'}`}
          </button>
        </form>

        {role === 'ADMIN' && (
          <p className="login-hint">
            Demo: <button
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px' }}
              onClick={fillDemo}
            >Fill admin credentials</button>
          </p>
        )}
        {role === 'AGENT' && (
          <p className="login-hint">Use the email address registered for the agent account.</p>
        )}
      </div>
    </div>
  )
}
