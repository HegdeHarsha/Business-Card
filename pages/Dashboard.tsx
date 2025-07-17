import React, { useState, useEffect } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import EmployeeCard from '../components/EmployeeCard';
import { Employee } from '../types';
import { PhoneIcon, MailIcon, GlobeIcon, XIcon } from '../components/icons';

const EmployeeDetailModal: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = React.useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Wait for animation to finish
    }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);

    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const ContactItem: React.FC<{ icon: React.ReactNode; text: string; link: string; }> = ({ icon, text, link }) => (
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="text-brand-primary">{icon}</div>
            <span className="text-gray-700 break-all">{text}</span>
        </a>
    );

    const animationClasses = isClosing 
      ? 'opacity-0 scale-95'
      : 'opacity-100 scale-100';

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className={`w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${animationClasses}`}
                onClick={handleModalContentClick}
            >
                <div className="relative">
                    <button 
                        onClick={handleClose} 
                        className="absolute top-2 right-2 p-2 text-white bg-black bg-opacity-20 rounded-full hover:bg-opacity-40 z-10"
                        aria-label="Close"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                    <div className="h-24 bg-brand-primary"></div>
                    <img src={employee.photoUrl} alt={employee.name} className="w-32 h-32 rounded-full object-cover border-4 border-white absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-24" />
                </div>
                
                <div className="pt-20 pb-8 px-6 text-center">
                    <h1 className="text-2xl font-bold text-brand-dark">{employee.name}</h1>
                    <p className="text-gray-600">{employee.title}</p>
                    
                    <div className="mt-4 flex justify-center items-center space-x-2">
                        {employee.logoUrl && <img src={employee.logoUrl} alt={`${employee.companyName} logo`} className="w-6 h-6 rounded-sm object-contain"/>}
                        <p className="font-semibold text-brand-dark">{employee.companyName}</p>
                    </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="space-y-2">
                        {employee.phone && <ContactItem icon={<PhoneIcon className="w-5 h-5" />} text={employee.phone} link={`tel:${employee.phone}`} />}
                        {employee.email && <ContactItem icon={<MailIcon className="w-5 h-5" />} text={employee.email} link={`mailto:${employee.email}`} />}
                        {employee.website && <ContactItem icon={<GlobeIcon className="w-5 h-5" />} text={employee.website} link={`https://${employee.website}`} />}
                    </div>
                </div>

                <div className="bg-gray-50 text-center py-4 px-6">
                    <p className="text-xs text-gray-500">Digital Card by BizCard Central</p>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
  const { employees, isLoading } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  if (isLoading) {
    return <div className="text-center p-10">Loading employee data...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Employee Card Dashboard</h1>
      {employees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map(employee => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee}
              onCardClick={() => setSelectedEmployee(employee)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">No employee cards found.</h2>
          <p className="text-gray-500 mt-2">Get started by adding a new employee card.</p>
        </div>
      )}
      {selectedEmployee && (
        <EmployeeDetailModal 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;