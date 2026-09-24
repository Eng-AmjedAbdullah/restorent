import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Employee, Position } from '@/types/domain';
import { employeeService } from '@/services/employeeService';
import { useAuthStore } from './auth.store';

export const useEmployeeStore = defineStore('employee', () => {
  const auth = useAuthStore();
  const employees = ref<Employee[]>([]);
  const positions = ref<Position[]>([]);
  const selectedEmployee = ref<Employee | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');
  const departmentFilter = ref('all');
  const statusFilter = ref('all');
  let requestGeneration = 0;

  const filteredEmployees = computed(() => employees.value.filter(emp => {
    const q = searchQuery.value.toLocaleLowerCase().trim();
    const searchText = [emp.first_name.ar, emp.first_name.en, emp.last_name.ar, emp.last_name.en, emp.employee_code, emp.email].join(' ').toLocaleLowerCase();
    return (!q || searchText.includes(q)) && (departmentFilter.value === 'all' || emp.position?.department === departmentFilter.value) &&
      (statusFilter.value === 'all' || emp.status === statusFilter.value);
  }));
  const onDutyCount = computed(() => employees.value.filter(e => e.status === 'on_shift').length);
  const onLeaveCount = computed(() => employees.value.filter(e => e.status === 'on_leave').length);
  const totalEmployeesCount = computed(() => employees.value.length);
  async function fetchEmployees(restaurantId?: string): Promise<Employee[]> {
    const generation = ++requestGeneration;
    employees.value = []; positions.value = []; selectedEmployee.value = null; error.value = null;
    if (!restaurantId) { isLoading.value = false; return []; }
    isLoading.value = true;
    try {
      const [list, pos] = await Promise.all([employeeService.getEmployees(restaurantId), employeeService.getPositions(restaurantId)]);
      if (generation === requestGeneration && auth.currentRestaurant?.id === restaurantId) { employees.value = list; positions.value = pos; }
      return list;
    } catch (err) {
      if (generation === requestGeneration) error.value = err instanceof Error ? err.message : 'Unable to fetch employees.';
      return [];
    } finally { if (generation === requestGeneration) isLoading.value = false; }
  }
  function selectEmployee(employee: Employee | null): void { selectedEmployee.value = employee; }
  async function addEmployee(data: Partial<Employee>): Promise<Employee | null> {
    error.value = null;
    const id = auth.currentRestaurant?.id;
    if (!id || !data.first_name?.en?.trim() || !data.last_name?.en?.trim()) {
      error.value = 'Select a restaurant and provide first and last names.'; return null;
    }
    isLoading.value = true;
    try {
      const created = await employeeService.createEmployee({
        restaurant_id: id, first_name: data.first_name, last_name: data.last_name,
        employee_code: data.employee_code ?? '', email: data.email ?? '', phone: data.phone ?? '',
        position_id: data.position_id ?? '', position: data.position, hire_date: data.hire_date ?? '',
        contract_type: data.contract_type ?? 'full_time', status: data.status ?? 'active',
        avatar_url: '', skills: [], leave_balance: { annual_days: 0, sick_days: 0, emergency_days: 0 },
        performance_score: 0, hourly_rate: 0, emergency_contact: { name: '', relationship: '', phone: '' },
      });
      employees.value.unshift(created); return created;
    } catch (err) { error.value = err instanceof Error ? err.message : 'Unable to create employee.'; return null; }
    finally { isLoading.value = false; }
  }
  async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    error.value = null; const restId = auth.currentRestaurant?.id;
    if (!restId) { error.value = 'Select a restaurant.'; return null; }
    isLoading.value = true;
    try {
      const updated = await employeeService.updateEmployee(restId, id, updates);
      const idx = employees.value.findIndex(e => e.id === id);
      if (idx !== -1) employees.value[idx] = updated;
      if (selectedEmployee.value?.id === id) selectedEmployee.value = updated;
      return updated;
    } catch (err) { error.value = err instanceof Error ? err.message : 'Unable to update employee.'; return null; }
    finally { isLoading.value = false; }
  }
  return { employees, positions, selectedEmployee, isLoading, error, searchQuery, departmentFilter, statusFilter,
    filteredEmployees, onDutyCount, onLeaveCount, totalEmployeesCount, fetchEmployees, selectEmployee, addEmployee, updateEmployee };
});
