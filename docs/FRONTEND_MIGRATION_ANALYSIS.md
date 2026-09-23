# RestoraIntel - Frontend Migration Analysis Report

**Document**: `docs/FRONTEND_MIGRATION_ANALYSIS.md`  
**Phase**: Phase 01 - Architecture Migration Foundation  
**Target Architecture**: Vue 3 + Vite + TypeScript + Pinia + Vue Router + Composition API + Tailwind CSS  
**Target Backend Integration**: Laravel REST API / Sanctum  

---

## 1. Executive Summary

RestoraIntel was initially scaffolded as a high-fidelity React Single Page Application (SPA). To prepare for enterprise scalability and seamless integration with the upcoming Laravel backend, the frontend foundation is transitioning to a modern **Vue 3 (Composition API `<script setup lang="ts">`)** architecture powered by **Vite**, **Pinia**, and **Vue Router**.

This document represents the Phase 01 repository audit and architectural blueprint.

---

## 2. Current Architecture Audit

### 2.1 Package Dependencies & Build Pipeline
- **Runtime**: Node.js 22 with Vite 8.3 build system.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` and `@import "tailwindcss"` in `src/index.css`). Custom theme colors (`--color-brand-cyan: #4edee3`, `--color-brand-teal: #34abb1`, `--color-brand-dark: #2c777c`) and bilingual RTL typography (IBM Plex Sans Arabic & Inter).
- **Current Entry Points**:
  - `index.html`: Points to `/src/main.tsx`.
  - `src/main.tsx`: Mounts React 19 root (`createRoot`) with `App.tsx`.
  - `vite.config.ts`: Configured with both `@vitejs/plugin-react` and `@vitejs/plugin-vue`.

### 2.2 Detected React Dependencies
The following React-specific libraries were identified in `package.json` and active code:
- `react` (^19.0.1) & `react-dom` (^19.0.1)
- `@types/react` (^19.3.0) & `@types/react-dom` (^19.3.0)
- `@vitejs/plugin-react` (^6.1.1)
- `lucide-react` (^0.546.0) — *to be replaced with `lucide-vue-next`*

### 2.3 Current Routing System
- **Current Mechanism**: No actual URL-based router is utilized. The React app relies on in-memory state (`currentPage` in `src/context/AppContext.tsx`) with a switch-case inside `src/App.tsx`.
- **Limitation**:
  - Browser history (back/forward navigation), deep linking, bookmarks, and route guards (authentication/role checks) are absent.
  - Page state is lost upon manual browser refresh.

### 2.4 Current State Management & Context
- Monolithic React Context (`src/context/AppContext.tsx`, 400+ lines):
  - Couples UI state (language, direction, sidebar status, active drawer, toasts) with domain state (restaurants, employees, shifts, attendance, inventory, menu items, orders, alerts, recommendations).
  - Triggers unnecessary re-renders across all active components whenever any slice of state changes.

### 2.5 Current Mock Data & Data Flow Problems
- Monolithic mock data file: `src/data/mockData.ts` (1,067 lines, ~41 KB).
- **Problems**:
  1. Direct tight-coupling between UI views and `mockData.ts`.
  2. Data mutations occur directly in in-memory arrays without a standardized DTO or HTTP response schema.
  3. Disconnect between initial mock types and future Laravel API resource responses.
  4. Services in `src/services/` were partially created but not yet uniformly consumed by reactive stores.

---

## 3. Component & Page Inventory Requiring Conversion

