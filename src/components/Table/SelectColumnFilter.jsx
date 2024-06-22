import React, { useMemo } from 'react';

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id, Header },
}) => {
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      const value = row.values[id];
      if (value !== undefined) {
        options.add(value);
      }
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <label className="flex items-center space-x-2">
      <span className=" font-semibold text-gray-700">{Header}:</span>
      <div className="relative">
        <select
          className="text-sm appearance-none block w-full bg-white border border-gray-400 rounded-md py-1 mt-1 pl-3 pr-3 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
          name={id}
          id={id}
          value={filterValue}
          onChange={(e) => {
            setFilter(e.target.value || undefined);
          }}
        >
          <option value="" className='text-sm'>Todo</option>
          {options.map((option, i) => (
            <option key={i} value={option} className='text-sm'>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </label>
  );
};