import React from 'react';

const Pagination = ({ currentPage, rowsPerPage, totalRows, onPageChange, onRowsPerPageChange }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-between items-center p-2">
      <div className="flex items-center space-x-2">
        <span>Filas por página:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border rounded-md focus:outline-none focus:ring"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="px-2 py-1 border rounded-md"
          onClick={() => handleChangePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          {currentPage} de {totalPages}
        </span>
        <button
          className="px-2 py-1 border rounded-md"
          onClick={() => handleChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Pagination;
