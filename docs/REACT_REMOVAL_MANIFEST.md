# Legacy React removal

The legacy TSX app has been removed from the production source at the user’s request. Its features were previously ported to active Vue pages in the supplied repaired archive. The earlier ZIP file remains a recoverable historical snapshot. Vue is the only active app entrypoint (`src/main.ts`).

Removed historical files:

- `src/App.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/MobileNavigation.tsx`
- `src/components/layout/PageContainer.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/ui/Avatar.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Dialog.tsx`
- `src/components/ui/Drawer.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/LoadingState.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Table.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/ui/ToastNotification.tsx`
- `src/context/AppContext.tsx`
- `src/main.tsx`
- `src/pages/AIIntelligencePage.tsx`
- `src/pages/AlertsPage.tsx`
- `src/pages/AttendancePage.tsx`
- `src/pages/BrandingPreviewPage.tsx`
- `src/pages/DashboardPage.tsx`
- `src/pages/EmployeesPage.tsx`
- `src/pages/InventoryPage.tsx`
- `src/pages/LeaveRequestsPage.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/MenuPage.tsx`
- `src/pages/OrdersPage.tsx`
- `src/pages/ReportsPage.tsx`
- `src/pages/SchedulingPage.tsx`

Removed historical seed: `src/data/mockData.ts`; unused duplicate localization table: `src/locales/translations.ts`.

Removed React/server-only dependencies: `@google/genai`, `dotenv`, `express`, `lucide-react`, `motion`, `@types/express`, `@types/react`, `@types/react-dom`, `autoprefixer`, `esbuild`, `tsx`.

Any React-specific branding tooling was also removed because it depended on unused source files; inspect `docs/ASSET_MANIFEST.md` for all retained visual assets.
