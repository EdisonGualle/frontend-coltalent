import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import { MdSearch } from 'react-icons/md';

const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center justify-center max-w-md mx-auto h-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50 blur-lg group-hover:opacity-75 transition-all duration-300"></div>
            <div className="relative w-full bg-white bg-opacity-30 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-white border-opacity-50 group-hover:shadow-lg transition-all duration-300">
              <input
                type="text"
                placeholder={`${count} registros...`}
                value={value || ''}
                onChange={(e) => {
                  setValue(e.target.value);
                  onChange(e.target.value);
                }}
                className="w-full pl-4 pr-12 py-2 text-base text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 bg-opacity-50 rounded-md text-gray-600 overflow-hidden transition-all duration-300 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-gray-300">
                <MdSearch className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      </div>  
  );
};

export default GlobalFilter;
