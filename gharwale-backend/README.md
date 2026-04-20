# 🏠 Gharwale — Real Estate Management System

A full-stack Real Estate Management System built with **Spring Boot** (backend) and **React + Vite** (frontend), backed by a **MySQL** database.

---

## 📁 Project Structure

```
gharwale/
├── gharwale-backend/       # Spring Boot REST API
└── gharwale-frontend/      # React + Vite SPA
```

---

## ⚙️ Prerequisites

| Tool       | Version  |
|------------|----------|
| Java       | 17+      |
| Maven      | 3.8+     |
| Node.js    | 18+      |
| MySQL      | 8.0+     |

---

## 🗄️ Database Setup

1. Open MySQL and run the full schema SQL (provided separately as `gharwale_schema.sql`).
2. This creates the `gharwale` database with all tables and triggers.

---

## 🔧 Backend Setup

### 1. Configure DB credentials

Edit `gharwale-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gharwale?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USER
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 2. Run the backend

```bash
cd gharwale-backend
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

---

## 💻 Frontend Setup

```bash
cd gharwale-frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**

> The Vite dev server proxies `/api/*` → `http://localhost:8080/*` automatically.

---

## 🔐 Login Credentials (Demo)

### Admin
- **Email:** admin@gharwale.com
- **Password:** admin123

### Agent
- **Email:** *(use any agent's registered email in the DB)*
- **Password:** *(any — password is not validated in demo mode)*

---

## 🧭 Features by Role

### 🏢 Admin
| Feature | Details |
|---------|---------|
| Dashboard | Total agents, listings, deals, revenue |
| Agents | Add / Edit / Delete / Activate / Deactivate |
| Employment History | Auto-tracked via DB triggers |
| Buildings & Units | Full CRUD |
| Listings | Create with owner lookup/create, filter by city/status |
| Deals | View all sale & rental deals |
| Assignments | Assign agents to listings |
| Reports | Agent performance leaderboard, revenue summary |

### 👤 Agent
| Feature | Details |
|---------|---------|
| Dashboard | My stats, recent activity |
| My Listings | All open listings assigned to me |
| My Deals | My closed sales and rentals |
| Close Deal | Close a sale or rental with buyer/tenant lookup |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login (Admin or Agent) |
| GET | `/agents` | All agents |
| POST | `/agents` | Create agent |
| PUT | `/agents/{id}` | Update agent |
| DELETE | `/agents/{id}` | Delete agent |
| PATCH | `/agents/{id}/status` | Activate/Deactivate |
| GET | `/agents/{id}/employment-history` | Employment history |
| GET | `/agents/{id}/listings` | Agent's assigned listings |
| GET | `/buildings` | All buildings |
| POST | `/buildings` | Add building |
| GET | `/buildings/{id}/units` | Units in building |
| POST | `/buildings/{id}/units` | Add unit |
| GET | `/listings` | All listings (filter: city, status) |
| POST | `/listings` | Create listing |
| PUT | `/listings/{id}` | Update listing |
| DELETE | `/listings/{id}` | Delete listing |
| GET | `/deals` | All deals (sales + rentals) |
| POST | `/deals/sale` | Close a sale deal |
| POST | `/deals/rent` | Close a rental deal |
| GET | `/deals/agent/{id}` | Deals by agent |
| POST | `/assignments` | Assign agent to listing |
| DELETE | `/assignments/{agentId}/{listingId}` | Remove assignment |
| GET | `/reports/summary` | Dashboard summary |
| GET | `/reports/agent-performance` | Agent performance data |

---

## 🗃️ Key DB Triggers (auto-managed)

| Trigger | Action |
|---------|--------|
| `trgAgentAfterInsert` | Creates EmploymentHistory on new agent |
| `trgAgentAfterUpdate` | Updates EmploymentHistory on status change |
| `trgSaleAfterInsert` | Sets listing status → `Sold` |
| `trgRentalAfterInsert` | Sets listing status → `Rented` |
| `trgCheckClosingDateSale` | Validates closing date ≥ listing date |
| `trgCheckClosingDateRental` | Validates closing date ≥ listing date |

---

## 🏗️ Architecture

```
Frontend (React)
    │  Axios → /api/*
    ▼
Vite Proxy → localhost:8080
    │
Spring Boot
    ├── Controller  (REST endpoints)
    ├── Service     (Business logic)
    ├── Repository  (JPA/Hibernate)
    └── MySQL DB (gharwale)
```
