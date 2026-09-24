# RestoraIntel — Current mock data architecture

**Status:** Repaired local source snapshot, September 24, 2026. **Mock only:** this project has no connected production Laravel API, database, biometric hardware, live KDS or AI model.

## Source-of-truth boundaries

```text
index.html -> src/main.ts -> Vue Router -> Vue pages
                                         | Pinia stores
                                         | application services
                                         v
                          src/data/providers/index.ts
                         (one MockDataProvider instance)
                            |                      |
     Confirmed Laravel-shaped DTOs       UI-only mock operations
       (numeric wire identifiers)        (typed legacy presentation IDs)
                            |                      |
                   immutable canonical      isolated legacy operational
                        fixtures             seed collections
```

The active application reads through service methods. `src/data/adapters/legacy-view.ts` is a **temporary compatibility boundary** converting numeric canonical DTO IDs to UI IDs (`rest-1`, `emp-101`, etc.). The active Vue components have not all been migrated to consume new presentation contracts directly.

`src/data/mockData.ts` was removed with the legacy React app. `src/mocks/` retains immutable UI-only operational seed material; do not instantiate independent mutable canonical stores from those arrays. The live Vue services no longer import mutable copies of those arrays. The provider owns mutable restaurant, employee, attendance, leave, scheduling, menu, order, inventory, alert and recommendation state in a single JavaScript session; reload resets operational mutations. This is not persistent database storage.

## Authorization and demo session

- The default provider starts logged out. The selected mock persona is stored in browser `sessionStorage` for that tab only, and logout clears it. This is a *demo convenience*, not secure production auth or real Sanctum.
- The demo password is `Demo!12345` for configured **fictional** accounts. Unknown emails, incorrect passwords and suspended accounts do not fall back to an administrator.
- The provider validates active restaurant memberships. Access to one restaurant does not allow access to another. Employee/restaurant mutations require the verified permission code associated with the requested restaurant; a system admin override requires a genuine system-scoped role with `system.restaurants.manage`.
- All protected methods check authorization, including mock-only operational operations. UI buttons are permission-aware but are not the security boundary.
- The mock auth/session never reaches a backend. Do not reuse its static demo credentials, token strings, or browser session logic for production.

## Canonical vs. UI-only contracts

`src/data/providers/types.ts` contains only documented Laravel operations for login/logout/me, list/get/create/update restaurant, list/get/create/update employee. Its response envelope has `status`, `message`, `data` and `meta: []`. Error classes encode 401, 403, 404 and 422.

`deleteEmployee` and `listPositions` were **removed from the asserted Laravel contract**, because their routes were not confirmed in the backend API inventory available during repair. Mock-only `mockListPositions` and other typed operations are declared in `src/data/providers/operational.types.ts`. The operational interface does **not** claim corresponding Laravel endpoints exist. The backend reference used for design is not included in this frontend archive; independently verify against current Laravel code before HTTP integration.

All canonical fixtures under `src/contracts/fixtures/` use numeric primary/foreign keys. Demo positions are scoped to restaurants. Legacy operational seeds still use `rest-n`/`emp-n` presentation IDs; these are converted at service/data boundaries. Historical activity datasets are demonstrations; historical timestamps should not be presented as live measurements.

## Consistency and limitations

- `mockGetSummary` derives pending leave, critical inventory and active-order counts from provider-owned state; pre-existing sales reports and additional non-derived KPIs are *historical seed snapshots*. Do not portray them as real-time measured values.
- Employee creation and restaurant updates use typed mappers and central provider state; invalid foreign keys, duplicate slugs/numbers, prohibited request fields and unauthorized operations raise explicit errors.
- Individual alerts marked as read and recommendation decisions update shared provider collections and are visible on subsequent reads; they do not resolve real incidents or deploy an AI model.
- Restaurant-switching pages use generation checks to discard late responses. Some legacy operational snapshot employee references may still differ from the newer canonical fixtures; new functionality should progressively normalize each remaining fixture with independent integrity tests.
- Brand assets referenced by the active Vue app are preserved; the old TSX files have been removed from this cleaned source delivery by user request. The earlier archive is the recovery source.

## Development verification

With dependencies installed (prefer the repository's Bun lockfile):

```bash
bun install --frozen-lockfile
bun test
npm run typecheck
npm run lint
npm run build
```

Supplemental checks available when dependencies are not installable:

```bash
node scripts/verify-source.cjs
node scripts/verify-provider.cjs
node scripts/verify-bun-tests-node.cjs
```

The Node-based Bun compatibility runner exercises the **actual test files**, but **is not a substitute for running Bun**, and the source syntax checker cannot typecheck Vue templates. `scripts/tsconfig.core-check.json` supports a separate TypeScript typecheck for the provider/contracts/services subset using any available TypeScript compiler:

```bash
tsc -p scripts/tsconfig.core-check.json --pretty false
```
