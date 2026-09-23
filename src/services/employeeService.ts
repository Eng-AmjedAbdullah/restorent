import type { Employee, Position } from '@/types/domain';
import { mockEmployees, mockPositions } from '@/mocks/employees';

let employeesState: Employee[] = JSON.parse(JSON.stringify(mockEmployees));

export const employeeService = {
  async getEmployees(restaurantId?: string): Promise<Employee[]> {
    let list = employeesState;
    if (restaurantId) {
      list = list.filter(e => e.restaurant_id === restaurantId);
    }
    return JSON.parse(JSON.stringify(list));
  },

  async getEmployee(id: string): Promise<Employee | null> {
    const emp = employeesState.find(e => e.id === id);
    return emp ? JSON.parse(JSON.stringify(emp)) : null;
  },

  async createEmployee(data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    const now = new Date().toISOString();
    const newEmp: Employee = {
      ...data,
      id: `emp-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    employeesState.unshift(newEmp);
    return JSON.parse(JSON.stringify(newEmp));
  },

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    const index = employeesState.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Employee ${id} not found`);
    employeesState[index] = {
      ...employeesState[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    return JSON.parse(JSON.stringify(employeesState[index]));
  },

  async deleteEmployee(id: string): Promise<boolean> {
    const before = employeesState.length;
    employeesState = employeesState.filter(e => e.id !== id);
    return employeesState.length < before;
  },

  async getPositions(): Promise<Position[]> {
    return JSON.parse(JSON.stringify(mockPositions));
  }
};
