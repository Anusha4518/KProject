# Military Asset Management System

A production-ready, full-stack **Military Asset Management & Audit Platform** built with **React.js**, **Java Spring Boot**, and **MySQL**.

---

## 🏗️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Java Spring Boot 3.x, Spring Security (JWT), Spring Data JPA / Hibernate, REST APIs.
- **Database**: MySQL 8.0+ (`kproject_db`).

---

## 📁 Repository Structure

```text
Kproject/
├── database/                   # MySQL Database Scripts & Manual Setup
│   ├── schema.sql              # Database DDL (creates kproject_db and 8 tables)
│   ├── data.sql                # Seed DML (demo accounts, bases, asset records)
│   └── README.md
├── backend/                    # Java Spring Boot REST API Service
│   ├── pom.xml                 # Maven dependencies
│   └── src/
│       ├── main/java/com/military/assetmanagement/
│       │   ├── controller/    # REST API Endpoints
│       │   ├── service/       # Business Logic & Inventory Formulas
│       │   ├── repository/    # JPA Repositories
│       │   ├── model/         # Database Entities
│       │   ├── dto/           # Data Transfer Objects
│       │   ├── security/      # JWT Authentication & RBAC Filters
│       │   └── audit/         # Aspect-Oriented Audit Logging (audit_logs)
│       └── main/resources/
│           ├── application.properties
│           ├── schema.sql
│           └── data.sql
└── frontend/                   # React Single-Page Web Application
    ├── src/
    │   ├── components/        # Navbar, Sidebar, NetMovementModal
    │   ├── pages/             # Dashboard, Purchases, Transfers, Assignments, Audit Logs
    │   ├── context/           # AuthContext (JWT & Demo Quick Logins)
    │   └── api.js             # Axios API client
    └── package.json
```

---

## ⚡ Key Features & Inventory Formula

1. **Core Inventory Formula**:
   $$\text{Net Movement} = \text{Purchases} + \text{Transfers In} - \text{Transfers Out}$$
2. **Role-Based Access Control (RBAC)**:
   - **Admin**: Full access across all bases, user accounts, and system audit logs.
   - **Base Commander**: Full access restricted to their assigned base.
   - **Logistics Officer**: Can record purchases and initiate/approve asset transfers.
3. **Interactive Net Movement Modal**:
   - Clicking the **Net Movement** card on the dashboard opens a detailed audit pop-up breaking down itemized Purchases (+), Transfers In (+), and Transfers Out (-).
4. **Automated Audit Logging**:
   - Every transaction (purchases, transfers, assignments, expenditures) is automatically logged into the `audit_logs` database table with timestamp, user ID, role, action type, and details.

---

## 🚀 Local Setup Instructions

### 1. Database Setup (MySQL)
Ensure MySQL is running on `localhost:3306`.
```bash
# Option A: Import schema & data via MySQL CLI
mysql -u root -p < database/schema.sql
mysql -u root -p < database/data.sql
```
*(Note: Spring Boot is also configured to auto-create and seed `kproject_db` on launch).*

---

### 2. Backend Setup (Java Spring Boot)
```bash
cd backend

# Compile and build backend JAR
mvn clean compile

# Run Spring Boot Application (Starts REST API server on port 8080)
mvn spring-boot:run
```

---

### 3. Frontend Setup (React SPA)
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite React Dev Server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Login Accounts

You can click any demo account button on the login screen for instant evaluation:

| Role | Username | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin` | `admin123` | Global Access (All Bases) |
| **Base Commander** | `commander_alpha` | `password123` | Fort Alpha Central Command |
| **Logistics Officer** | `officer_alpha` | `password123` | Fort Alpha Central Command |

---

## 📡 REST API Endpoint Documentation

### Authentication API
- `POST /api/auth/login`: Authenticates user credentials & returns JWT Token.
- `GET /api/auth/me`: Returns current user details from JWT token payload.
- `GET /api/auth/users`: Returns all users list (ADMIN only).

### Dashboard & Metrics API
- `GET /api/dashboard/metrics`: Returns core metric totals (Opening Balance, Closing Balance, Net Movement, Assigned, Expended).
  - *Params*: `baseId` (optional), `equipmentTypeId` (optional), `startDate` (optional), `endDate` (optional).
- `GET /api/dashboard/net-movement-breakdown`: Returns detailed itemized logs for Purchases, Transfers In, and Transfers Out for the Net Movement Modal.

### Purchases API
- `GET /api/purchases`: Returns historical purchases with date range & equipment filters.
- `POST /api/purchases`: Records a new equipment purchase & auto-increments asset balance.

### Transfers API
- `GET /api/transfers`: Returns asset transfers list.
- `POST /api/transfers`: Initiates an asset transfer between bases.
- `PUT /api/transfers/{id}/status`: Updates transfer status (`APPROVED`, `COMPLETED`, `REJECTED`).

### Assignments & Expenditures API
- `GET /api/assignments`: Returns assignments & expenditures ledger.
- `POST /api/assignments`: Issues asset assignment to military personnel.
- `POST /api/assignments/expenditure`: Records consumed/expended equipment & updates closing balance.

### Audit Logs API
- `GET /api/audit-logs`: Fetches audit log history from `audit_logs` table (ADMIN & COMMANDER only).
