import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmployeeProvider, useEmployees } from './contexts/EmployeeContext';
import Dashboard from './pages/Dashboard';
import CardForm from './pages/CardForm';
import BusinessCardView from './pages/BusinessCardView';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';

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
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { isSheetMode } = useEmployees();

  return (
    <>
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      <main className="p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={!isSheetMode ? <CardForm /> : <Navigate to="/" />} />
          <Route path="/edit/:id" element={!isSheetMode ? <CardForm /> : <Navigate to="/" />} />
        </Routes>
      </main>
      {isSettingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
};

export default App;
