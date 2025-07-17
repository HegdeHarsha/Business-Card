import { Employee } from '../types';

const DB_KEY = 'digital_business_cards_db';
const CHANNEL_NAME = 'employee_updates_channel';

// Create a BroadcastChannel to communicate between tabs/windows of the same origin.
const channel = new BroadcastChannel(CHANNEL_NAME);

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
        return [];
    }
};

export const saveEmployees = (employees: Employee[]): void => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(employees));
        // Notify other tabs that the data has changed.
        channel.postMessage({ type: 'data_changed' });
    } catch (error) {
        console.error("Failed to save employees to localStorage", error);
    }
};

/**
 * Subscribes to data change events from other tabs.
 * @param callback The function to call when data changes.
 * @returns A function to call to unsubscribe from the events.
 */
export const subscribeToUpdates = (callback: () => void): (() => void) => {
    const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'data_changed') {
            callback();
        }
    };
    channel.addEventListener('message', messageHandler);

    // Return an unsubscribe function for cleanup.
    return () => {
        channel.removeEventListener('message', messageHandler);
    };
};
