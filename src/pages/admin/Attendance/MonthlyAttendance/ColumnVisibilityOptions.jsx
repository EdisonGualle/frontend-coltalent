import React, { useEffect, useRef } from 'react';

const ColumnVisibilityOptions = ({ allColumns, visibleColumns, toggleColumnVisibility, isColumnVisible, onClose }) => {
  const columnOptionsRef = useRef(null);

  const handleClickOutside = (event) => {
    if (columnOptionsRef.current && !columnOptionsRef.current.contains(event.target)) {
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
    <div ref={columnOptionsRef} className="absolute top-full left-0 z-50 mt-2 bg-white shadow-lg rounded-lg p-4" style={{ top: '30px',left: '-110px' }}>
      <h3 className="text-sm font-medium text-gray-700">Toggle Columns</h3>
      <div className="flex flex-wrap mt-2">
        {allColumns.map((column) => (
          <label key={column.id} className="flex items-center mr-4 mb-2">
            <input
              type="checkbox"
              checked={isColumnVisible(column.id)}
              onChange={() => toggleColumnVisibility(column.id)}
              className="mr-2"
            />
            <span className="text-xs text-gray-600">{column.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnVisibilityOptions;
