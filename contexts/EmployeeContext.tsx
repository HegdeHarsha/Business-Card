import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Employee } from '../types';
import { getEmployees, saveEmployees, subscribeToUpdates } from '../services/storageService';

interface EmployeeContextType {
  employees: Employee[];
  isLoading: boolean;
  getEmployeeById: (id: string) => Employee | undefined;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial data load
    setEmployees(getEmployees());
    setIsLoading(false);

    // Callback to reload data when notified of a change
    const handleDataChange = () => {
      setEmployees(getEmployees());
    };

    // Subscribe to cross-tab updates
    const unsubscribe = subscribeToUpdates(handleDataChange);

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  const addEmployee = useCallback((employeeData: Omit<Employee, 'id'>) => {
    setEmployees(prev => {
      const newEmployee = { ...employeeData, id: crypto.randomUUID() };
      const updatedEmployees = [...prev, newEmployee];
      saveEmployees(updatedEmployees);
      return updatedEmployees;
    });
  }, []);

  const updateEmployee = useCallback((updatedEmployee: Employee) => {
    setEmployees(prev => {
      const updatedEmployees = prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
      saveEmployees(updatedEmployees);
      return updatedEmployees;
    });
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => {
      const updatedEmployees = prev.filter(emp => emp.id !== id);
      saveEmployees(updatedEmployees);
      return updatedEmployees;
    });
  }, []);

  const getEmployeeById = useCallback((id: string) => {
    return employees.find(emp => emp.id === id);
  }, [employees]);
  
  const value = useMemo(() => ({
    employees,
    isLoading,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
  }), [employees, isLoading, getEmployeeById, addEmployee, updateEmployee, deleteEmployee]);

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
