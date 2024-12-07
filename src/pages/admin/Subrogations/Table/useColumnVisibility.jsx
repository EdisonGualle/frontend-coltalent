import { useState } from "react";

const useColumnVisibility = (initialColumns, allColumns, fixedColumns = []) => {
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const toggleColumnVisibility = (columnId) => {
    if (fixedColumns.some((col) => col.id === columnId)) {
      // Si la columna es fija, no permitimos cambios
      return;
    }

    setVisibleColumns((prevColumns) => {
      if (prevColumns.some((col) => col.id === columnId)) {
        return prevColumns.filter((col) => col.id !== columnId); // Oculta la columna
      } else {
        const column = allColumns.find((col) => col.id === columnId);
        return [...prevColumns, column]; // Muestra la columna
      }
    });
  };

  const isColumnVisible = (columnId) => {
    return (
      fixedColumns.some((col) => col.id === columnId) || // Siempre visibles
      visibleColumns.some((col) => col.id === columnId) // Dinámicamente visibles
    );
  };

  return { visibleColumns, toggleColumnVisibility, isColumnVisible };
};

export default useColumnVisibility;
