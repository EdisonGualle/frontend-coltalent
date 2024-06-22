import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaEllipsisV } from 'react-icons/fa';
import { HiOutlinePlus, HiOutlineDocumentReport } from 'react-icons/hi';

const DynamicTable = ({ title, columns, data, onAddNew, onGenerateReport, onEdit, onDelete }) => {
  const [selectedRows, setSelectedRows] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  };

  const selectedCount = Object.keys(selectedRows).length;
  const allSelected = selectedCount === data.length;
  const noneSelected = selectedCount === 0;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className=" flex-1 shadow-md rounded-lg bg-gray-50 relative px-3 pb-3">
      <div className="flex justify-between items-center py-4">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 text-sm">{data.length} registro(s)</span>
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg transition-colors hover:bg-indigo-200"
              onClick={onGenerateReport}
            >
              <HiOutlineDocumentReport />
            </button>
            <button
              className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-lg transition-colors hover:bg-orange-200"
              onClick={onAddNew}
            >
              <HiOutlinePlus />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-auto custom-scrollbar">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
              <th className="py-4 px-6 text-left relative" style={{ minHeight: '50px' }}>
                <button
                  ref={buttonRef}
                  className={`focus:outline-none ${someSelected || allSelected ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}
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
              {columns.map((column) => (
                <th key={column.id} className="py-4 px-6 text-left text-xs" style={{ minHeight: '50px' }}>
                  {column.label}
                </th>
              ))}
              <th className="py-4 px-4 text-left text-xs sticky right-0 bg-gray-100 z-10" style={{ minHeight: '50px', width: '80px' }}>
                {/* Acciones */}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-xs bg-white">
            {data.map((row) => (
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
                {columns.map((column) => (
                  <td key={column.id} className="py-4 px-6 text-left text-xs group-hover:bg-gray-100" style={{ minHeight: '50px' }}>
                    {getNestedValue(row, column.id)}
                  </td>
                ))}
                <td className="py-4 px-4 text-center text-xs sticky right-0 bg-white z-10 group-hover:bg-gray-100" style={{ minHeight: '50px', width: '80px' }}>
                  <button
                    className="text-gray-500 hover:text-blue-500"
                    onClick={() => onEdit(row.id)}
                  >
                    <FaPencilAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;
