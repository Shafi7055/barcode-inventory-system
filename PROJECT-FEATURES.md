# Inventory Management System - Feature Specification

Source: `Inventory Management System doc.pdf` (assignment brief, Nov 3, 2026).

## Project goal

Build a barcode-based inventory system that tracks products from component tracking through receiving and delivery, with role-based access and reports.

## Roles and permissions

| Role | Allowed | Not allowed |
| --- | --- | --- |
| Admin | All master data and user/role management, all inventory operations, reversals, corrections, and reports | Nothing |
| Component Tracker | Scan a product and attach component barcodes | Receive, deliver, or manage master data |
| Receive User | Receive a scanned product at a receive point | Issue stock or edit master data |
| Delivery User | Deliver an in-stock scanned product at a delivery point | Receive stock or edit master data |
| Report Viewer | Open and filter reports; read-only | Create, edit, or delete |

Every screen and action must be authorized on the server. A user has exactly one role; hiding a menu item is not sufficient access control.

## Core functionality

1. **Authentication:** registration, login, logout, password hashing, and one role per user.
2. **Admin panel:** create, edit, and delete product names, component names, receive points, and delivery points; create users and change their roles.
3. **Receive:** scan a product barcode, select a receive point, and save. The unit enters stock at that point, which becomes its current stock location.
4. **Component tracking:** scan a product barcode and attach one or more component barcodes. A component barcode may belong to only one product.
5. **Delivery:** scan a product barcode and select a delivery point. Only in-stock units can be delivered; delivered units leave the stock count.
6. **Inventory history:** append a history row for every component-tracked, received, delivered, or reversed event. Record barcode, event type, point, user, timestamp, and a reason when required. Never edit or delete history rows. Derive current stock status from history, not an independently editable value.
7. **Reversal and correction:** only Admin can reverse an incorrect entry; a reason is required and a new history row is added. A receipt can be reversed only before delivery. Reversing a delivery returns the unit to its original receive point. Reversing component tracking detaches the component so it can be tracked again.
8. **Reports built from history:**
   - Stock details for each unit, including its current receive point.
   - A date-range summary with a graph.
   - Barcode history showing the complete path from component tracking through delivery, including reversals.

## Additional functionality

- Search, filtering, and pagination on every list and report.
- Export reports to CSV or Excel.
- Separate audit log for master-data and user changes and logins, including user, timestamp, old values, and new values.
- Deactivate users rather than deleting them. Soft-delete master data that is already in use.
- Client- and server-side validation, clear errors, and duplicate-scan warnings.
- Dashboard with current stock, today's receipts and deliveries, and the units that have been in stock the longest.
- Password changes and forced logout for deactivated users.

## End-to-end sample

Process these events in order. The unit should finish as delivered, and barcode history should show all three rows.

| Date and time | Event | Product barcode | Product/component | Point | User |
| --- | --- | --- | --- | --- | --- |
| 2026-03-27 10:00 | Component tracked | `2440701AK2057` | Refrigerator; component Compressor, barcode `94A600321852` | Refrigerator Component Track Point 1 | `66798` |
| 2026-03-28 10:15 | Received | `2440701AK2057` | Refrigerator | Refrigerator Receive Point 1 | `58877` |
| 2026-03-30 11:30 | Delivered | `2440701AK2057` | Refrigerator | Refrigerator Delivery Point 1 | `54671` |

## Project phases

The brief plans 18 working days across seven phases:

| Phase | Days | Expected output |
| --- | ---: | --- |
| Requirement analysis | 1 | Requirements, roles, screens, rules, and open questions |
| Process-flow diagram | 2 | Flow from component tracking to receiving to delivery, with roles |
| Database design | 2 | ER diagram and SQL script, including append-only history |
| Development | 10 | Working application: authentication, admin, operations, then reports |
| Testing | 1 | Role and business-rule test cases with results |
| Documentation | 1 | User guide and setup guide |
| Presentation | 1 | Live demo and slides |

## Submission deliverables

- Process-flow diagram (image or PDF).
- ER diagram, database script, and loaded sample data.
- Source code in a Git repository with commit history.
- README with setup steps, default admin login, and one login per role.
- Test sheet with each case's expected result, actual result, and pass/fail.
- User guide with screenshots of every module.
- Ten-minute demo video or live demo.
- Repository link and documents submitted by the final working day.
- State the chosen stack and why in the README.

## Current implementation status

The frontend is Next.js/React and the backend is Node.js/Express with PostgreSQL. Authentication and role checks are now implemented; remaining gaps below concern other requirements in the assignment brief.

| Area | Current status |
| --- | --- |
| Dashboard | Partial: stock count, today's receives/deliveries, and recent movements; no longest-in-stock list. |
| Component tracking | Partial: product/component barcode attachment works; no server-enforced one-product-per-component rule or component reversal. |
| Receiving and delivery | Implemented: receive/delivery points, stock-state checks, and idempotent writes are available. |
| Master data | Partial: products, components, and stock points can be created and listed; edit, deactivate, and delete workflows are absent. |
| Reversals | Partial: receipt/delivery reversals require a reason and add history; role restriction is absent and component reversal is unsupported. |
| Reports | Partial: stock details, date summary, barcode history, and audit-log endpoints exist; the summary graph and CSV/Excel export are absent. |
| Authentication and roles | Implemented: login/logout, hashed passwords, Report Viewer-only public registration, Admin account creation and role assignment, password changes, and API-enforced role authorization. |
| Audit log | Partial: login/logout, registration, password changes, master-data creation, and user updates are recorded; authentication failures and comprehensive old/new values are not currently recorded. |
| Search, filters, pagination | Partial: API pagination exists for some lists/reports; UI does not provide complete search/filter/pagination across every list and report. |
| User lifecycle | Implemented: Admins can deactivate users; role changes, deactivation, and password changes revoke active sessions. |
| Validation | Partial: server validation and API error details exist; duplicate-scan warnings and full client validation need work. |