### 3.1 UI Components (Atom & Molecule Level)
| Component Name | Current React File | Current Vue Status | Next Step |
| :--- | :--- | :--- | :--- |
| **Badge** | `src/components/ui/Badge.tsx` | `Badge.vue` exists | Enhance & verify API parity |
| **Button** | `src/components/ui/Button.tsx` | `Button.vue` exists | Enhance & verify API parity |
| **Card** | `src/components/ui/Card.tsx` | `Card.vue` exists | Enhance & verify API parity |
| **Input** | `src/components/ui/Input.tsx` | `Input.vue` exists | Enhance & verify API parity |
| **Select** | `src/components/ui/Select.tsx` | `Select.vue` exists | Enhance & verify API parity |
| **ToastNotification** | `src/components/ui/ToastNotification.tsx`| `ToastNotification.vue` exists | Connect to Pinia UI store |
| **RestaurantSwitcher**| *Embedded in React Header* | `RestaurantSwitcher.vue` exists | Connect to Pinia Restaurant store |
| **StatCard** | *Inline in React pages* | `StatCard.vue` exists | Standardize for KPIs |
| **Avatar** | `src/components/ui/Avatar.tsx` | Missing in Vue | Create `Avatar.vue` |
| **Dialog / Modal** | `src/components/ui/Dialog.tsx` | Missing in Vue | Create `Dialog.vue` |
| **Drawer** | `src/components/ui/Drawer.tsx` | Missing in Vue | Create `Drawer.vue` |
| **EmptyState** | `src/components/ui/EmptyState.tsx` | Missing in Vue | Create `EmptyState.vue` |
| **LoadingState** | `src/components/ui/LoadingState.tsx` | Missing in Vue | Create `LoadingState.vue` |
| **Table** | `src/components/ui/Table.tsx` | Missing in Vue | Create `Table.vue` |
| **Tabs** | `src/components/ui/Tabs.tsx` | Missing in Vue | Create `Tabs.vue` |

### 3.2 Layout Shell Components
| Component Name | Current React File | Current Vue Status | Next Step |
| :--- | :--- | :--- | :--- |
| **AppLayout** | `src/App.tsx` | `src/layouts/AppLayout.vue` | Finalize as router shell |
| **Sidebar** | `src/components/layout/Sidebar.tsx` | `Sidebar.vue` exists | Connect to Vue Router links |
| **Header** | `src/components/layout/Header.tsx` | `Header.vue` exists | Connect to Pinia stores |
| **MobileNavigation**| `src/components/layout/MobileNavigation.tsx`| `MobileNavigation.vue` exists| Connect to Vue Router links |

### 3.3 Pages Requiring Conversion
| Route Path | Module | Current File | Target Vue View (Phase 01 Route Placeholder) |
| :--- | :--- | :--- | :--- |
| `/login` | Authentication | `src/pages/LoginPage.tsx` | `src/pages/LoginPage.vue` |
| `/dashboard` | Executive Dashboard | `src/pages/DashboardPage.tsx` | `src/pages/DashboardPage.vue` |
| `/employees` | HR & Staff Management | `src/pages/EmployeesPage.tsx` | `src/pages/EmployeesPage.vue` |
| `/attendance` | Biometric Attendance | `src/pages/AttendancePage.tsx` | `src/pages/AttendancePage.vue` |
| `/scheduling` | Shift Scheduling | `src/pages/SchedulingPage.tsx` | `src/pages/SchedulingPage.vue` |
| `/inventory` | Inventory & Par Levels | `src/pages/InventoryPage.tsx` | `src/pages/InventoryPage.vue` |
| `/menu` | Menu Engineering | `src/pages/MenuPage.tsx` | `src/pages/MenuPage.vue` |
| `/orders` | Live Kitchen POS Orders| `src/pages/OrdersPage.tsx` | `src/pages/OrdersPage.vue` |
| `/reports` | Financial & Operational Reports | `src/pages/ReportsPage.tsx` | `src/pages/ReportsPage.vue` |
| `/ai-intelligence`| Predictive AI Insights | `src/pages/AIIntelligencePage.tsx` | `src/pages/AIIntelligencePage.vue` |
| `/leave-requests`| Leave Management | `src/pages/LeaveRequestsPage.tsx` | `src/pages/LeaveRequestsPage.vue` |
| `/alerts` | Operational Alerts | `src/pages/AlertsPage.tsx` | `src/pages/AlertsPage.vue` |
| `/branding-preview`| Brand Identity Assets | `src/pages/BrandingPreviewPage.tsx` | `src/pages/BrandingPreviewPage.vue` |

