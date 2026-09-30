# Database Instructions (`kproject_db`)

This directory contains the complete MySQL relational schema and seed dataset for the **Military Asset Management System**.

---

## 📁 File Structure

```text
database/
├── schema.sql      # Database DDL: Creates `kproject_db` and all 8 tables
├── data.sql        # Seed DML: Pre-populates accounts, bases, assets & logs
└── README.md       # Database setup guide
```

---

## 🛠️ Database Setup Instructions

### Option 1: Automatic Setup via Spring Boot
When you start the Spring Boot backend (`backend/`), it is configured to auto-create `kproject_db` and populate the schema and initial seed data automatically via JPA and `spring.sql.init`.

### Option 2: Manual Import via MySQL CLI
If you wish to import the database manually:

```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Source the schema file
mysql -u root -p < database/schema.sql

# 3. Source the seed data file
mysql -u root -p < database/data.sql
```

---

## 📊 Database Schema Overview

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| `bases` | Military command posts and bases | `id`, `name`, `code`, `location` |
| `equipment_types` | Tactical asset categories & units | `id`, `name`, `category`, `unit_of_measure` |
| `users` | Accounts with RBAC roles | `id`, `username`, `password`, `role`, `base_id` |
| `asset_balances` | Inventory balances per base/item | `base_id`, `equipment_type_id`, `opening_balance`, `closing_balance`, `assigned_quantity`, `expended_quantity` |
| `purchases` | Equipment acquisitions log | `purchase_code`, `base_id`, `equipment_type_id`, `quantity`, `unit_cost`, `total_cost` |
| `transfers` | Inter-base asset movements | `transfer_code`, `source_base_id`, `destination_base_id`, `status` |
| `assignments` | Personnel issuances & expenditures | `assignment_code`, `personnel_name`, `quantity`, `type`, `status` |
| `audit_logs` | Immutable security audit trail | `timestamp`, `username`, `user_role`, `action_type`, `details` |

---

## 🔑 Demo Account Credentials

All default passwords in `data.sql` are BCrypt encrypted for `admin123` or `password123`:

- **Admin**: `admin` / `admin123` (Role: `ADMIN`)
- **Base Commander**: `commander_alpha` / `password123` (Role: `BASE_COMMANDER`, Base: Fort Alpha)
- **Logistics Officer**: `officer_alpha` / `password123` (Role: `LOGISTICS_OFFICER`, Base: Fort Alpha)
