# RestoraIntel - Frontend-Backend Contract Compatibility & Stabilization Audit

**Document Reference**: `docs/FRONTEND_BACKEND_CONTRACT_AUDIT.md`  
**Phase**: Task 01 Baseline Stabilization & Task 02 Canonical Contracts, Presentation Models & Mappers  
**Frontend Architecture**: Vue 3 (Composition API `<script setup lang="ts">`) + Vite + Pinia + Vue Router + Tailwind CSS + vue-i18n  
**Authoritative Backend Contract**: Laravel 11+ REST API (Sanctum Token Authentication, Multi-Tenant Restaurant Isolation, RBAC Permission Matrix)  
**Execution Date**: September 2026  
**Audit Status**: Task 01 & Task 02 Complete — Ready for Task 03 Mock API Adapter  

---

## 1. Executive Summary & Mandatory Architectural Decision

### 1.1 Development Paradigm: Mock-Driven Frontend
RestoraIntel remains strictly **mock-driven** during frontend UI/UX development. In accordance with architectural mandates:
- **No live backend required**: The application operates deterministically in the browser without calling live Laravel endpoints or requiring a running PHP/MySQL/PostgreSQL daemon.
- **Contract-first data modeling**: Wire-level DTOs (`src/contracts/backend/`) strictly adhere to the confirmed Laravel REST API.
- **Presentation model separation**: Presentation models (`src/contracts/presentation/`) and pure mappers (`src/contracts/mappers/`) isolate UI concerns, bilingual localization, and badges from wire-level backend structures.
- **Phased Adapter Roadmap**:
  - **Task 01 (Complete)**: Vue baseline stabilized, 8 page/service inconsistencies repaired, `vue-tsc` enabled.
  - **Task 02 (Complete)**: Canonical DTOs, request payloads, response envelopes, presentation models, pure mappers, representative canonical fixtures, and 41 automated contract tests implemented.
  - **Task 03 (Upcoming)**: Implementation of the complete Mock API adapter and operational mock data migration.
  - **Future Integration Phase**: Swapping the Mock API adapter for the live HTTP API adapter (Axios + Sanctum).

```
Vue Components / Views
         │
         ▼
Pinia Stores (Consuming Presentation Models)
         │
         ▼
Typed Application Services
         │
         ▼
Data Provider Interface
    ┌────┴────────────────────────┐
    ▼                             ▼
Mock API Adapter             HTTP API Adapter (Axios)
[TASK 03 DELIVERABLE]        [FUTURE INTEGRATION PHASE]
(Canonical DTOs + Mappers)   (Sanctum Bearer Token + Wire DTOs)
```

---

## 2. Active Application Architecture & Legacy React Quarantine

### 2.1 Active Vue 3 Production Entry Point
The active production build targets Vue 3 exclusively:
- **Entry HTML**: `/index.html` loads `<script type="module" src="/src/main.ts"></script>`.
- **Application Bootstrapper**: `/src/main.ts` initializes Vue 3 (`createApp(App)`), mounts Pinia (`createPinia()`), attaches Vue Router (`router`), and injects bilingual i18n (`vue-i18n`).
- **Layout Shell**: `/src/layouts/AppLayout.vue` provides the executive restaurant management shell with responsive RTL sidebar (`w-72`), navigation header with branch switcher, and content viewport.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) via `@import "tailwindcss"` in `/src/index.css`.

### 2.2 Legacy React Quarantine Status
The repository contains legacy React source files from an earlier prototyping phase. Per Task 01 directives, these files are quarantined and must **not** be deleted:
- Legacy root files: `/src/App.tsx`, `/src/main.tsx`
- Legacy context: `/src/context/AppContext.tsx`
- Legacy React pages: `/src/pages/*.tsx` (`AIIntelligencePage.tsx`, `AttendancePage.tsx`, `DashboardPage.tsx`, `EmployeesPage.tsx`, `InventoryPage.tsx`, `LoginPage.tsx`, `MenuPage.tsx`, `OrdersPage.tsx`, `ReportsPage.tsx`, `SchedulingPage.tsx`, `AlertsPage.tsx`, `BrandingPreviewPage.tsx`, `LeaveRequestsPage.tsx`)
- Legacy React components: `/src/components/**/*.tsx`

