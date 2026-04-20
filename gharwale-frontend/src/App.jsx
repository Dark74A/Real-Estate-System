import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage      from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AgentsPage     from './pages/admin/AgentsPage'
import BuildingsPage  from './pages/admin/BuildingsPage'
import ListingsPage   from './pages/admin/ListingsPage'
import DealsPage      from './pages/admin/DealsPage'
import ReportsPage    from './pages/admin/ReportsPage'
import AgentDashboard from './pages/agent/AgentDashboard'
import MyListingsPage from './pages/agent/MyListingsPage'
import MyDealsPage    from './pages/agent/MyDealsPage'
import CloseDealPage  from './pages/agent/CloseDealPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/"      element={<Navigate to="/login" replace />} />

            <Route path="/admin"           element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/agents"    element={<ProtectedRoute role="ADMIN"><AgentsPage /></ProtectedRoute>} />
            <Route path="/admin/buildings" element={<ProtectedRoute role="ADMIN"><BuildingsPage /></ProtectedRoute>} />
            <Route path="/admin/listings"  element={<ProtectedRoute role="ADMIN"><ListingsPage /></ProtectedRoute>} />
            <Route path="/admin/deals"     element={<ProtectedRoute role="ADMIN"><DealsPage /></ProtectedRoute>} />
            <Route path="/admin/reports"   element={<ProtectedRoute role="ADMIN"><ReportsPage /></ProtectedRoute>} />

            <Route path="/agent"           element={<ProtectedRoute role="AGENT"><AgentDashboard /></ProtectedRoute>} />
            <Route path="/agent/listings"  element={<ProtectedRoute role="AGENT"><MyListingsPage /></ProtectedRoute>} />
            <Route path="/agent/deals"     element={<ProtectedRoute role="AGENT"><MyDealsPage /></ProtectedRoute>} />
            <Route path="/agent/close"     element={<ProtectedRoute role="AGENT"><CloseDealPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
