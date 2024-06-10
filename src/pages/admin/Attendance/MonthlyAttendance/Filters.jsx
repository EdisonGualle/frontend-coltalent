// src/components/Filters.js
import React, { useState, useEffect, useRef } from 'react';

const Filters = ({ columns, data, onFilter, onClose }) => {
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const filtersRef = useRef(null);

  const handleFilterChange = () => {
    const filteredData = data.filter(row => {
      return (
        (status ? row.status === status : true) &&
        (department ? row.department === department : true)
      );
    });
    onFilter(filteredData);
  };

  const handleResetFilters = () => {
    setStatus('');
    setDepartment('');
    onFilter(data);
  };

  // Handle clicking outside the filters to close
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleFilterChange}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Apply
          </button>
          <button
            onClick={handleResetFilters}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