**Quarantine Verification**: The active build pipeline (`npm run build`) bundles only Vue modules (`✓ 1897 modules transformed`, 0 React runtime imports). TypeScript compilation (`tsc --noEmit`) passes with zero errors across all active `.ts` and `.vue` files.

---

## 3. Authoritative Backend Contract Compatibility Matrix

### 3.1 Standard API Envelope & Error Protocol
Laravel endpoints return uniform JSON envelopes. Future HTTP client adapters must adhere to this contract:

#### Success Envelope (HTTP 200, 201)
```json
{
  "status": "success",
  "message": "Operation completed.",
  "data": {},
  "meta": []
}
```

#### Error Envelope (HTTP 400, 401, 403, 404, 422, 500)
```json
{
  "status": "error",
  "message": "Operation failed.",
  "errors": null,
  "meta": []
}
```

| HTTP Status | Backend Meaning | Frontend Handling Requirement |
| :--- | :--- | :--- |
| **401 Unauthorized** | Missing/invalid Sanctum token or session expired | Clear auth store, wipe token from storage, redirect to `/login`. |
| **403 Forbidden** | User lacks required permission code or is outside tenant boundary | Display localized access denial toast or permission banner without crashing view. |
| **404 Not Found** | Restaurant, employee, or resource ID does not exist | Display dedicated `EmptyState.vue` with back-navigation. |
| **422 Unprocessable** | Laravel validation failed (`errors: { field: string[] }`) | Bind field-level error messages to form inputs. |

### 3.2 Authentication & User Identity Contract

**Confirmed Endpoints**:
- `POST /api/auth/login` (Body: `{ email, password }` -> Returns `{ token, user, restaurant? }`)
- `POST /api/auth/logout` (Header: `Authorization: Bearer {token}`)
- `GET /api/auth/me` (Returns authenticated user profile)

#### Authoritative Contract Clarifications & Uncertainties:
1. **Memberships & Permissions Payload**: The exact wire format for embedded permissions and tenant memberships on `POST /api/auth/login` vs `GET /api/auth/me` is not universally guaranteed across Laravel Sanctum setups. In standard Laravel Spatie / custom policy setups, permissions may be embedded as a flat list of strings (`permissions: string[]`) or queried via a secondary endpoint. Therefore, `UserDto` models `memberships`, `roles`, and `permissions` as optional loaded relations to prevent runtime breakage if the backend emits a lean user resource.
2. **User Identity vs Tenant Membership**: In Laravel, `User` represents authentication account identity. Direct `restaurant_id` on the `User` model is an anti-pattern for multi-brand/multi-tenant platforms; multi-restaurant access is properly resolved via pivot `RestaurantMembership` records.

#### Canonical User Entity vs Frontend Model
| Field | Laravel Contract Type | Frontend Mock Type (`domain.ts`) | Compatibility Analysis & Adapter Mapping |
| :--- | :--- | :--- | :--- |
| `id` | `string` (UUID/ULID) | `string` | **Compatible**. Direct match. |
| `email` | `string` | `string` | **Compatible**. Direct match. |
| `name_first` | `string` | *Missing* (Uses `name: { ar, en }`) | **Inconsistent**. Adapter must map `user.name_first = user.name.en` / `user.name.ar` on serialization/deserialization. |
| `name_last` | `string` | *Missing* (Combined in `name`) | **Inconsistent**. Adapter must split/join first and last names. |
| `status` | `string` (`active`, `suspended`, `pending`) | *Missing* (Inferred from session) | **Inconsistent**. Need canonical `status` field in user DTO. |
| `email_verified_at` | `string` (ISO 8601 / null) | *Missing* | **Contract addition**. Required in future auth DTO. |
| `last_login_at` | `string` (ISO 8601 / null) | *Missing* | **Contract addition**. Optional in presentation. |
| `created_at` | `string` (ISO 8601) | `string` (optional) | **Compatible**. |
| `updated_at` | `string` (ISO 8601) | `string` (optional) | **Compatible**. |
| `deleted_at` | `string` (ISO 8601 / null) | *Missing* (Soft-delete) | **Contract addition**. Required for soft-delete filtering. |

