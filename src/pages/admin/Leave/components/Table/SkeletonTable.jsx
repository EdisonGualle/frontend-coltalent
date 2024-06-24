import React from 'react';

const SkeletonTable = ({ 
  rows = 5, 
  columns,
  showFilters = true,
  showExport = true,
  showAddNew = true,
  showColumnOptions = true,
  actions = []
}) => {
  const columnCount = columns.length;
  const actionCount = actions.length;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 rounded-md p-3 animate-pulse">
              <div className="text-gray-400" > </div>
            </div>
            <div className="w-48 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-32 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-32 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            {showExport && (
              <div className="w-8 h-8 bg-green-200 rounded-md animate-pulse"></div>
            )}
            {showFilters && (
              <div className="w-8 h-8 bg-indigo-100 rounded-md animate-pulse"></div>
            )}
            {showColumnOptions && (
              <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            )}
            {showAddNew && (
              <div className="w-8 h-8 bg-orange-100 rounded-md animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full">
            <thead>
              <tr className=" bg-gray-50">
                <th className="w-12 px-6 py-4">
                  <div className="w-4 h-5 bg-gray-300 rounded animate-pulse"></div>
                </th>
                {columns.map((column, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                  </th>
                ))}
                <th className="w-24 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(rows)].map((_, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  {columns.map((_, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2 justify-end">
                      {[...Array(actionCount)].map((_, index) => (
                        <div key={index} className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-2 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-32 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-20 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonTable;