import React from 'react';
import { Link } from 'react-router-dom';
import { useEmployees } from '../contexts/EmployeeContext';
import { CogIcon } from './icons';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { isSheetMode } = useEmployees();

  return (
    <header className="bg-brand-dark shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-brand-light">
            SELCO Business Card 
          </Link>
          <nav className="flex items-center gap-4">
            {!isSheetMode && (
              <Link 
                to="/new" 
                className="bg-brand-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
              >
                Add Employee
              </Link>
            )}
            <button
              onClick={onSettingsClick}
              className="text-brand-light hover:text-brand-accent p-2 rounded-full transition-colors duration-200"
              title="Settings"
            >
              <CogIcon className="w-6 h-6" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