### 3.3 Restaurant Entity Contract

**Endpoints**:
- `GET /api/restaurants`
- `POST /api/restaurants`
- `GET /api/restaurants/{restaurant}`
- `PUT /api/restaurants/{restaurant}`

| Field | Laravel Contract Type | Frontend Mock Type (`domain.ts`) | Compatibility Analysis & Adapter Mapping |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `string` | **Compatible**. |
| `name` | `string` | `{ ar: string; en: string }` | **Inconsistent**. Backend stores a single string (or JSON column); frontend uses localized dictionary. Adapter must extract current locale `name[locale]` when sending to backend. |
| `slug` | `string` | *Missing* (Uses `code: string`) | **Inconsistent**. Backend uses `slug` for URLs; frontend uses uppercase 3-letter `code`. Adapter must map `slug <-> code`. |
| `status` | `'active' \| 'inactive' \| 'suspended' \| 'archived'` | `'active' \| 'maintenance' \| 'coming_soon'` | **Inconsistent**. Frontend enum includes UI-specific states. Adapter must map `maintenance` -> `inactive`, `coming_soon` -> `inactive`. |
| `timezone` | `string` (e.g. `'Asia/Riyadh'`) | *Missing* (Hardcoded) | **Contract addition**. Must be added to restaurant model for date/time formatting. |
| `currency_code` | `string` (e.g. `'SAR'`) | `currency: string` | **Inconsistent naming**. Adapter maps `currency_code <-> currency`. |
| `created_at` | `string` | `string` | **Compatible**. |
| `updated_at` | `string` | `string` | **Compatible**. |
| `deleted_at` | `string \| null` | *Missing* | **Contract addition**. Soft deletes. |

### 3.4 Employee Entity Contract

**Endpoints**:
- `GET /api/restaurants/{restaurant}/employees`
- `GET /api/restaurants/{restaurant}/employees/{employee}`
- `POST /api/restaurants/{restaurant}/employees`
- `PUT /api/restaurants/{restaurant}/employees/{employee}`

| Field | Laravel Contract Type | Frontend Mock Type (`domain.ts`) | Compatibility Analysis & Adapter Mapping |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `string` | **Compatible**. |
| `restaurant_id` | `string` | `restaurant_id: string` | **Compatible**. Scoped to restaurant tenant. |
| `user_id` | `string \| null` | *Missing* | **Contract addition**. User identity link for staff with system logins. |
| `position_id` | `string \| null` | `position_id: string` | **Compatible**. Nullable in backend contract. |
| `employee_number` | `string` | `employee_code: string` | **Inconsistent naming**. Canonical backend field is `employee_number`. Adapter maps `employee_number <-> employee_code`. |
| `first_name` | `string` | `{ ar: string; en: string }` | **Inconsistent**. Backend uses string; frontend uses bilingual object. Adapter handles serialization. |
| `last_name` | `string` | `{ ar: string; en: string }` | **Inconsistent**. Backend uses string; frontend uses bilingual object. Adapter handles serialization. |
| `email` | `string` | `string` | **Compatible**. |
| `phone` | `string` | `string` | **Compatible**. |
| `hire_date` | `string` (YYYY-MM-DD) | `string` | **Compatible**. |
| `termination_date`| `string \| null` | *Missing* | **Contract addition**. Null for active employees. |
| `status` | `'active' \| 'inactive' \| 'on_leave' \| 'terminated' \| 'suspended'` | `'active' \| 'on_shift' \| 'on_break' \| 'off_duty' \| 'on_leave'` | **Critical Inconsistency**. Backend `status` is employment contract lifecycle (`active`, `terminated`, `on_leave`). Frontend blended operational shift presence (`on_shift`, `on_break`). Real solution: backend handles shift presence via attendance records (`Attendance.status`), while employee record maintains employment contract status. |
| `created_at` | `string` | `string` | **Compatible**. |
| `updated_at` | `string` | `string` | **Compatible**. |
| `deleted_at` | `string \| null` | *Missing* | **Contract addition**. Soft deletes. |

---

## 4. RBAC & Multi-Tenant Authorization Audit

