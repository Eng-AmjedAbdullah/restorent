import { describe, it, expect, beforeEach } from 'bun:test';
import { MockDataProvider, DEMO_PASSWORD } from '../mock.provider';
import { AuthenticationError, AuthorizationError, NotFoundError, ValidationError } from '../types';

const admin = { email: 'admin@restoraintel.com', password: DEMO_PASSWORD };
const manager = { email: 'ahmed.mansoor@restoraintel.com', password: DEMO_PASSWORD };
const staff = { email: 'khalid.ghamdi@restoraintel.com', password: DEMO_PASSWORD };
let provider: MockDataProvider;

beforeEach(() => { provider = new MockDataProvider({ latencyMs: 0, restoreSession: false }); });

async function signIn(credentials = admin): Promise<void> { await provider.login(credentials); }

/** These tests exercise the actual provider: authorization is never mocked or bypassed. */
describe('Stage B: Laravel-shaped mock provider integration', () => {
  it('returns the documented success envelope with numeric identifiers and empty meta', async () => {
    await signIn();
    const { status, message, data, meta } = await provider.listRestaurants();
    expect(status).toBe('success'); expect(typeof message).toBe('string');
    expect(data.length).toBeGreaterThanOrEqual(5);
    expect(Number.isInteger(data[0].id)).toBe(true);
    expect(meta).toEqual([]);
  });

  it('enforces 401 for logged-out restaurant and employee reads', async () => {
    await expect(provider.listRestaurants()).rejects.toBeInstanceOf(AuthenticationError);
    await expect(provider.listEmployees(1)).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('rejects unknown email, wrong password, and suspended identities without privileged fallback', async () => {
    await expect(provider.login({ email:'unknown@example.com', password: DEMO_PASSWORD })).rejects.toBeInstanceOf(AuthenticationError);
    await expect(provider.login({ email: manager.email, password:'wrong' })).rejects.toBeInstanceOf(AuthenticationError);
    await expect(provider.login({ email:'faisal@example.com', password: DEMO_PASSWORD })).rejects.toBeInstanceOf(AuthenticationError);
    await expect(provider.checkAuthMe()).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('supports valid demo login, current user and enforced logout', async () => {
    await signIn(manager);
    const result = await provider.checkAuthMe();
    expect(result.data.email).toBe(manager.email);
    await provider.logout();
    await expect(provider.checkAuthMe()).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('restricts restaurant listing to active memberships for a staff user', async () => {
    await signIn(staff);
    expect((await provider.listRestaurants()).data.map(r=>r.id)).toEqual([1]);
    await expect(provider.getRestaurant(2)).rejects.toBeInstanceOf(AuthorizationError);
    await expect(provider.listEmployees(2)).rejects.toBeInstanceOf(AuthorizationError);
  });

  it('does not grant mutation permission to a membership-only staff user', async () => {
    await signIn(staff);
    await expect(provider.updateRestaurant(1, { name:'Unauthorized' })).rejects.toBeInstanceOf(AuthorizationError);
    await expect(provider.createEmployee(1, { first_name:'Test', last_name:'Test', status:'active' })).rejects.toBeInstanceOf(AuthorizationError);
  });

  it('rejects cross-restaurant employee updates without leaking the record', async () => {
    await signIn(manager);
    await expect(provider.getEmployee(2,201)).rejects.toBeInstanceOf(AuthorizationError);
    await expect(provider.updateEmployee(2,201,{first_name:'Invalid'})).rejects.toBeInstanceOf(AuthorizationError);
    expect((await provider.getEmployee(1,101)).data.restaurant_id).toBe(1);
  });

  it('rejects suspended personas before a session can be established', async () => {
    expect(() => provider.setSimulatedUser(5)).toThrow(AuthenticationError);
    await expect(provider.listRestaurants()).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('returns 404 for inaccessible non-existent tenant after authentication', async () => {
    await signIn();
    await expect(provider.getRestaurant(99999)).rejects.toBeInstanceOf(NotFoundError);
    await expect(provider.getEmployee(1,99999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('enforces field validation without mutating the collection on failure', async () => {
    await signIn(manager);
    const before = (await provider.listEmployees(1)).data.length;
    await expect(provider.createEmployee(1,{first_name:'',last_name:'',status:'active'})).rejects.toBeInstanceOf(ValidationError);
    await expect(provider.createEmployee(1,{first_name:'A',last_name:'B',status:'active',position_id:4})).rejects.toBeInstanceOf(ValidationError);
    expect((await provider.listEmployees(1)).data).toHaveLength(before);
  });

  it('creates an employee with deterministic numeric ID and reads the same mutation', async () => {
    await signIn(manager);
    const before = await provider.listEmployees(1);
    const created = await provider.createEmployee(1,{first_name:'Tareq',last_name:'Al-Husseini',status:'active',email:'tareq@example.com'});
    expect(Number.isInteger(created.data.id)).toBe(true);
    expect(created.data.restaurant_id).toBe(1);
    const after = await provider.listEmployees(1);
    expect(after.data).toHaveLength(before.data.length+1);
    expect((await provider.getEmployee(1, created.data.id)).data.first_name).toBe('Tareq');
  });

  it('updates employee within tenant without allowing ownership mutation', async () => {
    await signIn(manager);
    const updated = await provider.updateEmployee(1,101,{first_name:'Ahmed Updated', status:'on_leave'});
    expect(updated.data.restaurant_id).toBe(1);
    expect((await provider.getEmployee(1,101)).data.first_name).toBe('Ahmed Updated');
    await expect(provider.updateEmployee(1,101,{restaurant_id:2} as never)).rejects.toBeInstanceOf(ValidationError);
  });

  it('updates restaurant profile without duplicating records or accepting existing slug', async () => {
    await signIn(manager);
    const before = (await provider.listRestaurants()).data.length;
    await expect(provider.updateRestaurant(1,{slug:'jed-01'})).rejects.toBeInstanceOf(ValidationError);
    expect((await provider.updateRestaurant(1,{name:'Updated Branch'})).data.name).toBe('Updated Branch');
    expect((await provider.listRestaurants()).data).toHaveLength(before);
  });

  it('keeps an intentionally empty restaurant empty, including demo orders', async () => {
    await signIn();
    expect((await provider.listEmployees(5)).data).toHaveLength(0);
    expect(await provider.mockGetOrders(5)).toHaveLength(0);
  });

  it('rejects invalid KDS transition and permits its valid successor', async () => {
    await signIn(manager);
    const order = (await provider.mockGetOrders(1)).find(o=>o.status==='new');
    expect(order).toBeDefined();
    await expect(provider.mockUpdateOrderStatus(1,order!.id,'delivered')).rejects.toBeInstanceOf(ValidationError);
    expect((await provider.mockUpdateOrderStatus(1,order!.id,'preparing')).status).toBe('preparing');
  });

  it('updates inventory in the same tenant-scoped collection', async () => {
    await signIn(manager);
    const item = (await provider.mockGetInventory(1))[0];
    expect(item).toBeDefined();
    await provider.mockUpdateStock(1,item.id,42);
    expect((await provider.mockGetInventory(1)).find(i=>i.id===item.id)?.current_stock).toBe(42);
  });

  it('changes pending leave requests only with valid decisions and rejection reasons', async () => {
    await signIn(manager);
    const leave = (await provider.mockGetLeaveRequests(1)).find(l=>l.status==='pending');
    expect(leave).toBeDefined();
    await expect(provider.mockDecideLeave(1,leave!.id,'rejected','')).rejects.toBeInstanceOf(ValidationError);
    expect((await provider.mockDecideLeave(1,leave!.id,'approved')).status).toBe('approved');
    await expect(provider.mockDecideLeave(1,leave!.id,'approved')).rejects.toBeInstanceOf(ValidationError);
  });

  it('synchronizes alert read state through subsequent provider reads', async () => {
    await signIn(manager);
    const alert = (await provider.mockGetAlerts(1))[0];
    expect(alert).toBeDefined();
    await provider.mockMarkAlertRead(1,alert.id);
    expect((await provider.mockGetAlerts(1)).find(a=>a.id===alert.id)?.read).toBe(true);
  });

  it('derives financial dashboard snapshots from the latest historical report rows', async () => {
    await signIn(manager);
    const reports = [...await provider.mockGetReports(1)].sort((a,b)=>a.date.localeCompare(b.date));
    const latest = reports.at(-1);
    const previous = reports.at(-2);
    expect(latest).toBeDefined();
    expect(previous).toBeDefined();
    const summary = await provider.mockGetSummary(1);
    const kpis = await provider.mockGetKPIs(1);
    expect(summary?.sales_today).toBe(latest!.sales);
    expect(summary?.sales_yesterday).toBe(previous!.sales);
    expect(kpis?.averageTicket).toBe(latest!.average_ticket);
    await provider.logout();
    await signIn(admin);
    expect((await provider.mockGetSummary(5))).toBeNull();
  });

  it('updates active-order count in the same dashboard dataset when an order is delivered', async () => {
    await signIn(manager);
    const order = (await provider.mockGetOrders(1)).find(item => item.status === 'new');
    expect(order).toBeDefined();
    const starting = (await provider.mockGetSummary(1))?.active_orders_count;
    await provider.mockUpdateOrderStatus(1, order!.id, 'preparing');
    await provider.mockUpdateOrderStatus(1, order!.id, 'ready');
    await provider.mockUpdateOrderStatus(1, order!.id, 'delivered');
    expect((await provider.mockGetSummary(1))?.active_orders_count).toBe(starting! - 1);
  });
});
