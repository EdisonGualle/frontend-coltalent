import React, { useState, useEffect } from 'react';
import { FaCog } from 'react-icons/fa';

const CardConfigurable = ({ config, onSave }) => {
  const [value, setValue] = useState(config.value);
  const [error, setError] = useState('');

  useEffect(() => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue <= 0) {
      setError('El valor debe ser un número mayor que 0.');
    } else {
      setError('');
    }
  }, [value]);

  const handleSave = () => {
    const numericValue = parseInt(value, 10);
    if (!error) {
      onSave(config.id, numericValue);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{config.key}</h3>
        <FaCog className="text-gray-500" />
      </div>
      <p className="text-gray-600 mb-4">{config.description}</p>
      <div className="mb-1">
        <input
          type="number"
          min="1"
          className={`p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-500`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex justify-end">
        <button
          className={`mt-4 px-4 py-2 rounded text-gray-600 font-semibold ${error ? 'bg-red-50 cursor-not-allowed text-red-400' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={handleSave}
          disabled={!!error}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default CardConfigurable;
