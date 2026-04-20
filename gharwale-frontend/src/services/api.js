import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (data)     => api.post('/auth/login', data)

// ── Agents ────────────────────────────────────────────────────────────────────
export const getAgents           = ()         => api.get('/agents')
export const getAgentById        = (id)       => api.get(`/agents/${id}`)
export const createAgent         = (data)     => api.post('/agents', data)
export const updateAgent         = (id, data) => api.put(`/agents/${id}`, data)
export const deleteAgent         = (id)       => api.delete(`/agents/${id}`)
export const setAgentStatus      = (id, status) => api.patch(`/agents/${id}/status`, { status })
export const getEmploymentHistory = (id)      => api.get(`/agents/${id}/employment-history`)
export const getAgentListings    = (id)       => api.get(`/agents/${id}/listings`)

// ── Buildings ─────────────────────────────────────────────────────────────────
export const getBuildings        = ()         => api.get('/buildings')
export const getBuildingById     = (id)       => api.get(`/buildings/${id}`)
export const createBuilding      = (data)     => api.post('/buildings', data)
export const updateBuilding      = (id, data) => api.put(`/buildings/${id}`, data)
export const deleteBuilding      = (id)       => api.delete(`/buildings/${id}`)
export const getUnits            = (id)       => api.get(`/buildings/${id}/units`)
export const addUnit             = (id, data) => api.post(`/buildings/${id}/units`, data)

// ── Listings ──────────────────────────────────────────────────────────────────
export const getListings         = (params)   => api.get('/listings', { params })
export const getListingById      = (id)       => api.get(`/listings/${id}`)
export const createListing       = (data)     => api.post('/listings', data)
export const updateListing       = (id, data) => api.put(`/listings/${id}`, data)
export const deleteListing       = (id)       => api.delete(`/listings/${id}`)

// ── Deals ─────────────────────────────────────────────────────────────────────
export const getAllDeals          = ()         => api.get('/deals')
export const closeSaleDeal       = (data)     => api.post('/deals/sale', data)
export const closeRentalDeal     = (data)     => api.post('/deals/rent', data)
export const getDealsByAgent     = (agentId)  => api.get(`/deals/agent/${agentId}`)

// ── Assignments ───────────────────────────────────────────────────────────────
export const assignAgent         = (data)          => api.post('/assignments', data)
export const unassignAgent       = (agentId, lid)  => api.delete(`/assignments/${agentId}/${lid}`)

// ── Reports ───────────────────────────────────────────────────────────────────
export const getSummary          = ()         => api.get('/reports/summary')
export const getAgentPerformance = ()         => api.get('/reports/agent-performance')
