// src/components/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, rowsPerPage, totalRows, onPageChange, onRowsPerPageChange }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center space-x-2">
        <span>Rows per page:</span>
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
          Previous
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button
          className="px-2 py-1 border rounded-md"
          onClick={() => handleChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
