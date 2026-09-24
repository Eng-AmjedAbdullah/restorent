# RestoraIntel — Repaired frontend/backend contract audit

**Last repaired:** September 24, 2026. See `docs/archive/PREVIOUS_AGENT_CONTRACT_AUDIT.md` for the preserved historical audit, which contained outdated assertions about implementation completeness.

## Confirmed from the previously supplied backend API inventory

| Domain | Documented API operations | Frontend implementation |
| --- | --- | --- |
| Auth | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | Mock provider and credential-validated demo session; no HTTP requests |
| Restaurant | `GET /api/restaurants`, `GET /api/restaurants/{restaurant}`, `POST /api/restaurants`, `PUT /api/restaurants/{restaurant}` | Numeric DTOs, request validation, scoped permissions and mock mutations |
| Employee | `GET/POST /api/restaurants/{restaurant}/employees`, `GET/PUT /api/restaurants/{restaurant}/employees/{employee}` | Numeric DTOs and route-scoped employee validation; no public DELETE assumption |

The backend reference describes the success envelope as `{ status: 'success', message, data, meta: [] }`, with analogous error envelopes and field-array validation errors. Demo provider exceptions are typed HTTP-style simulations and do not imply real HTTP traffic.

**Important unresolved contract details:** verify all backend DTO optional loaded relations, the login response's precise optional expansions, and newer backend route/permission changes against the running Laravel code before real integration. The frontend ZIP alone cannot prove live backend equivalence.

## Corrected mismatches

- Laravel identity keys and foreign keys are numeric in canonical DTOs. The old Vue and React mock UI IDs are strings; conversion is centralized in `src/data/adapters/legacy-view.ts`, not hidden inside API DTOs.
- Restaurant canonical names are plain strings and use `currency_code`, not a localized UI dictionary. Optional slug is allowed in create/update payloads and must be unique; IDs and server timestamps are rejected in mutation bodies.
- Employee identity is separate from user identity; employment lifecycle status is distinct from on-shift attendance. Nullable email, phone, hire date, user ID and position ID are preserved. Position references must belong to the selected restaurant.
- RestaurantMembership keeps status/join/leave dates and explicit role assignments. Permission checks use actual permission codes rather than display role names. Frontend authorization remains a mock simulation; Laravel must independently enforce production access.
- Both unknown demo emails and invalid passwords fail; no admin fallback. All protected mock operations require a valid mock session.
- `deleteEmployee` and `listPositions` are *not advertised as confirmed Laravel endpoints*. Historical UI data sources under `src/mocks` and `src/data/mockData.ts` are legacy seed/reference files, not additional live application stores.

## Current verification boundary

An offline Node compatibility runner exercised 62 declared Bun-style tests successfully and 15 additional integration smoke checks; separate TypeScript core checking and static TS/Vue-script syntax parsing also passed. **Bun itself, `vue-tsc`, and the Vite production build could not be executed here because package installation was unavailable.** Runtime browser/UI testing is still required before claiming full production readiness.
