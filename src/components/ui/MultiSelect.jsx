import React, { useState, useRef, useEffect } from 'react';
import { FiChevronUp, FiChevronDown, FiCheck } from 'react-icons/fi';

const MultiSelect = ({
    options,
    selectedValues,
    onChange,
    placeholder = 'Seleccionar opciones...',
    emptyMessage = 'No hay opciones disponibles.',
    label = 'Opciones'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (id) => {
        onChange(
            selectedValues.includes(id)
                ? selectedValues.filter((v) => v !== id)
                : [...selectedValues, id]
        );
    };

    const handleSelectAll = () => {
        onChange(filteredOptions.map((option) => option.id));
    };

    const handleDeselectAll = () => {
        onChange([]);
    };

    const isAllSelected =
        filteredOptions.length > 0 &&
        filteredOptions.every((option) => selectedValues.includes(option.id));

    return (
        <div className="relative" ref={containerRef}>
            {/* Encabezado del selector */}
            <div
                className="border rounded-md p-2 min-h-[42px] cursor-pointer bg-white flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-gray-800">
                    {selectedValues.length > 0 ? (
                        <>
                            {label}{" "}
                            <span className="font-semibold">
                                ({selectedValues.length} seleccionadas)
                            </span>
                        </>
                    ) : (
                        placeholder
                    )}
                </div>

                {isOpen ? (
                    <FiChevronUp size={20} className="text-gray-500" />
                ) : (
                    <FiChevronDown size={20} className="text-gray-500" />
                )}
            </div>

            {/* Dropdown con opciones */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {/* Barra de búsqueda */}
                    <div className="p-2 border-b sticky top-0 bg-white">
                        <input
                            type="text"
                            className="w-full px-2 py-1 border rounded-md"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Opciones o mensaje vacío */}
                    {filteredOptions.length === 0 ? (
                        <div className="text-gray-500 text-center py-2 italic">
                            {emptyMessage}
                        </div>
                    ) : (
                        <>
                            {/* Seleccionar/Deseleccionar todo */}
                            <div
                                className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 cursor-pointer border-b"
                                onClick={() =>
                                    isAllSelected ? handleDeselectAll() : handleSelectAll()
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border rounded flex items-center justify-center">
                                        {isAllSelected && (
                                            <FiCheck size={12} className="text-blue-600" />
                                        )}
                                    </div>
                                    <span className="font-medium">Seleccionar todo</span>
                                </div>
                            </div>

                            {/* Lista de opciones filtradas */}
                            <div className="p-2">
                                {filteredOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => toggleOption(option.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border rounded flex items-center justify-center">
                                                {selectedValues.includes(option.id) && (
                                                    <FiCheck size={12} className="text-blue-600" />
                                                )}
                                            </div>
                                            <span>{option.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
