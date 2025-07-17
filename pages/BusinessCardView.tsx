
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEmployees } from '../contexts/EmployeeContext';
import type { Employee } from '../types';
import { PhoneIcon, MailIcon, GlobeIcon } from '../components/icons';

const BusinessCardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEmployeeById } = useEmployees();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (id) {
      const foundEmployee = getEmployeeById(id);
      setEmployee(foundEmployee ?? null);
    }
  }, [id, getEmployeeById]);

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-center p-10 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-600">Employee Not Found</h2>
          <p className="text-gray-600 mt-2">The business card you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const ContactItem: React.FC<{ icon: React.ReactNode; text: string; link: string; }> = ({ icon, text, link }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <div className="text-brand-primary">{icon}</div>
      <span className="text-gray-700">{text}</span>
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500">
        <div className="relative">
          <div className="h-24 bg-brand-primary"></div>
          <img src={employee.photoUrl} alt={employee.name} className="w-32 h-32 rounded-full object-cover border-4 border-white absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-24" />
        </div>
        
        <div className="pt-20 pb-8 px-6 text-center">
          <h1 className="text-2xl font-bold text-brand-dark">{employee.name}</h1>
          <p className="text-gray-600">{employee.title}</p>
          
          <div className="mt-4 flex justify-center items-center space-x-2">
            <img src={employee.logoUrl} alt={`${employee.companyName} logo`} className="w-6 h-6 rounded-sm object-contain"/>
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

export default BusinessCardView;
