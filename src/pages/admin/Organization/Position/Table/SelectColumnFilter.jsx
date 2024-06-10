import React, { useMemo } from 'react';

export const SelectColumnFilter = ({
  column: { filterValue = {}, setFilter, preFilteredRows, id, Header },
}) => {
  const options = useMemo(() => {
    const unitOptions = new Set();
    const directionOptions = new Set();

    preFilteredRows.forEach((row) => {
      const { unit, direction } = row.values[id];
      if (unit !== undefined) {
        unitOptions.add(unit);
      }
      if (direction !== undefined) {
        directionOptions.add(direction);
      }
    });

    return {
      unit: [...unitOptions.values()],
      direction: [...directionOptions.values()]
    };
  }, [id, preFilteredRows]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="flex items-center space-x-2">
        <span className="font-semibold text-gray-700">{Header} Unidad:</span>
        <div className="relative">
          <select
            className="text-sm appearance-none block w-full bg-white border border-gray-400 rounded-md py-1 mt-1 pl-3 pr-3 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
            value={filterValue.unit || ''}
            onChange={(e) => {
              setFilter({
                ...filterValue,
                unit: e.target.value || undefined
              });
            }}
          >
            <option value="">All</option>
            {options.unit.map((option, i) => (
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
      <label className="flex items-center space-x-2">
        <span className="font-semibold text-gray-700">{Header} Dirección:</span>
        <div className="relative">
          <select
            className="text-sm appearance-none block w-full bg-white border border-gray-400 rounded-md py-1 mt-1 pl-3 pr-3 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
            value={filterValue.direction || ''}
            onChange={(e) => {
              setFilter({
                ...filterValue,
                direction: e.target.value || undefined
              });
            }}
          >
            <option value="">All</option>
            {options.direction.map((option, i) => (
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
    </div>
  );
};
