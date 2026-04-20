import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminNav = [
  { to: '/admin',          icon: '⊞', label: 'Dashboard'  },
  { to: '/admin/agents',   icon: '👤', label: 'Agents'     },
  { to: '/admin/buildings',icon: '🏢', label: 'Buildings'  },
  { to: '/admin/listings', icon: '📋', label: 'Listings'   },
  { to: '/admin/deals',    icon: '🤝', label: 'Deals'      },
  { to: '/admin/reports',  icon: '📊', label: 'Reports'    },
]

const agentNav = [
  { to: '/agent',          icon: '⊞', label: 'Dashboard'  },
  { to: '/agent/listings', icon: '📋', label: 'My Listings'},
  { to: '/agent/deals',    icon: '🤝', label: 'My Deals'   },
  { to: '/agent/close',    icon: '✅', label: 'Close Deal' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const nav = user?.role === 'ADMIN' ? adminNav : agentNav

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Ghar<span>wale</span></h2>
        <div className="sidebar-role">{user?.role}</div>
      </div>

      <nav className="sidebar-nav">
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/agent'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <strong>{user?.name}</strong>
          {user?.email}
        </div>
        <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
      </div>
    </aside>
  )
}
