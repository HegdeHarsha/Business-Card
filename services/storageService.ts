import { Employee } from '../types';

const DB_KEY = 'digital_business_cards_db';

const getInitialData = (): Employee[] => {
    return [
        {
            id: 'd8a8f8b8-4b7b-4b7b-8b8b-8b8b8b8b8b8b',
            name: 'Alex Johnson',
            title: 'Senior Software Engineer',
            companyName: 'Innovatech Solutions',
            phone: '+1-202-555-0178',
            email: 'alex.j@innovatech.com',
            website: 'innovatech.com',
            photoUrl: 'https://picsum.photos/seed/alex/400',
            logoUrl: 'https://picsum.photos/seed/logo1/200'
        },
        {
            id: 'c7a7f7b7-3b7b-3b7b-7b7b-7b7b7b7b7b7b',
            name: 'Samantha Carter',
            title: 'Lead UX Designer',
            companyName: 'Innovatech Solutions',
            phone: '+1-202-555-0182',
            email: 'sam.c@innovatech.com',
            website: 'innovatech.com',
            photoUrl: 'https://picsum.photos/seed/samantha/400',
            logoUrl: 'https://picsum.photos/seed/logo1/200'
        },
        {
            id: 'b6a6f6b6-2b6b-2b6b-6b6b-6b6b6b6b6b6b',
            name: 'Michael Chen',
            title: 'Product Manager',
            companyName: 'NextGen Systems',
            phone: '+1-310-555-0145',
            email: 'michael.chen@nextgen.io',
            website: 'nextgen.io',
            photoUrl: 'https://picsum.photos/seed/michael/400',
            logoUrl: 'https://picsum.photos/seed/logo2/200'
        }
    ];
}

export const getEmployees = (): Employee[] => {
    try {
        const data = localStorage.getItem(DB_KEY);
        if (!data) {
            const initialData = getInitialData();
            saveEmployees(initialData);
            return initialData;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to parse employees from localStorage", error);
        return getInitialData(); // Fallback to initial data on parse error
    }
};

export const saveEmployees = (employees: Employee[]): void => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(employees));
    } catch (error) {
        console.error("Failed to save employees to localStorage", error);
    }
};
