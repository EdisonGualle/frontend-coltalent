// src/components/ExportOptions.js
import React, { useState, useEffect, useRef } from 'react';

const ExportOptions = ({ onExport, onClose }) => {
  const [exportAll, setExportAll] = useState(true);
  const exportRef = useRef(null);

  const handleExport = () => {
    onExport(exportAll);
    onClose();
  };

  // Handle clicking outside the export options to close
  const handleClickOutside = (event) => {
    if (exportRef.current && !exportRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={exportRef} className="absolute bg-white shadow-lg rounded-lg p-4 z-50 mt-2" style={{ top: '32px', left: '-164px' }}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Opciones de Exportación</label>
          <div className="mt-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportAll}
                onChange={() => setExportAll(true)}
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-sm text-gray-700">Todas las Filas</span>
            </label>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={!exportAll}
                onChange={() => setExportAll(false)}
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-sm text-gray-700">Filas Visibles</span>
            </label>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="flex-1 px-2 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Exportar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-2 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
