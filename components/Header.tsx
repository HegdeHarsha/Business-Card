
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-dark shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-brand-light">
            SELCO Business Card 
          </Link>
          <nav>
            <Link 
              to="/new" 
              className="bg-brand-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
            >
              Add Employee
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
