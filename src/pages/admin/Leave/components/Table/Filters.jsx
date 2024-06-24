// src/components/Filters.jsx
import React, { useState, useEffect, useRef } from 'react';

const Filters = ({ filtersConfig, data, onFilter, onClose }) => {
  const [filterValues, setFilterValues] = useState({});
  const filtersRef = useRef(null);

  const handleFilterChange = () => {
    const filteredData = data.filter(row => {
      return filtersConfig.every(filter => {
        return filterValues[filter.column]
          ? row[filter.column] === filterValues[filter.column]
          : true;
      });
    });
    onFilter(filteredData);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    onFilter(data);
  };

  const handleClickOutside = (event) => {
    if (filtersRef.current && !filtersRef.current.contains(event.target)) {
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
    <div ref={filtersRef} className="absolute bg-white shadow-lg rounded-lg p-4 z-50 " style={{ top: '5px',left: '-110px' }}>
      <div className="space-y-3">
        {filtersConfig.map(filter => (
          <div key={filter.column}>
            <label className="block text-sm font-medium text-gray-700">{filter.label}</label>
            <select
              value={filterValues[filter.column] || ''}
              onChange={(e) => setFilterValues({ ...filterValues, [filter.column]: e.target.value })}
              className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All</option>
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="flex space-x-2">
          <button
            onClick={handleFilterChange}
            className="flex-1 px-2 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Aplicar
          </button>
          <button
            onClick={handleResetFilters}
            className="flex-1 px-2 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Restablecer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
