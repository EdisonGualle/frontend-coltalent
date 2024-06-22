import React from 'react';

const SkeletonTable = ({ columns = [] }) => {
  return (
    <div className="flex-1 shadow-md rounded-lg bg-gray-50 relative px-3 pb-3 animate-pulse">
      <div className="flex justify-between items-center py-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6 text-left relative">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </th>
              {columns.map((column, index) => (
                <th key={index} className="py-4 px-6 text-left">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="bg-white">
                <td className="py-4 px-6">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </td>
                {columns.map((column, index) => (
                  <td key={index} className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonTable;
