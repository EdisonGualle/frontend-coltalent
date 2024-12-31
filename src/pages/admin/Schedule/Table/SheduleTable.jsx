import React, { useState, useRef, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { FaEllipsisV, FaEye, FaInfoCircle } from 'react-icons/fa';
import { MdSearch, MdFilterList, MdOutlineFileDownload } from 'react-icons/md';
import { HiOutlinePlus } from 'react-icons/hi';
import Pagination from '../../Subrogations/Table/Pagination';
import Filters from '../../Subrogations/Table/Filters';
import ExportOptions from '../../Subrogations/Table/ExportOptions';
import ColumnVisibilityOptions from '../../Subrogations/Table/ColumnVisibilityOptions';
import useColumnVisibility from '../../Subrogations/Table/useColumnVisibility';
import { AiOutlineControl } from "react-icons/ai";
import FlexibleModal from '../../Subrogations/Table/FlexibleModal';
import FileViewer from '../../Subrogations/Table/FileViewer';
import DateRangeFilter from '../../Subrogations/Table/DateRangeFilter';
// Utilidad para acceder a campos anidados
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const SheduleTable = ({
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
  showDateRangeFilter = false,
  onDelete,
  manualFiltersConfig = null,
  dynamicFilterColumns = [],
  getCellStyle = () => '',
  exportFunction = null,
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
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const exportButtonRef = useRef(null);
  const exportOptionsRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(data)) {
      setFilteredData(data);
    }
  }, [data]);

  const parseDate = (dateString) => {
    // Si el valor ya es una instancia de Date, devolverlo directamente
    if (dateString instanceof Date) {
      return dateString;
    }

    // Si no es un string, emitir advertencia y devolver null
    if (typeof dateString !== "string") {
      return null;
    }

    // Manejar formato "día/mes/año" (dd/MM/yyyy)
    const [day, month, year] = dateString.split("/");
    if (day && month && year) {
      return new Date(`${year}-${month}-${day}`);
    }
    return null;
  };

  const parseDateRange = (dateRangeString) => {
    if (typeof dateRangeString !== "string") {
      return { start: null, end: null };
    }

    // Separar las fechas por el guion
    const [start, end] = dateRangeString.split(" - ").map((date) => {
      const [day, month, year] = date.split("/");
      return new Date(`${year}-${month}-${day}`);
    });

    return { start: start || null, end: end || null };
  };

  const displayedData = Array.isArray(filteredData)
    ? filteredData.filter((row) => {
      const matchesSearchTerm = visibleColumns.some((column) => {
        let value;

        // Si la columna tiene una función de renderizado, úsala para obtener el texto limpio
        if (column.render) {
          value = column.render(row, true); // `true` genera texto plano para la búsqueda
        } else {
          value = getNestedValue(row, column.id);
        }

        return (
          value !== undefined &&
          value !== null &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      const matchesDateRange = visibleColumns.every((column) => {
        if (column.filterType === "dateRange") {
          // Filtro para columnas separadas
          const columnValue = getNestedValue(row, column.id);
          const columnDate = columnValue ? parseDate(columnValue) : null;

          return (
            (!fromDate || (columnDate && columnDate >= parseDate(fromDate))) &&
            (!toDate || (columnDate && columnDate <= parseDate(toDate)))
          );
        } else if (column.filterType === "combinedDateRange") {
          // Filtro para columna combinada
          const start = parseDate(row.original_leave?.start_date);
          const end = parseDate(row.original_leave?.end_date);

          // Nueva lógica para manejar casos donde solo hay una fecha seleccionada (fromDate === toDate)
          if (fromDate && toDate && parseDate(fromDate).getTime() === parseDate(toDate).getTime()) {
            const singleDate = parseDate(fromDate);
            return (
              (start && singleDate >= start && (!end || singleDate <= end)) || // Fecha está dentro del rango
              (start && singleDate === start) || // Coincide con fecha de inicio
              (end && singleDate === end) // Coincide con fecha de fin
            );
          }

          return (
            (!fromDate || (start && start >= parseDate(fromDate))) &&
            (!toDate || (end && end <= parseDate(toDate)))
          );
        }
        return true; // Si no es de tipo rango, no se filtra
      });

      return matchesSearchTerm && matchesDateRange;
    })
    : [];


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
    setSelectedRows({});
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

  const handleExport = (exportAll, exportFormat) => {
    if (exportFunction) {
      const exportData = exportAll ? data : displayedData;
      const exportColumns = exportAll
        ? [...allColumns, ...columns.filter(col => !allColumns.some(c => c.id === col.id))]
        : columns;

      // Llamar al método de exportación con el formato adecuado
      exportFunction(exportData, exportColumns, { format: exportFormat });
    }
  };

  const openModal = (data, config, title) => {
    setModalContent({ data, config, title });
    setIsModalOpen(true);
  };

  const activeFiltersConfig = [
    ...(manualFiltersConfig || []),
    ...(dynamicFilterColumns.length > 0
      ? dynamicFilterColumns.map((col) => {
        const column = typeof col === "string" ? col : col.column;
        const label = typeof col === "object" && col.label ? col.label : column;

        if (!column) {
          console.error("Se detectó una columna inválida:", col);
          return null; // Ignorar columnas inválidas
        }

        const uniqueValues = [
          ...new Set(data.map((row) => getNestedValue(row, column))),
        ];

        return {
          column,
          label,
          options: uniqueValues.map((value) => ({
            value,
            label: value || "N/A",
          })),
        };
      }).filter(Boolean) // Filtrar nulos para evitar problemas
      : []),
  ];



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

  const formatCellContent = (content) => {
    if (typeof content === 'string' && content.includes('\n')) {
      return content.split('\n').map((item, key) => (
        <React.Fragment key={key}>
          {item}
          <br />
        </React.Fragment>
      ));
    }
    return content;
  };

  const formatCombinedEvaluators = (row, fields) => {
    return fields.map(field => getNestedValue(row, field)).filter(Boolean).join('\n');
  };


  const isExpanded = actions.length > 2;

  return (
    <div className="table-container bg-white shadow-sm mb-4 rounded-se-lg rounded-b-lg py-2">
      <div className="mb-2 pt-1">
        <div className="flex justify-between items-center py-2 px-2">
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center justify-center max-w-md mx-auto h-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50 blur-lg group-hover:opacity-75 transition-all duration-300"></div>
              <div className="relative w-full bg-white bg-opacity-30 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-white border-opacity-50 group-hover:shadow-lg transition-all duration-300">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 text-base text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2  bg-gray-200 bg-opacity-50 rounded-md text-gray-600 overflow-hidden transition-all duration-300 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <MdSearch className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
                </button>
              </div>
            </div>

            {showDateRangeFilter && (
              <DateRangeFilter
                onDateRangeChange={(range) => {
                  setFromDate(range[0]);
                  setToDate(range[1]);
                }}
              />
            )}
          </div>
          <div className="relative flex items-center">
            {/* Exportar */}
            {showExport && exportFunction && (
              <>
                <button
                  ref={exportButtonRef}
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="flex items-center justify-center w-8 h-8 bg-green-200 text-green-600 hover:bg-green-300 rounded-md"
                  aria-label="Exportar a Excel"
                  title="Exportar a Excel"
                >
                  <MdOutlineFileDownload />
                </button>

                {showExportOptions && (
                  <ExportOptions
                    onExport={(exportAll, exportFormat) => {
                      // Define los datos y columnas a exportar según la opción seleccionada
                      const exportData = exportAll ? data : displayedData;
                      const exportColumns = exportAll ? allColumns : visibleColumns;
                      exportFunction(exportData, exportColumns, exportFormat);
                    }}
                    onClose={() => setShowExportOptions(false)}
                  />
                )}
              </>
            )}

            {/* Filtrar */}
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
                  filtersConfig={activeFiltersConfig}
                  filterColumns={dynamicFilterColumns}
                  data={data}
                  onFilter={setFilteredData}
                  onClose={() => setShowFiltersState(false)}
                />
              </div>
            )}

            {/* Columnas */}
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

            {/* Agregar */}
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
      <div className="table-content custom-scrollbar">
        <table className="min-w-full leading-normal">
          <thead className="sticky top-0 bg-gray-100  z-0">
            <tr className=" text-gray-600 uppercase text-xs leading-normal">
              {showActions && onDelete && (
                <th className="py-4 px-6 text-left relative" style={{ minHeight: '50px' }}>
                  <button
                    ref={buttonRef}
                    className={`focus:outline-none ${someSelected || allSelected ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
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
                <th key={column.id} className="py-4 px-6 text-left text-xs sticky top-0  z-10" style={{ minHeight: '50px' }}>
                  {column.label}
                </th>
              ))}
              {showActions && (
                <th
                  className="py-4 px-6 text-center text-xs  z-10"
                  style={{ minWidth: '100px', maxWidth: '150px', width: 'auto' }}
                >
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className=" hover:bg-gray-100 group  transition duration-200 ease-in-out"
                  style={{ minHeight: '50px' }}
                >
                  {onDelete && (
                    <td className="py-3 px-6 text-left whitespace-nowrap group-hover:bg-gray-100  transition duration-200 ease-in-out" style={{ minHeight: '50px' }}>
                      <input
                        type="checkbox"
                        checked={!!selectedRows[row.id]}
                        onChange={() => toggleRowSelection(row.id)}
                      />
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td
                      key={column.id}
                      className={`py-3 px-6 text-left text-sm group-hover:bg-gray-100  transition duration-200 ease-in-out ${column.autoWidth ? 'whitespace-nowrap auto-width' : ''}`}
                      style={{ minHeight: '50px' }}
                    >
                      {column.render ? (
                        <span className={`rounded-full py-1 inline-block ${getCellStyle(column.id, getNestedValue(row, column.id) || '')}`}>
                          {column.render(row)}
                        </span>
                      )
                        : column.showIcon ? (
                          column.id === 'attachment' ? (
                            <div className="flex justify-center items-center h-full">
                              <FileViewer filename={getNestedValue(row, column.id)} />
                            </div>
                          ) : (
                            <div className='flex items-center justify-start'>
                              <button
                                className="flex ps-3 items-center justify-center text-sm text-gray-600 hover:text-gray-700"
                                onClick={() => openModal(row, column.modalConfig, column.modalTitle)}
                              >
                                <FaInfoCircle className="mr-1" /> Detalles
                              </button>
                            </div>

                          )
                        ) : (
                          column.id === 'combined_evaluators' ? (
                            <span className="whitespace-pre-line">
                              {formatCombinedEvaluators(row, column.combineFields)}
                            </span>
                          ) : (
                            <span className={`rounded-lg  py-1 inline-block ${getCellStyle(column.id, getNestedValue(row, column.id) || '')}`}>
                              {(getNestedValue(row, column.id) !== undefined && getNestedValue(row, column.id) !== null) ? formatCellContent(getNestedValue(row, column.id)) : ''}
                            </span>
                          )
                        )}
                    </td>
                  ))}

                  {showActions && (
                    <td className=" flex py-3 px-4 text-center justify-center text-sm bg-white z-10 group-hover:bg-gray-100  transition duration-200 ease-in-out" style={{ minWidth: '50px', width: 'auto' }}>
                      {typeof actions === 'function' ? actions(row) : null}
                    </td>
                  )}

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length + (showActions && onDelete ? 2 : 1)} className="py-4 px-6 text-center text-sm text-gray-500">
                  No hay coincidencias que mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container px-2">
        <Pagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={displayedData.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
      {isModalOpen && (
        <FlexibleModal
          data={modalContent.data}
          config={modalContent.config}
          title={modalContent.title}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SheduleTable;
