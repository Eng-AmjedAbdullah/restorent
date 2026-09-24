# RestoraIntel — Unified Mock Data Architecture (STAGE B)

## 1. Overview & Architecture

RestoraIntel adopts a strict **Contract-First, Mock-Driven Architecture**. The frontend runs entirely offline with high-fidelity Laravel REST API emulation while preparing for future HTTP provider integration.

```
Vue 3 Components & Views
          |
     Pinia Stores (Single Active Restaurant Context)
          |
  Typed Application Services
          |
   DataProvider Interface (src/data/providers/types.ts)
          |
   +---------------------------+---------------------------+
   |                                                       |
MockDataProvider                             HttpDataProvider
(src/data/providers/mock.provider.ts)      (Future Integration Phase)
- In-memory stateful store                  - Axios/Fetch client
- Canonical backend DTOs                    - Bearer token header
- Deterministic ID generation               - Live Laravel Sanctum
- Network latency simulation                - Real PostgreSQL/MySQL
```

## 2. Authoritative Source of Truth

Parallel and conflicting mock datasets (`src/data/mockData.ts` vs `src/mocks/` vs `src/contracts/fixtures/`) have been unified.
The single authoritative baseline for confirmed entities is:

`src/contracts/fixtures/canonicalFixtures.ts`

### Entity Schemas & Numeric ID Model
- **Restaurants**: Primary key `id: number` (1, 2, 3, 4, 5). Multi-currency support (`SAR`, `AED`, `USD`, `EUR`, `KWD`). Optional `slug` supported on create and update.
- **Employees**: Primary key `id: number` (101, 102, ...). Scoped by `restaurant_id: number`. Canonical `employee_number` (`EMP-0101`). Nullable `user_id`, `position_id`, `email`, `phone`, `hire_date`.
- **Positions**: Primary key `id: number` (1, 2, ...). Scoped by `restaurant_id: number`.
- **Users**: Primary key `id: number` (1, 2, ...). Authentication identity decoupled from direct restaurant ownership; linked through `memberships: RestaurantMembershipDto[]`.
- **Permissions**: Confirmed canonical permissions (`system.restaurants.manage`, `restaurant.profile.manage_self`, `restaurant.employees.manage`, `restaurant.shifts.view`, `restaurant.inventory.view`, `restaurant.reports.view`).

## 3. DataProvider Contract

The `DataProvider` interface (`src/data/providers/types.ts`) defines operations for all confirmed backend endpoints:

### Confirmed Operations
| Method | Description | Laravel REST Route |
| :--- | :--- | :--- |
| `login(credentials)` | Authenticate user & issue Sanctum token | `POST /api/auth/login` |
| `logout()` | Invalidate current session token | `POST /api/auth/logout` |
| `checkAuthMe()` | Get authenticated user and memberships | `GET /api/auth/me` |
| `listRestaurants()` | Retrieve all accessible restaurants | `GET /api/restaurants` |
| `getRestaurant(id)` | Retrieve branch profile | `GET /api/restaurants/{restaurant}` |
| `createRestaurant(data)`| Register a new branch | `POST /api/restaurants` |
| `updateRestaurant(id, data)`| Update branch metadata & settings | `PUT /api/restaurants/{restaurant}` |
| `listEmployees(restId)` | Retrieve staff for active branch | `GET /api/restaurants/{restaurant}/employees` |
| `getEmployee(restId, empId)`| Retrieve employee profile | `GET /api/restaurants/{restaurant}/employees/{employee}`|
| `createEmployee(restId, data)`| Add new staff member | `POST /api/restaurants/{restaurant}/employees` |
| `updateEmployee(restId, empId, data)`| Update staff member | `PUT /api/restaurants/{restaurant}/employees/{employee}`|
| `deleteEmployee(restId, empId)`| Terminate/remove employee | `DELETE /api/restaurants/{restaurant}/employees/{employee}`|
| `listPositions(restId)` | Retrieve job titles/positions | `GET /api/restaurants/{restaurant}/positions` |

### Unconfirmed Domains Compatibility Layer
Domains not yet finalized in the Laravel backend (`Orders`, `Inventory`, `Menu`, `Attendance`, `Scheduling`, `Reports`, `AI Insights`) are provided via isolated compatibility methods strictly scoped by `restaurantId: number`. Their data structures do not pollute canonical backend DTOs.

## 4. Laravel Response Envelopes & Error Categories

All successful operations return the standard Laravel API resource envelope:

```json
{
  "status": "success",
  "message": "Employees retrieved successfully.",
  "data": [ ... ],
  "meta": { "total": 6, "count": 6 }
}
```

Failure categories are modeled as typed errors reproducing HTTP response status codes:
- **`ValidationError` (422)**: Field-level validation arrays (`errors: Record<string, string[]>`).
- **`AuthenticationError` (401)**: Missing, invalid, or expired Sanctum bearer token.
- **`AuthorizationError` (403)**: User does not possess membership or required permission for target branch.
- **`NotFoundError` (404)**: Eloquent `ModelNotFoundException` simulation (`No query results for model [App\Models\Employee] 999`).

## 5. In-Memory Mutation & Tenant Referential Integrity

`MockDataProvider` maintains stateful in-memory collections during development sessions:
1. **Deterministic Numeric IDs**: New employees receive auto-incrementing integer IDs (`Math.max(...ids) + 1`), not random timestamps.
2. **Strict Multi-Tenant Isolation**: New employees are strictly bound to the active `restaurantId`. Updates cannot alter `restaurant_id`.
3. **Empty Branch State**: Restaurant 5 (`Restora Test Empty Branch - Diplomatic`) is configured with zero employees and zero orders for comprehensive UI empty-state verification.
4. **Configurable Latency**: Default 30ms simulation of network roundtrip; configurable to 0ms for instantaneous unit test suites.
