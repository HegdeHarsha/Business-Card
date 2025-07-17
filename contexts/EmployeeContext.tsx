import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Employee } from '../types';
import { getEmployees as getLocalEmployees, saveEmployees } from '../services/storageService';

const SHEET_URL_KEY = 'google_sheet_url';

// Simple CSV to JSON parser
const parseCSV = (csv: string): Omit<Employee, 'id'>[] => {
    const lines = csv.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const entry = headers.reduce((obj, header, index) => {
            if (header) {
                obj[header as keyof Employee] = values[index]?.trim() || '';
            }
            return obj;
        }, {} as any);
        return entry;
    });
    return data;
};


interface EmployeeContextType {
  employees: Employee[];
  isLoading: boolean;
  isSheetMode: boolean;
  sheetUrl: string;
  error: string | null;
  getEmployeeById: (id: string) => Employee | undefined;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  syncFromSheet: () => Promise<void>;
  setSheetUrl: (url: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetUrl, setSheetUrlState] = useState<string>(() => localStorage.getItem(SHEET_URL_KEY) || '');

  const isSheetMode = useMemo(() => !!sheetUrl, [sheetUrl]);

  const setSheetUrl = (url: string) => {
    localStorage.setItem(SHEET_URL_KEY, url);
    setSheetUrlState(url);
  };
  
  const fetchAndParseSheet = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use a proxy to bypass CORS issues if necessary, though public Google Sheets CSV links usually work.
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet: ${response.statusText}`);
      }
      const csvData = await response.text();
      const parsedData = parseCSV(csvData);
      
      const employeesWithIds = parsedData.map((emp, index) => ({
          ...emp,
          // Use provided ID or generate one if missing
          id: emp.id || `${Date.now()}-${index}` 
      })) as Employee[];

      setEmployees(employeesWithIds);

    } catch (e) {
      console.error("Failed to fetch or parse Google Sheet", e);
      setError("Could not load data from Google Sheet. Please check the URL and that it's published correctly as a CSV.");
      setEmployees(getLocalEmployees()); // Fallback to local
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadLocalData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setEmployees(getLocalEmployees());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isSheetMode) {
      fetchAndParseSheet(sheetUrl);
    } else {
      loadLocalData();
    }
  }, [isSheetMode, sheetUrl, fetchAndParseSheet, loadLocalData]);
  
  const addEmployee = useCallback((employeeData: Omit<Employee, 'id'>) => {
    if (isSheetMode) return; // Cannot modify when in sheet mode
    setEmployees(prev => {
      const newEmployee = { ...employeeData, id: crypto.randomUUID() };
      const updatedEmployees = [...prev, newEmployee];
      saveEmployees(updatedEmployees);
      return updatedEmployees;
    });
  }, [isSheetMode]);

  const updateEmployee = useCallback((updatedEmployee: Employee) => {
    if (isSheetMode) return;
    setEmployees(prev => {
      const updatedEmployees = prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
      saveEmployees(updatedEmployees);
      return updatedEmployees;
    });
  }, [isSheetMode]);

  const deleteEmployee = useCallback((id: string) => {
    if (isSheetMode) return;
    setEmployees(prev => {
      const updatedEmployees = prev.filter(emp => emp.id !== id);
      saveEmployees(updatedEmployees);
      return updatedEmployees;
    });
  }, [isSheetMode]);

  const getEmployeeById = useCallback((id: string) => {
    return employees.find(emp => emp.id === id);
  }, [employees]);

  const syncFromSheet = useCallback(async () => {
    if (isSheetMode) {
      await fetchAndParseSheet(sheetUrl);
    }
  }, [isSheetMode, sheetUrl, fetchAndParseSheet]);
  
  const value = useMemo(() => ({
    employees,
    isLoading,
    isSheetMode,
    sheetUrl,
    error,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    syncFromSheet,
    setSheetUrl
  }), [employees, isLoading, isSheetMode, sheetUrl, error, getEmployeeById, addEmployee, updateEmployee, deleteEmployee, syncFromSheet, setSheetUrl]);

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