### 4.1 Backend Authorization Principles
1. **Tenant Isolation**: Restaurant read/write operations require valid restaurant membership. An authenticated user belonging to Restaurant A cannot query or mutate Restaurant B's resources.
2. **Permission Codes Over Roles**:
   - `system.restaurants.manage` — Super administrator platform override.
   - `restaurant.profile.manage_self` — Ability to edit restaurant branch metadata, hours, and par configurations.
   - `restaurant.employees.manage` — Required to create, update, terminate, or assign shifts to employees.
3. **Membership != Mutation**: Merely being an active employee/member of a restaurant does **not** grant `restaurant.employees.manage`.
4. **Final Authority**: Laravel policies/gates are the authoritative boundary; frontend checks provide UI guidance and button states.

### 4.2 Current Frontend RBAC Deviations
- **Role string matching**: Current frontend checks `authStore.currentUser?.role === 'super_admin'` or `'operations_director'` rather than evaluating granular permissions.
- **Remediation Plan for Task 02**: Introduce a reactive `can(permissionCode: string): boolean` helper in `useAuthStore` that checks user permissions array provided by `GET /api/auth/me`.

---

## 5. Verified Page & Service Discrepancy Repairs (Task 01 Implementation)

During Task 01, every verified inconsistency listed in the brief was investigated and repaired:

### 5.1 Attendance Module (`AttendancePage.vue`)
- **Defect**: Called non-existent `attendanceService.getAttendanceRecords()`.
- **Repair**:
  - Replaced call with `attendanceService.getAttendances(restaurantId)`.
  - Scoped to `authStore.currentRestaurant?.id`.
  - Added reactive `watch` on restaurant ID so switching branches immediately reloads attendance records.
  - Added loading indicator and empty state for branches without records.
  - Enriched `attendanceService.getAttendances` to associate employee objects (`rec.employee`), ensuring safe rendering of names and codes.

### 5.2 Live Kitchen & Orders Module (`OrdersPage.vue`)
- **Defect**:
  - Called non-existent `orderService.getLiveOrders()`.
  - Referenced `order.total_amount` (domain type defines `order.total`).
  - Referenced `item.station` (not present in `OrderItem` domain type).
- **Repair**:
  - Corrected call to `orderService.getOrders(restaurantId)`.
  - Scoped to active restaurant context with change-detection `watch`.
  - Updated presentation to use canonical `order.total` with currency label.
  - Replaced `item.station` with formatted line item pricing (`unit_price * quantity SAR`).
  - Added loading and empty states.

### 5.3 Shift Scheduling Module (`SchedulingPage.vue`)
- **Defect**: Called `schedulingService.getShifts()` without the required restaurant ID parameter.
- **Repair**:
  - Injected `useAuthStore()`.
  - Passed `restaurantId` to `schedulingService.getShifts(restaurantId)`.
  - Added reactive `watch` and graceful empty/loading states.

### 5.4 Inventory & Par Levels Module (`InventoryPage.vue`)
- **Defect**: Called `inventoryService.getInventoryItems()` without the required restaurant ID parameter.
- **Repair**:
  - Scoped call to `inventoryService.getInventoryItems(restaurantId)`.
  - Added reactive `watch` and graceful empty/loading states.

### 5.5 Menu Engineering Module (`MenuPage.vue`)
- **Defect**:
  - Called `menuService.getMenuItems()` without restaurant ID.
  - Referenced `item.is_active` (domain type defines `item.is_available`).
- **Repair**:
  - Scoped call to `menuService.getMenuItems(restaurantId)`.
  - Replaced `item.is_active` with `item.is_available` and localized status badges.
  - Added reactive `watch` and graceful empty/loading states.

### 5.6 Staff Directory Module (`EmployeesPage.vue`)
- **Defect**: Fetched all employees across all branches via `employeeStore.fetchEmployees()` without passing the active restaurant ID.
- **Repair**:
  - Updated to pass `authStore.currentRestaurant?.id`.
  - Added reactive `watch` so switching branches re-filters staff.
  - Added loading indicator and empty state when a branch has no staff members.

### 5.7 Financial & Operational Reports (`ReportsPage.vue`)
- **Defect**: Hardcoded `'rest-1'` in `reportService.getReportMetrics('rest-1')`.
- **Repair**:
  - Removed `'rest-1'` dependency; now passes `authStore.currentRestaurant?.id`.
  - Removed unsafe `'rest-1'` fallback in `src/services/reportService.ts` (`mockReportMetrics[restaurantId] || []`).
  - Added reactive `watch` and empty/loading states.

