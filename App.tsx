
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { EmployeeProvider } from './contexts/EmployeeContext';
import Dashboard from './pages/Dashboard';
import CardForm from './pages/CardForm';
import BusinessCardView from './pages/BusinessCardView';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <EmployeeProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
          <Routes>
            <Route path="/view/:id" element={<BusinessCardView />} />
            <Route path="/*" element={<AdminLayout />} />
          </Routes>
        </div>
      </HashRouter>
    </EmployeeProvider>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<CardForm />} />
          <Route path="/edit/:id" element={<CardForm />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
