import React from "react";
import { AiOutlineEye } from "react-icons/ai";

const renderHistoryActions = ({ row, handleViewDetails }) => {
    return (
        <button
            onClick={() => handleViewDetails(row)}
            className="flex items-center justify-center w-6 h-6 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Ver detalles"
        >
            <AiOutlineEye className="text-gray-600 text-lg" />
        </button>
    );
};

export default renderHistoryActions;
