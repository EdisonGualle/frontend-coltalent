import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';

const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="flex items-center">
      <label htmlFor="global-search" className="mr-2 font-semibold text-gray-700">
        Buscar:
      </label>
      <input
        id="global-search"
        type="text"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} registros...`}
        className=" text-sm px-2 py-1 border border-gray-300 mt-1 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
      />
    </div>
  );
};

export default GlobalFilter;