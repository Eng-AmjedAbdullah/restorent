# RestoraIntel — source cleanup and functional completion

Date: 2026-09-24  
Delivery: Vue-only mock-first source archive, prepared from the *previously repaired* project, not from the older GitHub main.

## Changes implemented

1. **React removal**: 33 historical `.tsx` source files removed. `src/App.tsx`, `src/main.tsx`, and `src/context/AppContext.tsx` are gone. The only active entrypoint remains `src/main.ts`. React/React-DOM, React type packages, `lucide-react`, `motion`, and unrelated prototype/server packages were removed from `package.json`.
2. **Lockfile cleanup**: Bun JSON lockfile pruned to the dependency closure for the actual Vue root dependencies, without inventing new versions. Historical unused package records removed. **Bun frozen install still requires verification on a machine with Bun and internet.**
3. **Asset cleanup**: 27 original images removed from the production source after checking active Vue, HTML and CSS references. 12 used visual assets remain, including two original full-resolution transparent PNG masters used in the branding gallery. Original removed images are retained in a separate external backup ZIP. Square-canvas browser/PWA PNG icons were padded transparently (not distorted or recolored).
4. **Branding preview**: Added responsive, interactive light/dark/transparent background preview, sidebar collapsed/expanded and dark/light preview, header dark/light and narrow/desktop preview. These simulations do not replace or modify actual production Vue components. Fixed clipboard success messaging to report failure honestly.
5. **Shift scheduling**: Added independent validation rules, client-side overlap indicators, server-like provider enforcement of date/time validity, cross-restaurant ownership, active workforce status, overlapping shifts and approved leave conflicts. Included date navigation, station coverage and uncovered positions in the Vue page.
6. **Historical reporting accuracy**: Dashboard sample-day sales and prior-period comparison now derive from the latest two actual seeded report rows, not unrelated static fallback figures. Other dynamic counts remain derived from centralized provider collections. Labels identify the sample snapshot date. Non-financial customer satisfaction and peak-time figures remain historical demo snapshots, not verified live telemetry.
7. **Quality safeguards**: Added an offline visual asset/reference validator, a deterministic Bun lockfile pruning script and a padded icon normalization recipe. Expanded the existing scheduling tests with negative/positive and atomic conflict cases.

## Architecture preserved from the previous repaired archive

The single mock provider controls canonical restaurant, employee and operational collections. Application services use it; demo authentication rejects unknown/invalid personas, provider operations enforce active membership and permission codes, and Vue pages show tenant-scoped lists and mutations. These functions were already implemented in the preceding repaired source and are preserved here.

## Verification performed on this archive

- `node scripts/verify-assets.cjs`: Checks every retained visual asset has an active static code reference and required icon canvases have correct dimensions.
- `node scripts/verify-source.cjs`: TypeScript parser checks TS files and TS sections in active Vue SFCs; this is syntax-only.
- `tsc -p scripts/tsconfig.core-check.json --pretty false`: Checks backend contracts, fixtures, providers, adapters, services and mock domain types.
- `node scripts/verify-provider.cjs`: Dependency-free provider/service smoke tests.
- `node scripts/verify-bun-tests-node.cjs`: Runs the actual Bun-style suites using an offline Node compatibility harness, with explicit result counts.
- `zip -T` plus archive inventory verification: Checks compressed delivery integrity and confirms no TSX files or orphan images are included.

Exact execution results are recorded in the final verification log, `docs/VERIFICATION_LOG.md`.

## Not executed and remaining acceptance work

- `bun test`: Bun unavailable in the execution environment.
- `bun install --frozen-lockfile`: Bun unavailable; pruned lockfile needs native Bun validation.
- `npm run typecheck` / `vue-tsc`: Vue dependencies could not be installed from the network here; Vue template type checking **not verified**.
- `npm run build`: Vite unavailable in this environment; production bundle **not verified**.
- Full interactive browser QA, mobile screenshots, keyboard and screen-reader accessibility: **not verified**.
- Print/save-PDF is implemented using the browser print path; there is no independent server PDF rendering engine. The CSV export is browser-side.
- This remains a **demo application**. Real Laravel integration, production-grade auth, physical attendance hardware, a trained AI model and real notifications are outside this frontend artifact.

The cleaned archive must pass native Bun/Vue/Vite checks and browser regression testing **before production deployment**. If any real dependency/tool step fails, fix that environment result rather than treating these offline checks as certification.
