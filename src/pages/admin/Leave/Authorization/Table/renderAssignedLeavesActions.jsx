import React from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { RiMore2Fill } from "react-icons/ri";
import { AiOutlineEye, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const renderAssignedLeavesActions = ({
    row,
    handleViewDetails,
    handleActionClick,
    currentFilter,
}) => {
    if (currentFilter !== "pendientes") {
        // Retorna solo el ícono "Ver más" si no es el filtro "pendientes"
        return (
            <button
                onClick={() => handleViewDetails(row)}
                className="flex items-center justify-center w-6 h-6 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Ver detalles"
            >
                <AiOutlineEye className="text-gray-600 text-lg" />
            </button>
        );
    }

    // Retorna el menú completo si es el filtro "pendientes"
    return (
        <Menu
            menuButton={
                <MenuButton
                    className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <RiMore2Fill className="text-gray-600" />
                </MenuButton>
            }
            align="end"
            arrow
            arrowClassName="bg-gray-200"
            transition
            menuClassName="bg-gray-200 p-1 rounded-lg shadow-sm"
            onMenuChange={(e) => {
                if (!e.open) {
                    setTimeout(() => {
                        const menuButton = document.querySelector('[aria-haspopup="true"]');
                        if (menuButton) {
                            menuButton.focus();
                        }
                    }, 0);
                }
            }}
        >
            <MenuItem className="p-0 hover:bg-transparent">
                <button
                    onClick={() => handleViewDetails(row)}
                    className="w-full rounded-lg transition-colors text-xs hover:bg-gray-50 flex items-center gap-2 p-2"
                >
                    <AiOutlineEye className="text-gray-700 text-sm" />
                    <span className="text-gray-800">Ver Detalles</span>
                </button>
            </MenuItem>
            <MenuItem className="p-0 hover:bg-transparent">
                <button
                    onClick={() => handleActionClick(row, "Aprobar")}
                    className="w-full rounded-lg transition-colors text-xs hover:bg-green-50 flex items-center gap-2 p-2"
                >
                    <AiOutlineCheck className="text-green-600 text-sm" />
                    <span className="text-gray-800">Aprobar</span>
                </button>
            </MenuItem>
            <MenuItem className="p-0 hover:bg-transparent">
                <button
                    onClick={() => handleActionClick(row, "Rechazar")}
                    className="w-full rounded-lg transition-colors text-xs hover:bg-red-50 flex items-center gap-2 p-2"
                >
                    <AiOutlineClose className="text-red-600 text-sm" />
                    <span className="text-gray-800">Rechazar</span>
                </button>
            </MenuItem>
        </Menu>
    );
};

export default renderAssignedLeavesActions;
