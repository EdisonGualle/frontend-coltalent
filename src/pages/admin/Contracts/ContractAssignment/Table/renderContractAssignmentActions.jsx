import React from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { RiMore2Fill } from "react-icons/ri";
import { IoBan } from "react-icons/io5";
import { LuRefreshCw } from "react-icons/lu";

const renderContractAssignmentActions = ({ row, onRenew, onTerminate }) => {
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
            {isActive ? (
                <>
                    <MenuItem className="p-0 hover:bg-transparent">
                        <button
                            onClick={() => onRenew(row)}
                            className="w-full rounded-lg transition-colors text-xs hover:bg-gray-50 flex items-center gap-2 p-2"
                        >
                            <LuRefreshCw className="text-blue-500" />
                            <span>Renovar</span>
                        </button>
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                        <button
                            onClick={() => onTerminate(row)}
                            className="w-full rounded-lg transition-colors text-xs hover:bg-gray-50 flex items-center gap-2 p-2"
                        >
                            <IoBan className="text-red-500" />
                            <span>Terminar</span>
                        </button>
                    </MenuItem>
                </>

            ) : (
                <div className="text-gray-500 px-4 py-2 text-xs">
                    Sin acciones disponibles
                </div>
            )}
        </Menu>
    )
}

export default renderContractAssignmentActions