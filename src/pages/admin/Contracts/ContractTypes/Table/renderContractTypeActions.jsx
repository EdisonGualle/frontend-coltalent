import React from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { RiMore2Fill, RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { AiOutlineDelete, AiOutlineCheck, AiOutlineEdit } from "react-icons/ai";

const renderContractTypeActions = ({ row, onEdit, onToggleStatus }) => {
    const isActive = row.status === "Activo";
    return (
        <Menu
            menuButton={
                <MenuButton
                    className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-lg transition-colors "
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    <RiMore2Fill className="text-gray-600 " />
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
                    onClick={() => onEdit(row)}
                    className="w-full rounded-lg transition-colors text-xs hover:bg-gray-50 flex items-center gap-2 p-2"
                >
                    <RiEdit2Line className="text-blue-500" />
                    <span>Editar</span>
                </button>
            </MenuItem>

            <MenuItem className="p-0 hover:bg-transparent">
                <button
                    onClick={() => onToggleStatus(row)}
                    className="w-full rounded-lg transition-colors text-xs hover:bg-gray-50 flex items-center gap-2 p-2"
                >
                    {isActive ? (
                        <>
                            <AiOutlineDelete className="text-yellow-500" />
                            <span>Desactivar</span>
                        </>
                    ) : (
                        <>
                            <AiOutlineCheck className="text-green-500" />
                            <span>Activar</span>
                        </>
                    )}
                </button>
            </MenuItem>
        </Menu>
    );
};

export default renderContractTypeActions;