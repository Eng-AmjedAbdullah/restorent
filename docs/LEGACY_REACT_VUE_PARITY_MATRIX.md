# React-to-Vue migration and source removal inventory

The prior repaired source archive retained 33 old React `.tsx` files for migration reference. At the user's explicit request, the Vue-only delivery **removes them**. They remain recoverable from the user's original and previously repaired ZIP files outside this clean project. Vue is the only active frontend entry.

This is a source-level feature comparison. Browser-level visual equivalence has NOT been certified in this environment.

| Module | Working Vue functionality in this release | Limitations / future integration |
| --- | --- | --- |
| Auth | Mock persona selection, credential validation, logout, mock route guards | Demo-only, no live Sanctum server |
| Restaurants | Header desktop and mobile restaurant switchers, tenant-scoped services and permissions | Real server tenancy still to be integrated |
| Employees | Search/filter, employee creation form, detailed drawer with profile/skills/attendance/schedule/leave | Contract/payroll fields intentionally separated from unverified Laravel DTOs |
| Attendance | Sample counts/filters, simulated clock-in and excuse forms | No biometric hardware or geofence verification |
| Leave | Status filters, pending/approved/rejected counters, mock approval and required rejection reason | No actual employee notifications or automated shift replanning |
| Orders/KDS | Status columns, guarded demo state transitions and item preparation | No live kitchen system or POS hardware |
| Inventory | Search/filter, low-stock indicators, validated local stock update | No actual purchase order is placed |
| Menu | Search/category, mocked availability and new item form | Operational endpoints remain mock-only |
| Scheduling | Historical date navigation, station coverage and uncovered positions, demo shift creation with overlap, active-staff and approved-leave validation | No automatic staffing optimizer; overnight demo shifts unsupported |
| Reports | Date-range filters, sample visualization, genuine browser CSV export and print/save-PDF | No dedicated PDF engine or real financial ledger |
| Alerts | Type/unread filters, mark one/all read, provider-owned data | Read status is not operational incident resolution |
| Simulated AI | Historical recommendations and accept/reject transitions | No real model inference, training or execution |
| Dashboard | Preserved detailed Vue page; latest sample-date sales from historical report rows, provider-derived operational counts | Satisfaction and peak-hour figures remain historical demo snapshot fields |
| Branding preview | Used-asset gallery/downloads, background transparency controls, light/dark/collapsed sidebar and responsive header simulation | Simulations are previews, not duplicated real shell components |
| Shared UI | Vue versions of header, sidebar, dialogs, drawers, tables, inputs and mobile navigation | Accessibility and pixel parity require browser testing |

## Cleanup gate and recovery

All React/TSX source is absent from the clean release. The old application's feature behavior remains recoverable from the separately supplied original and previously repaired archives. Historical audit documents were retained under `docs/archive/` and are NOT authoritative for this release. No image or script from the deleted React application is used by the active Vue entrypoint.
