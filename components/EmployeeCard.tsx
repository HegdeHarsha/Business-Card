import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Employee } from '../types';
import { useEmployees } from '../contexts/EmployeeContext';
import { EditIcon, Trash2Icon, Share2Icon } from './icons';

interface EmployeeCardProps {
  employee: Employee;
  onCardClick: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onCardClick }) => {
  const { deleteEmployee, isSheetMode } = useEmployees();
  const [showCopied, setShowCopied] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the card for ${employee.name}?`)) {
      deleteEmployee(employee.id);
    }
  };

  const handleShare = () => {
    const shareLink = `${window.location.origin}${window.location.pathname}#/view/${employee.id}`;
    navigator.clipboard.writeText(shareLink);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
      <div className="p-5 cursor-pointer flex-grow" onClick={onCardClick}>
        <div className="flex items-center space-x-4">
          <img className="w-16 h-16 rounded-full object-cover" src={employee.photoUrl || 'https://picsum.photos/seed/placeholder/400'} alt={employee.name} />
          <div>
            <h3 className="text-xl font-bold text-brand-dark">{employee.name}</h3>
            <p className="text-gray-600">{employee.title}</p>
            <p className="text-sm text-gray-500">{employee.companyName}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleShare} className="relative p-2 text-gray-500 hover:text-green-600 transition-colors duration-200" title="Share Link">
          <Share2Icon className="w-5 h-5" />
           {showCopied && <span className="absolute -top-7 right-0 bg-black text-white text-xs rounded-md px-2 py-1">Copied!</span>}
        </button>
        {!isSheetMode && (
          <>
            <Link to={`/edit/${employee.id}`} className="p-2 text-gray-500 hover:text-yellow-600 transition-colors duration-200" title="Edit Card">
              <EditIcon className="w-5 h-5" />
            </Link>
            <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200" title="Delete Card">
              <Trash2Icon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
