import React, { useState, useEffect } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import { XIcon } from './icons';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { sheetUrl, setSheetUrl, syncFromSheet } = useEmployees();
  const [currentUrl, setCurrentUrl] = useState(sheetUrl);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleSave = async () => {
    setSheetUrl(currentUrl);
    if (currentUrl) {
      await syncFromSheet();
    }
    handleClose();
  };
  
  const handleUseLocalStorage = () => {
    setCurrentUrl('');
    setSheetUrl('');
    handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const animationClasses = isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100';

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className={`w-full max-w-lg bg-white rounded-lg shadow-xl transform transition-all duration-300 ${animationClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 id="settings-title" className="text-2xl font-bold text-brand-dark">Data Source Settings</h2>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-200" aria-label="Close settings">
              <XIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <p className="mt-2 text-gray-600">
            You can power this application using your browser's local storage (default) or by connecting a live Google Sheet.
          </p>

          <div className="mt-6">
            <label htmlFor="sheet-url" className="block text-sm font-medium text-gray-700">
              Google Sheet Public CSV URL
            </label>
            <input
              type="url"
              id="sheet-url"
              name="sheet-url"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Paste your published sheet URL here..."
            />
            <p className="mt-2 text-xs text-gray-500">
              Go to File &gt; Share &gt; Publish to web, and publish as a CSV.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-primary text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save and Use Sheet
          </button>
          <button
            onClick={handleUseLocalStorage}
            className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Use Local Storage
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
