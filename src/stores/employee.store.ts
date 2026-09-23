import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Employee, Position } from '@/types/domain';
import { employeeService } from '@/services/employeeService';

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([]);
  const positions = ref<Position[]>([]);
  const selectedEmployee = ref<Employee | null>(null);
  const isLoading = ref<boolean>(false);

  // Filters
  const searchQuery = ref<string>('');
  const departmentFilter = ref<string>('all');
  const statusFilter = ref<string>('all');

  // Computed
  const filteredEmployees = computed(() => {
    return employees.value.filter(emp => {
      const q = searchQuery.value.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.first_name.ar.toLowerCase().includes(q) ||
        emp.first_name.en.toLowerCase().includes(q) ||
        emp.last_name.ar.toLowerCase().includes(q) ||
        emp.last_name.en.toLowerCase().includes(q) ||
        emp.employee_code.toLowerCase().includes(q);

      const matchesDept =
        departmentFilter.value === 'all' ||
        emp.position?.department === departmentFilter.value;

      const matchesStatus =
        statusFilter.value === 'all' ||
        emp.status === statusFilter.value;

      return matchesSearch && matchesDept && matchesStatus;
    });
  });

  const onDutyCount = computed(() => employees.value.filter(e => e.status === 'on_shift').length);
  const onLeaveCount = computed(() => employees.value.filter(e => e.status === 'on_leave').length);
  const totalEmployeesCount = computed(() => employees.value.length);

  async function fetchEmployees(restaurantId?: string): Promise<Employee[]> {
    isLoading.value = true;
    try {
      const [empList, posList] = await Promise.all([
        employeeService.getEmployees(restaurantId),
        employeeService.getPositions()
      ]);
      employees.value = empList;
      positions.value = posList;
      return empList;
    } catch (error) {
      console.error('[EmployeeStore] Failed to fetch employees:', error);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  function selectEmployee(emp: Employee | null): void {
    selectedEmployee.value = emp;
  }

  async function addEmployee(data: Partial<Employee>): Promise<Employee | null> {
    isLoading.value = true;
    try {
      const defaultData: Omit<Employee, 'id' | 'created_at' | 'updated_at'> = {
        employee_code: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        first_name: data.first_name || { ar: 'موظف', en: 'Staff' },
        last_name: data.last_name || { ar: 'جديد', en: 'New' },
        email: data.email || 'staff@restoraintel.com',
        phone: data.phone || '+966 50 000 0000',
        position_id: data.position_id || positions.value[0]?.id || 'pos-line-cook',
        position: data.position || positions.value[0],
        hire_date: data.hire_date || new Date().toISOString().split('T')[0],
        contract_type: data.contract_type || 'full_time',
        status: data.status || 'active',
        avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        skills: data.skills || ['خدمة عملاء', 'Customer Service'],
        leave_balance: data.leave_balance || { annual_days: 21, sick_days: 15, emergency_days: 5 },
        performance_score: data.performance_score || 90,
        hourly_rate: data.hourly_rate || 35,
        emergency_contact: data.emergency_contact || { name: 'ولي الأمر', relationship: 'عائلي', phone: '+966 50 000 0000' }
      };

      const created = await employeeService.createEmployee(defaultData);
      employees.value.unshift(created);
      return created;
    } catch (error) {
      console.error('[EmployeeStore] Failed to add employee:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    isLoading.value = true;
    try {
      const updated = await employeeService.updateEmployee(id, updates);
      const index = employees.value.findIndex(e => e.id === id);
      if (index !== -1) {
        employees.value[index] = updated;
      }
      if (selectedEmployee.value?.id === id) {
        selectedEmployee.value = updated;
      }
      return updated;
    } catch (error) {
      console.error('[EmployeeStore] Failed to update employee:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    employees,
    positions,
    selectedEmployee,
    isLoading,
    searchQuery,
    departmentFilter,
    statusFilter,
    filteredEmployees,
    onDutyCount,
    onLeaveCount,
    totalEmployeesCount,
    fetchEmployees,
    selectEmployee,
    addEmployee,
    updateEmployee
  };
});
