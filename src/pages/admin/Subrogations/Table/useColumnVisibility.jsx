import { useState } from "react";

const useColumnVisibility = (initialColumns, allColumns, fixedColumns = []) => {
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const toggleColumnVisibility = (columnId) => {
    if (fixedColumns.some((col) => col.id === columnId)) {
      return; // Si la columna es fija, no se puede ocultar.
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
      fixedColumns.some((col) => col.id === columnId) ||
      visibleColumns.some((col) => col.id === columnId)
    );
  };

  const sortedVisibleColumns = [
    ...fixedColumns,
    ...visibleColumns.filter((col) => !fixedColumns.some((fixed) => fixed.id === col.id)),
  ].sort((a, b) => a.order - b.order); // Ordena por el índice de ordenación

  return { visibleColumns: sortedVisibleColumns, toggleColumnVisibility, isColumnVisible };
};

export default useColumnVisibility;