### 5.8 AI Predictive Intelligence (`AIIntelligencePage.vue`)
- **Defect**:
  - Used fallback `restId = authStore.currentRestaurant?.id || 'rest-1'`.
  - Evaluated `insight.impact === 'high'` (where `impact` is `{ ar, en }` and `urgency` is `'high' | 'medium' | 'low'`).
  - Rendered `{{ insight.impact }}` directly (produced `[object Object]`).
- **Repair**:
  - Removed `'rest-1'` fallback; safe restaurant ID checking.
  - Evaluated `insight.urgency === 'high'` for priority badge styling.
  - Displayed localized `insight.impact[uiStore.language]` as a formatted impact statement.
  - Added loading and empty states.

### 5.9 Operational Alerts (`AlertsPage.vue`)
- **Defect**:
  - Imported `mockAlerts` directly from `@/mocks/aiInsights`, bypassing the service layer.
  - Fallback to `'rest-1'`.
- **Repair**:
  - Refactored to consume `aiInsightService.getAlerts(restaurantId)` and `aiInsightService.markAlertRead(id)`.
  - Removed `'rest-1'` fallback.
  - Added loading and empty states.

### 5.10 Executive Dashboard (`DashboardPage.vue` & `dashboard.store.ts`)
- **Defect**: Defaulted to `restaurantId: string = 'rest-1'` and used `authStore.currentRestaurant?.id || 'rest-1'`.
- **Repair**:
  - Removed default parameter; require explicit `restaurantId`.
  - Added safety guard: if `!restaurantId`, reset state without executing mock calls.
  - Removed `'rest-1'` fallback in `DashboardPage.vue`.

---

## 6. Restaurant Context Architecture & Store Consolidation Strategy

### 6.1 Current Duplication Analysis
The repository currently contains restaurant state across two distinct stores:

| Capability | `src/stores/auth.store.ts` | `src/stores/restaurant.store.ts` |
| :--- | :--- | :--- |
| **`currentRestaurant` ref** | Yes (Primary driver for UI Header/Switcher) | Yes (Secondary, decoupled) |
| **`switchRestaurant()`** | Updates user active tenant & toast notifications | Sets local restaurant ref only |
| **Active fallback** | Previously used `'rest-1'` | Previously used `'rest-1'` in computed ID |

### 6.2 Consolidation Recommendation for Future Auth & Tenant Task
In the upcoming authentication/tenant task, merge tenant context following clean separation of concerns:
1. **Single Source of Truth (`authStore` or dedicated `tenantStore`)**:
   - `authStore` retains `currentUser` and `tenantMemberships: RestaurantMembership[]`.
   - Dedicated `useTenantStore` (or consolidated `useRestaurantStore`) maintains `activeRestaurantId: computed(() => ...)`, available branches, and tenant switching logic.
2. **Elimination of Fallbacks**:
   - If no restaurant is active (e.g., brand-new user or multi-brand executive before selection), state is `null`. Pages display a standardized `SelectBranchPrompt.vue` instead of defaulting to demo IDs.

---

## 7. Quality Baseline & Verification Results

### 7.1 Executed Checks & Results

| Check / Tool | Execution Command | Result | Findings |
| :--- | :--- | :--- | :--- |
| **Contract & Mapper Unit Tests** | `npm test` (`bun test`) | **PASSED** (41/41 tests pass, Exit 0) | Comprehensive automated test coverage across DTOs, response envelopes, validation errors, request restrictions, mappers, localization catalog, and referential integrity. |
| **Vue Template Typecheck** | `npm run typecheck` (`vue-tsc --noEmit`) | **PASSED** (Exit 0) | Full Vue SFC template and script typechecking verified across all active pages and components. |
| **TypeScript Typecheck / Lint** | `npm run lint` (`tsc --noEmit`) | **PASSED** (Exit 0) | All TypeScript modules, domain types, stores, contracts, and services compile with zero errors. |
| **Vite Production Build** | `npm run build` | **PASSED** (Exit 0) | Clean production bundle generated in `/dist` with zero bundling or asset errors. |
| **AI Studio Build System** | `compile_applet` tool | **PASSED** (Exit 0) | AI Studio dev runner compiles successfully. |

