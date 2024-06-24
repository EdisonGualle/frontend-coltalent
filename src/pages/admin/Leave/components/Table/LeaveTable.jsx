import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { MdSearch, MdFilterList, MdOutlineFileDownload } from 'react-icons/md';
import { HiOutlinePlus } from 'react-icons/hi';
import Pagination from './Pagination';
import Filters from './Filters';
import ExportOptions from './ExportOptions';
import ColumnVisibilityOptions from './ColumnVisibilityOptions';
import useColumnVisibility from './useColumnVisibility';
import { AiOutlineControl } from "react-icons/ai";

const LeaveTable = ({
  allColumns,
  columns,
  data,
  actions = [],
  onAddNew = () => { },
  showFilters = true,
  showExport = true,
  showAddNew = true,
  showColumnOptions = true,
  showActions = true,
  onDelete,
  filtersConfig = {},
  getCellStyle = () => '',
  exportFunction = null
}) => {
  const { visibleColumns, toggleColumnVisibility, isColumnVisible } = useColumnVisibility(columns, allColumns);
  const [selectedRows, setSelectedRows] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [showFiltersState, setShowFiltersState] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showColumnOptionsState, setShowColumnOptionsState] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const exportButtonRef = useRef(null);
  const exportOptionsRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(data)) {
      setFilteredData(data);
    }
  }, [data]);

  const displayedData = Array.isArray(filteredData) ? filteredData.filter(row => {
    const matchesSearchTerm = visibleColumns.some(column =>
      row[column.id].toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFromDate = fromDate ? new Date(row.date) >= new Date(fromDate) : true;
    const matchesToDate = toDate ? new Date(row.date) <= new Date(toDate) : true;
    return matchesSearchTerm && matchesFromDate && matchesToDate;
  }) : [];

  const paginatedData = displayedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSelectAll = () => {
    const newSelectedRows = {};
    data.forEach(row => {
      newSelectedRows[row.id] = true;
    });
    setSelectedRows(newSelectedRows);
    setShowMenu(false);
  };

  const handleDeselectAll = () => {
    setSelectedRows({});
    setShowMenu(false);
  };

  const handleDeleteSelected = () => {
    const ids = Object.keys(selectedRows);
    onDelete(ids);
    setSelectedRows({}); // Limpia las filas seleccionadas después de eliminar
    setShowMenu(false);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
      setShowMenu(false);
    }
    if (exportOptionsRef.current && !exportOptionsRef.current.contains(event.target) && !exportButtonRef.current.contains(event.target)) {
      setShowExportOptions(false);
    }
  };

  const toggleRowSelection = (id) => {
    setSelectedRows(prevState => {
      const newState = { ...prevState, [id]: !prevState[id] };
      if (!newState[id]) {
        delete newState[id];
      }
      return newState;
    });
  };

  const handleExport = (exportAll) => {
    if (exportFunction) {
      const exportData = exportAll ? filteredData : displayedData;
      const exportColumns = exportAll ? allColumns : visibleColumns;
      exportFunction(exportData, exportColumns);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showMenu) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      menuRef.current.style.top = `${buttonRect.bottom}px`;
      menuRef.current.style.left = `${buttonRect.left}px`;
    }
  }, [showMenu]);

  const selectedCount = Object.keys(selectedRows).length;
  const allSelected = selectedCount === data.length;
  const noneSelected = selectedCount === 0;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="table-container">
      <div className="table-header sticky top-0 bg-white z-10 py-2">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center space-x-2">
            <MdSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 border rounded-md focus:outline-none focus:ring"
            />
            <input
              type="date"
              placeholder="Desde"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1 border rounded-md focus:outline-none focus:ring"
            />
            <input
              type="date"
              placeholder="Hasta"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2 py-1 border rounded-md focus:outline-none focus:ring"
            />
          </div>
          <div className="relative flex items-center">
            {showExport && exportFunction && (
              <button
                ref={exportButtonRef}
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="flex items-center justify-center w-8 h-8 bg-green-200 text-green-600 hover:bg-green-300 rounded-md"
                aria-label="Exportar a Excel"
                title='Exportar a Excel'
              >
                <MdOutlineFileDownload />
              </button>
            )}
            {showExportOptions && exportFunction && (
              <div ref={exportOptionsRef}>
                <ExportOptions
                  onExport={handleExport}
                  onClose={() => setShowExportOptions(false)}
                />
              </div>
            )}
            {showFilters && (
              <button
                className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg transition-colors hover:bg-gray-300 ml-2"
                title='Filtrar'
                onClick={() => setShowFiltersState(!showFiltersState)}
              >
                <MdFilterList />
              </button>
            )}
            {showFiltersState && (
              <div className="absolute top-full shadow-lg rounded-lg">
                <Filters
                  filtersConfig={filtersConfig}
                  data={data}
                  onFilter={setFilteredData}
                  onClose={() => setShowFiltersState(false)}
                />
              </div>
            )}
            {showColumnOptions && (
              <button
                className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-lg transition-colors hover:bg-gray-300 ml-2"
                title='Columnas'
                onClick={() => setShowColumnOptionsState(!showColumnOptionsState)}
              >
                <AiOutlineControl />
              </button>
            )}
            {showColumnOptionsState && (
              <div>
                <ColumnVisibilityOptions
                  allColumns={allColumns}
                  visibleColumns={visibleColumns}
                  toggleColumnVisibility={toggleColumnVisibility}
                  isColumnVisible={isColumnVisible}
                  onClose={() => setShowColumnOptionsState(false)}
                />
              </div>
            )}
            {showAddNew && (
              <button
                className="flex items-center ms-2 justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-lg transition-colors hover:bg-orange-200"
                title='Agregar'
                onClick={onAddNew}
              >
                <HiOutlinePlus />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="table-content overflow-y-auto custom-scrollbar">
        <table className="min-w-full leading-normal">
          <thead className="sticky top-0 bg-gray-100  z-0">
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
              {showActions && (
                <th className="py-4 px-6 text-left relative" style={{ minHeight: '50px' }}>
                  <button
                    ref={buttonRef}
                    className={`focus:outline-none ${someSelected || allSelected ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}
                    title='Acciones'
                    onClick={handleMenuToggle}
                  >
                    <FaEllipsisV />
                  </button>
                  {showMenu && (
                    <div
                      ref={menuRef}
                      className="fixed mt-2 py-2 w-40 bg-white rounded-lg shadow-xl text-xs z-50"
                    >
                      {allSelected ? (
                        <>
                          <button
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                            onClick={handleDeselectAll}
                          >
                            Desmarcar todos
                          </button>
                          <button
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                            onClick={handleDeleteSelected}
                          >
                            Eliminar seleccionados
                          </button>
                        </>
                      ) : someSelected ? (
                        <>
                          <button
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                            onClick={handleSelectAll}
                          >
                            Seleccionar todos
                          </button>
                          <button
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                            onClick={handleDeselectAll}
                          >
                            Desmarcar todos
                          </button>
                          <button
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                            onClick={handleDeleteSelected}
                          >
                            Eliminar seleccionados
                          </button>
                        </>
                      ) : (
                        <button
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                          onClick={handleSelectAll}
                        >
                          Seleccionar todos
                        </button>
                      )}
                    </div>
                  )}
                </th>
              )}
              {visibleColumns.map((column) => (
                <th key={column.id} className="py-4 px-6 text-left text-xs sticky top-0 bg-gray-100 z-10" style={{ minHeight: '50px' }}>
                  {column.label}
                </th>
              ))}
              {showActions && (
                <th className="py-4 px-6 text-left text-xs sticky top-0 right-0 bg-gray-100 z-10" style={{ minWidth: '50px' }}>
                  {/* Acciones */}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-xs bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-100 group"
                  style={{ minHeight: '50px' }}
                >
                  <td className="py-4 px-6 text-left whitespace-nowrap group-hover:bg-gray-100" style={{ minHeight: '50px' }}>
                    <input
                      type="checkbox"
                      checked={!!selectedRows[row.id]}
                      onChange={() => toggleRowSelection(row.id)}
                    />
                  </td>
                  {visibleColumns.map((column) => (
                    <td
                      key={column.id}
                      className="py-4 px-6 text-left text-xs group-hover:bg-gray-100"
                      style={{ minHeight: '50px' }}
                    >
                      <span className={`rounded-full px-2 py-1 inline-block ${getCellStyle(column.id, row[column.id])}`}>
                        {row[column.id]}
                      </span>
                    </td>
                  ))}
                  {showActions && (
                    <td className="py-4 px-4 text-center text-xs  bg-white z-10 group-hover:bg-gray-100" style={{ minWidth: '50px' }}>
                      {actions.map(action => (
                        <button
                          key={action.label}
                          className={`m-1 p-1 rounded ${action.className}`}
                          onClick={() => action.onClick(row)}
                          aria-label={action.label}
                          title={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length + (showActions ? 2 : 1)} className="py-4 px-6 text-center text-xs text-gray-500">
                  No hay coincidencias que mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <Pagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={displayedData.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
    </div>
  );
};

export default LeaveTable;
