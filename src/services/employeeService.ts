import type { Employee, Position } from '@/types/domain';
import type { EmployeeStatus } from '@/contracts/backend/employee';
import { getDataProvider, getMockOperations } from '@/data/providers';
import { toLegacyEmployee, toLegacyPosition, wireId } from '@/data/adapters/legacy-view';

const employmentStatuses: EmployeeStatus[] = ['active', 'inactive', 'on_leave', 'terminated', 'suspended'];
const employmentStatus = (value: Employee['status'] | undefined): EmployeeStatus =>
  value && employmentStatuses.includes(value as EmployeeStatus) ? value as EmployeeStatus : 'active';

export const employeeService = {
  async getEmployees(restaurantId: string): Promise<Employee[]> {
    return (await getDataProvider().listEmployees(wireId(restaurantId, 'rest'))).data.map(toLegacyEmployee);
  },
  async getEmployee(restaurantId: string, id: string): Promise<Employee | null> {
    try { return toLegacyEmployee((await getDataProvider().getEmployee(wireId(restaurantId, 'rest'), wireId(id, 'emp'))).data); }
    catch (err) { if (err instanceof Error && err.name === 'NotFoundError') return null; throw err; }
  },
  async createEmployee(data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    if (!data.restaurant_id) throw new Error('Select a restaurant before creating an employee.');
    const payload = {
      first_name: data.first_name.en?.trim() || data.first_name.ar.trim(),
      last_name: data.last_name.en?.trim() || data.last_name.ar.trim(),
      status: employmentStatus(data.status),
      employee_number: data.employee_code || null,
      email: data.email || null, phone: data.phone || null, hire_date: data.hire_date || null,
      position_id: data.position_id ? wireId(data.position_id, 'pos') : null,
    };
    const res = await getDataProvider().createEmployee(wireId(data.restaurant_id, 'rest'), payload);
    return toLegacyEmployee(res.data);
  },
  async updateEmployee(restaurantId: string, id: string, data: Partial<Employee>): Promise<Employee> {
    const payload = {
      ...(data.first_name ? { first_name: data.first_name.en || data.first_name.ar } : {}),
      ...(data.last_name ? { last_name: data.last_name.en || data.last_name.ar } : {}),
      ...(data.employee_code !== undefined ? { employee_number: data.employee_code } : {}),
      ...(data.email !== undefined ? { email: data.email || null } : {}),
      ...(data.phone !== undefined ? { phone: data.phone || null } : {}),
      ...(data.hire_date !== undefined ? { hire_date: data.hire_date || null } : {}),
      ...(data.status !== undefined ? { status: employmentStatus(data.status) } : {}),
      ...(data.position_id !== undefined ? { position_id: data.position_id ? wireId(data.position_id, 'pos') : null } : {}),
    };
    const res = await getDataProvider().updateEmployee(wireId(restaurantId, 'rest'), wireId(id, 'emp'), payload);
    return toLegacyEmployee(res.data);
  },
  async getPositions(restaurantId: string): Promise<Position[]> {
    return (await getMockOperations().mockListPositions(wireId(restaurantId, 'rest'))).map(toLegacyPosition);
  },
};
