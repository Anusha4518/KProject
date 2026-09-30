-- Military Asset Management System - Initial Seed Data
USE kproject_db;

-- 1. Bases
INSERT INTO bases (id, name, code, location, command_region) VALUES
(1, 'Fort Alpha Central Command', 'BASE-01', 'Virginia HQ Region', 'NORTHERN_HQ'),
(2, 'Forward Operating Base Bravo', 'BASE-02', 'Nevada Defense Outpost', 'WESTERN_THEATER'),
(3, 'Naval Logistics Outpost Charlie', 'BASE-03', 'San Diego Docklands', 'PACIFIC_FLEET'),
(4, 'Air Defense Garrison Delta', 'BASE-04', 'Colorado Springs Facility', 'AIR_SPACE_CMD');

-- 2. Equipment Types
INSERT INTO equipment_types (id, name, category, unit_of_measure, description) VALUES
(1, 'M4A1 Carbine 5.56mm', 'WEAPONRY', 'UNITS', 'Standard tactical assault rifle with optic rails'),
(2, 'HMMWV Armored Vehicle', 'VEHICLES', 'UNITS', 'High Mobility Multipurpose Wheeled Transport'),
(3, 'AN/PRC-152 Tactical Radio', 'COMMUNICATION', 'UNITS', 'Handheld multiband tactical radio transceiver'),
(4, '5.56x45mm NATO Ammo Box (1,000 rds)', 'AMMUNITION', 'BOXES', 'Mil-spec armor-piercing standard ammunition'),
(5, 'AN/PVS-14 Night Vision Goggles', 'GEAR', 'UNITS', 'Monocular tactical night vision device'),
(6, 'Modular Tactical Plate Carrier', 'GEAR', 'SETS', 'Ballistic vest body armor system');

