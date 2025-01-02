import React, { useState, useRef, useEffect } from "react";
import { RiArrowDownSLine, RiCloseLine, RiCheckLine, RiSearchLine } from "react-icons/ri";

const TaggableSelect = ({
  label,
  id,
  placeholder = "Seleccione una opción",
  options = [],
  value = [],
  onChange,
  error,
  enableSearch = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Actualizar las opciones filtradas si enableSearch es true
  useEffect(() => {
    if (enableSearch) {
      setFilteredOptions(
        options.filter((option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [searchQuery, options, enableSearch]);

  const handleToggleDropdown = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = 160;
      const viewportHeight = window.innerHeight;

      // Si no hay espacio suficiente debajo, abre hacia arriba
      setOpenUpward(containerRect.bottom + dropdownHeight > viewportHeight);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (selectedOption) => {
    if (value.some((item) => item.value === selectedOption.value)) {
      onChange(value.filter((item) => item.value !== selectedOption.value));
    } else {
      onChange([...value, selectedOption]);
    }
  };

  const handleRemoveTag = (tag) => {
    onChange(value.filter((item) => item.value !== tag.value));
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      containerRef.current &&
      !containerRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label htmlFor={id} className="block text-base font-semibold  text-gray-800 mb-1">
          {label}
        </label>
      )}
      <div
        className={`flex items-center flex-wrap gap-1 px-3 py-2 border-2 rounded-lg cursor-pointer bg-white ${error ? "border-red-300" : "border-gray-300 focus:border-blue-300"
          }`}
        onClick={handleToggleDropdown}
      >
        {value.length > 0 ? (
          value.map((tag) => (
            <span
              key={tag.value}
              className="flex items-center px-2 py-1 bg-gray-100 text-sm rounded-lg border border-gray-300"
            >
              {tag.label}
              <RiCloseLine
                className="ml-2 text-gray-600 cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(tag);
                }}
              />
            </span>
          ))
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <RiArrowDownSLine className="ml-auto text-gray-500" />
      </div>

      {/* Lista desplegable */}
      {isOpen && (
        <>
          {enableSearch && (
            <div className="flex items-center mt-1 px-3 py-2 border rounded-lg bg-white">
              <RiSearchLine className="text-gray-400 mr-2 " />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="flex-1 border-none outline-none text-sm"
              />
            </div>
          )}
          <ul
            ref={dropdownRef}
            className={`absolute left-0 w-full max-h-60 bg-white shadow-lg rounded-lg overflow-y-auto z-50 border ${openUpward ? "bottom-full mb-1" : "top-full mt-1"
              }`}
            style={{ maxHeight: "160px" }}
          >
            {enableSearch
              ? filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(option)}
                >
                  {option.icon && (
                    <img
                      src={option.icon}
                      alt={option.label}
                      className="w-6 h-6 rounded-full mr-3"
                    />
                  )}
                  <div className="flex-1">{option.label}</div>
                  {value.some((item) => item.value === option.value) && (
                    <RiCheckLine className="text-blue-600" />
                  )}
                </li>
              ))
              : options.map((option) => (
                <li
                  key={option.value}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(option)}
                >
                  {option.icon && (
                    <img
                      src={option.icon}
                      alt={option.label}
                      className="w-6 h-6 rounded-full mr-3"
                    />
                  )}
                  <div className="flex-1">{option.label}</div>
                  {value.some((item) => item.value === option.value) && (
                    <RiCheckLine className="text-blue-600" />
                  )}
                </li>
              ))}
            {enableSearch && searchQuery && filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-gray-500">No se encontraron resultados</li>
            )}
            {!enableSearch && options.length === 0 && (
              <li className="px-4 py-2 text-gray-500">Sin opciones disponibles</li>
            )}
          </ul>
        </>

      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TaggableSelect;
