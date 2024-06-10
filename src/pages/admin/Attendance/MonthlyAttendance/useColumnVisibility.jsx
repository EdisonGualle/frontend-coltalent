// useColumnVisibility.js
import { useState } from 'react';

const useColumnVisibility = (initialColumns, allColumns) => {
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const toggleColumnVisibility = (columnId) => {
    setVisibleColumns(prevColumns => {
      if (prevColumns.some(col => col.id === columnId)) {
        return prevColumns.filter(col => col.id !== columnId);
      } else {
        const column = allColumns.find(col => col.id === columnId);
        const updatedColumns = [...prevColumns, column];
        return allColumns.filter(col => updatedColumns.some(updatedCol => updatedCol.id === col.id));
      }
    });
  };

  const isColumnVisible = (columnId) => {
    return visibleColumns.some(col => col.id === columnId);
  };

  return { visibleColumns, toggleColumnVisibility, isColumnVisible };
};

export default useColumnVisibility;