### 7.2 Resolution of `vue-tsc` & TypeScript Incompatibility
- **Initial Finding**: `typescript@7.0.2` restructured its package exports to omit `./lib/tsc`, causing `vue-tsc@3.3.11` to fail resolution with `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- **Resolution Applied**: Updated dev dependency to `typescript@6.0.2` via `bun add -d typescript@6.0.2`.
- **Lockfile & Scope Integrity**:
  - `bun.lock` consistently updated.
  - `tsconfig.json` updated with `"include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"]` and `"exclude": ["node_modules", "dist", "src/**/*.tsx"]`, isolating legacy React files while guaranteeing 100% Vue SFC participation.
  - Template-level typechecking actively tested and verified to catch template property errors.

---

## 8. Summary of Completed Deliverables Across Tasks

### 8.1 Task 01 Baseline Stabilization (Completed)
1. **Architecture Preserved**: RestoraIntel remains 100% mock-driven, preparing for contract-first adapter replacement.
2. **Quality Baseline Established**: Full Vue-aware typechecking (`vue-tsc --noEmit`), TypeScript lint (`tsc --noEmit`), and Vite production build (`vite build`) all pass with **0 errors**.
3. **8 Page/Service Inconsistencies Repaired**: Attendance, Orders, Scheduling, Inventory, Menu, Employees, Reports, and AI Intelligence all corrected to use exact method signatures, canonical fields, and active restaurant context.
4. **Restaurant Context Safety Enforced**: Removed all silent `'rest-1'` fallbacks; implemented loading, empty, and branch-reactive states.

### 8.2 Task 02 Canonical Contracts & Presentation Mapping (Completed)
1. **Canonical Backend DTOs (`src/contracts/backend/`)**:
   - `UserDto`, `RestaurantMembershipDto`, `RoleDto`, `PermissionDto`: Decoupled user account identity from restaurant membership; plain string names.
   - `RestaurantDto`: Plain string `name`, canonical `currency_code: 'SAR'`, backend `status` enum (`active`, `inactive`, `suspended`, `archived`), and request payloads enforcing prohibited fields.
   - `EmployeeDto`: Plain string `first_name`/`last_name`, canonical `employee_number`, tenant ownership via `restaurant_id`, nullable `user_id` and `position_id`, and separation of employment lifecycle status from operational shift attendance.
   - `PositionDto`: Minimal confirmed schema for workforce job roles.
   - `ApiSuccessResponse`, `ApiErrorResponse`, `ApiValidationErrorResponse`: Reusable, type-safe response envelopes faithful to Laravel standard output.
2. **Presentation Models (`src/contracts/presentation/`)**:
   - `RestaurantPresentationModel`, `EmployeePresentationModel`, `UserPresentationModel`: Localized strings (`{ ar, en }`), UI status badges with variants, and backward-compatible aliases.
3. **Pure Mappers & Localization Catalog (`src/contracts/mappers/`)**:
   - `mapRestaurantToPresentation`, `mapEmployeeToPresentation`, `mapUserToPresentation`: Deterministic pure functions.
   - `MOCK_LOCALIZATION_CATALOG`: Keyed by stable entity IDs for mock mode; strictly falls back to canonical backend string when unlisted without fabricating artificial translations.
4. **Representative Mock Fixtures (`src/contracts/fixtures/`)**:
   - Multi-restaurant fixtures with valid memberships, tenant isolation, nullable relationships, and valid lifecycle statuses.
5. **Contract Test Suite (`src/contracts/__tests__/`)**:
   - 41 automated tests running via `npm test` (`bun test`) validating DTOs, response envelopes, validation errors, request restrictions, mappers, localization, and referential integrity.

### 8.3 Task 03 Deliverables (Planned Scope)
- Complete Mock API Adapter implementation exposing the unified Data Provider interface.
- Migration of operational mock datasets (attendance, shifts, orders, menu, inventory) to adapter-backed mock providers.
- Transitioning Pinia stores to consume presentation models through the Data Provider interface.
