import React, { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const ResponsibilitiesModal = ({ responsibilities = [], onSave, onClose }) => {
    const [newResponsibility, setNewResponsibility] = useState("");
    const [responsibilitiesList, setResponsibilitiesList] = useState([]);

    useEffect(() => {
        // Asegurar que todos los elementos sean cadenas
        setResponsibilitiesList(responsibilities.map(resp => (typeof resp === "string" ? resp : resp.name)) || []);
    }, [responsibilities]);

    const handleAddResponsibility = () => {
        if (newResponsibility.trim()) {
            setResponsibilitiesList([newResponsibility.trim(), ...responsibilitiesList]);
            setNewResponsibility("");
        }
    };

    const handleDeleteResponsibility = (index) => {
        const updatedList = responsibilitiesList.filter((_, i) => i !== index);
        setResponsibilitiesList(updatedList);
    };

    const handleSave = () => {
        // Pasar las responsabilidades como un array de cadenas
        onSave(responsibilitiesList);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddResponsibility();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 bg-opacity-50">
            <div
                className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-6 text-center text-gray-800">Gestionar responsabilidades</h2>

                <div className="flex items-center gap-3 mb-6">
                    <input
                        type="text"
                        className="border text-sm border-gray-300 rounded-lg p-3 flex-grow focus:ring-2 focus:ring-green-300"
                        placeholder="Nueva responsabilidad"
                        value={newResponsibility}
                        onChange={(e) => setNewResponsibility(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors flex-shrink-0"
                        onClick={handleAddResponsibility}
                    >
                        <FaPlus size={16} />
                    </button>
                </div>

                <ul className="max-h-40 overflow-y-auto border-t border-gray-200 pt-3 mb-3">
                    {responsibilitiesList.map((resp, index) => (
                        <li
                            key={index}
                            className="flex text-sm items-center gap-3 py-2 px-2 border-b border-gray-100 last:border-b-0"
                        >
                            <span className="flex-grow text-gray-700 break-words">{resp}</span>
                            <button
                                type="button"
                                className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors flex-shrink-0"
                                onClick={() => handleDeleteResponsibility(index)}
                            >
                                <FaTrashAlt size={14} />
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        onClick={handleSave}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResponsibilitiesModal;