---

## 4. Target Architecture & Foundation Plan

### 4.1 Target File Hierarchy
```text
src/
├── app/
│   └── App.vue                   # Application root with router-view and global toast container
├── assets/                       # Static branding & graphic assets
├── components/
│   ├── layout/                   # Sidebar.vue, Header.vue, MobileNavigation.vue
│   └── ui/                       # Reusable UI component library (Button, Card, Badge, etc.)
├── layouts/
│   └── AppLayout.vue             # Authenticated shell layout (Sidebar + Header + router-view)
├── pages/                        # Module page views (.vue)
├── router/
│   └── index.ts                  # Vue Router (HTML5 history mode, routes, auth navigation guards)
├── stores/                       # Pinia modular stores
│   ├── auth.store.ts             # User session, permissions, Sanctum tokens
│   ├── restaurant.store.ts       # Active restaurant selection, branch switching
│   ├── employee.store.ts         # Staff directory, attendance, shifts
│   ├── dashboard.store.ts        # KPIs, charts, executive summaries
│   └── ui.store.ts               # Theme, RTL/LTR direction, sidebar collapse, toasts
├── services/                     # Clean service layer bridging Stores <-> API Client
│   ├── authService.ts
│   ├── restaurantService.ts
│   ├── employeeService.ts
│   ├── attendanceService.ts
│   ├── schedulingService.ts
│   ├── inventoryService.ts
│   ├── menuService.ts
│   ├── orderService.ts
│   ├── reportService.ts
│   └── aiInsightService.ts
├── api/
│   └── client.ts                 # Axios instance with baseURL, bearer interceptors, error handling
├── types/
│   ├── domain.ts                 # Aligned with Laravel Eloquent models
│   └── ui.ts                     # Navigation, themes, UI contracts
├── composables/                  # Vue 3 composables (useLocalization, useBreakpoints, etc.)
└── mocks/                        # Domain-separated mock repositories
    ├── employees.ts
    ├── restaurants.ts
    ├── dashboard.ts
    ├── orders.ts
    ├── inventory.ts
    ├── menu.ts
    ├── attendance.ts
    ├── scheduling.ts
    └── aiInsights.ts
```

### 4.2 Data Flow Architecture
The target data flow replaces direct component-to-mock imports with a layered, decoupled pattern:

```text
[ Vue 3 Component (<script setup>) ]
                │
                ▼ (reads reactive state / dispatches actions)
        [ Pinia Store ]
                │
                ▼ (calls typed methods)
        [ Service Layer ]
          ├── (Phase 01: Returns mock datasets from src/mocks/*)
          └── (Phase 02+: Dispatches HTTP requests)
                │
                ▼
        [ Axios ApiClient (src/api/client.ts) ]
                │
                ▼ (Bearer Token / Sanctum Interceptor)
        [ Laravel Backend API ]
```

### 4.3 Branding & Design Integrity Guarantees
- All existing branding files in `/public/branding/` and `/public/` will be preserved untouched.
- Palette tokens in `src/index.css` (`#4edee3`, `#34abb1`, `#2c777c`) and RTL font stacks (`IBM Plex Sans Arabic`, `Cairo`, `Inter`) remain identical.
- Lucide Vue icons will be matched 1:1 with previous Lucide React icons.

---

## 5. Next Steps for Phase 01 Implementation
1. Initialize `src/app/App.vue` and rewrite `src/main.ts` as the Vue 3 entry point.
2. Configure `vite.config.ts` for pure Vue 3 + Tailwind CSS v4.
3. Install `axios` for `src/api/client.ts`.
4. Establish `src/router/index.ts` with all required route placeholders preserving paths.
5. Create standardized Pinia stores (`auth.store.ts`, `restaurant.store.ts`, `employee.store.ts`, `dashboard.store.ts`, `ui.store.ts`).
6. Create `src/mocks/dashboard.ts` and consolidate domain mock data.
7. Verify clean compilation with `compile_applet` and type-checking without runtime React dependencies.
