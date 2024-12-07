import React, { useState, useEffect, useRef } from "react";

// Utilidad para obtener valores anidados
const getNestedValue = (obj, path) => {
  if (typeof path !== "string") {
    return undefined; // Evitar el error si no es una cadena
  }
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};


const Filters = ({ filtersConfig, filterColumns, data, onFilter, onClose }) => {
  const [filterValues, setFilterValues] = useState({});
  const filtersRef = useRef(null);
  const [dynamicFilters, setDynamicFilters] = useState([]);

  // Generación de filtros dinámicos
  useEffect(() => {
    if (!filtersConfig && filterColumns && data.length) {

      const generatedFilters = filterColumns.map((col) => {
        const column = typeof col === "string" ? col : col.column;
        const label = typeof col === "object" && col.label ? col.label : column;

        if (!column) {
          return null;
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
      }).filter(Boolean); 


      setDynamicFilters(generatedFilters);
    }
  }, [filtersConfig, filterColumns, data]);


  const activeFilters = filtersConfig && filtersConfig.length > 0 ? filtersConfig : dynamicFilters;


  const handleFilterChange = () => {
    const filteredData = data.filter((row) =>
      activeFilters.every((filter) =>
        filterValues[filter.column]
          ? getNestedValue(row, filter.column) === filterValues[filter.column]
          : true
      )
    );
    onFilter(filteredData);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    onFilter(data);
  };

  const handleClickOutside = (event) => {
    if (filtersRef.current && !filtersRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={filtersRef}
      className="absolute bg-white shadow-lg rounded-lg p-4 z-50"
      style={{ top: "5px", left: "-110px" }}
    >
      <div className="space-y-3">
        {activeFilters.map((filter) => (
          <div key={filter.column}>
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <select
              value={filterValues[filter.column] || ""}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  [filter.column]: e.target.value,
                })
              }
              className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Todos</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div className="flex space-x-2">
          <button
            onClick={handleFilterChange}
            className="flex-1 px-2 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Aplicar
          </button>
          <button
            onClick={handleResetFilters}
            className="flex-1 px-2 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Restablecer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