-- 3. Users (Passwords: admin123 or password123)
INSERT INTO users (id, username, password, full_name, role, base_id, email, rank_title) VALUES
(1, 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQvq47a', 'General Vance Vance', 'ADMIN', NULL, 'vance@defense.gov', 'General (O-10)'),
(2, 'commander_alpha', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQvq47a', 'Col. Marcus Vance', 'BASE_COMMANDER', 1, 'm.vance@base-alpha.gov', 'Colonel (O-6)'),
(3, 'commander_bravo', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQvq47a', 'Col. Sarah Jenkins', 'BASE_COMMANDER', 2, 's.jenkins@base-bravo.gov', 'Colonel (O-6)'),
(4, 'officer_alpha', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQvq47a', 'Lt. David Miller', 'LOGISTICS_OFFICER', 1, 'd.miller@base-alpha.gov', 'First Lieutenant (O-2)'),
(5, 'officer_bravo', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQvq47a', 'Lt. James Ruiz', 'LOGISTICS_OFFICER', 2, 'j.ruiz@base-bravo.gov', 'Second Lieutenant (O-1)'),
(6, 'officer_charlie', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQvq47a', 'Capt. Elena Rostova', 'LOGISTICS_OFFICER', 3, 'e.rostova@base-charlie.gov', 'Captain (O-3)');

-- 4. Initial Asset Balances
INSERT INTO asset_balances (id, base_id, equipment_type_id, opening_balance, closing_balance, assigned_quantity, expended_quantity) VALUES
(1, 1, 1, 500, 620, 180, 15),
(2, 1, 2, 40, 48, 22, 2),
(3, 1, 3, 150, 185, 60, 5),
(4, 1, 4, 1000, 1450, 200, 350),
(5, 2, 1, 300, 310, 120, 10),
(6, 2, 2, 25, 20, 15, 1),
(7, 2, 4, 800, 950, 150, 200),
(8, 3, 3, 200, 190, 75, 10);

-- 5. Purchases
INSERT INTO purchases (id, purchase_code, base_id, equipment_type_id, quantity, unit_cost, total_cost, supplier, purchase_date, created_by_id) VALUES
(1, 'PUR-2026-001', 1, 1, 150, 1200.00, 180000.00, 'Colt Defense Inc.', '2026-01-15 10:00:00', 4),
(2, 'PUR-2026-002', 1, 2, 10, 140000.00, 1400000.00, 'AM General LLC', '2026-02-01 14:30:00', 4),
(3, 'PUR-2026-003', 1, 4, 800, 350.00, 280000.00, 'Federal Ordnance Co.', '2026-02-10 09:15:00', 4),
(4, 'PUR-2026-004', 2, 1, 50, 1250.00, 62500.00, 'Colt Defense Inc.', '2026-02-18 11:20:00', 5),
(5, 'PUR-2026-005', 2, 4, 400, 350.00, 140000.00, 'Federal Ordnance Co.', '2026-03-01 16:00:00', 5);

-- 6. Asset Transfers
INSERT INTO transfers (id, transfer_code, source_base_id, destination_base_id, equipment_type_id, quantity, status, notes, requested_by_id, approved_by_id, created_at) VALUES
(1, 'TRF-2026-001', 1, 2, 1, 30, 'COMPLETED', 'Reinforcement request for Tactical Patrol Unit', 4, 2, '2026-02-20 08:30:00'),
(2, 'TRF-2026-002', 1, 3, 3, 15, 'COMPLETED', 'Naval tactical communications sync', 4, 2, '2026-02-25 11:00:00'),
(3, 'TRF-2026-003', 2, 1, 2, 5, 'COMPLETED', 'Return heavy vehicles for depot overhaul', 5, 3, '2026-03-05 15:45:00'),
(4, 'TRF-2026-004', 1, 2, 4, 250, 'PENDING', 'Urgent ammunition replenishment for firing range exercises', 4, NULL, '2026-03-28 09:00:00');

-- 7. Assignments & Expenditures
INSERT INTO assignments (id, assignment_code, base_id, equipment_type_id, personnel_name, personnel_rank, quantity, type, status, notes, created_by_id, timestamp) VALUES
(1, 'ASN-2026-001', 1, 1, 'Sgt. John Connor', 'Sergeant (E-5)', 10, 'ASSIGNMENT', 'ACTIVE', 'Issued to Recon Alpha Squad', 4, '2026-01-20 09:00:00'),
(2, 'ASN-2026-002', 1, 2, 'Cpl. Alex Mercer', 'Corporal (E-4)', 2, 'ASSIGNMENT', 'ACTIVE', 'Assigned to Base Perimeter Patrol', 4, '2026-02-05 13:15:00'),
(3, 'EXP-2026-001', 1, 4, 'Range Armory Training', 'Unit Exercise', 350, 'EXPENDITURE', 'EXPENDED', 'Live-fire qualification training rounds consumed', 4, '2026-03-12 16:30:00'),
(4, 'EXP-2026-002', 2, 4, 'Tactical Live Exercise', 'Battalion Operation', 200, 'EXPENDITURE', 'EXPENDED', 'Quarterly combat training ammunition expenditure', 5, '2026-03-15 10:00:00');

-- 8. Audit Logs
INSERT INTO audit_logs (id, timestamp, user_id, username, user_role, action_type, entity_type, entity_id, details, ip_address) VALUES
(1, '2026-01-15 10:00:05', 4, 'officer_alpha', 'LOGISTICS_OFFICER', 'PURCHASE_RECORDED', 'Purchase', 1, 'Recorded purchase of 150 M4A1 Carbine from Colt Defense Inc. Total: $180,000.00', '192.168.1.45'),
(2, '2026-02-20 08:30:12', 4, 'officer_alpha', 'LOGISTICS_OFFICER', 'TRANSFER_INITIATED', 'Transfer', 1, 'Initiated transfer of 30 M4A1 Carbines from Fort Alpha Central Command to Forward Operating Base Bravo', '192.168.1.45'),
(3, '2026-02-20 10:15:40', 2, 'commander_alpha', 'BASE_COMMANDER', 'TRANSFER_APPROVED', 'Transfer', 1, 'Approved transfer TRF-2026-001 of 30 M4A1 Carbines to FOB Bravo', '192.168.1.10'),
(4, '2026-03-12 16:30:22', 4, 'officer_alpha', 'LOGISTICS_OFFICER', 'ASSET_EXPENDED', 'Assignment', 3, 'Recorded expenditure of 350 5.56x45mm NATO Ammo Box (1,000 rds) for Live-fire qualification training', '192.168.1.45'),
(5, '2026-03-28 09:00:15', 4, 'officer_alpha', 'LOGISTICS_OFFICER', 'TRANSFER_INITIATED', 'Transfer', 4, 'Initiated transfer of 250 5.56x45mm NATO Ammo Boxes from Fort Alpha to FOB Bravo', '192.168.1.45');
