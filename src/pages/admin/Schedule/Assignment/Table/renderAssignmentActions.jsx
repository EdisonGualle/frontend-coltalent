import React from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { RiMore2Fill, RiDeleteBin6Line } from "react-icons/ri";

const renderAssignmentActions = ({ row, onDelete, }) => {
  return (
    <Menu
      menuButton={
        <MenuButton
          className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-lg transition-colors"
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
          onClick={() => onDelete(row)}
          className="w-full rounded-lg transition-colors text-xs hover:bg-gray-50 flex items-center gap-2 p-2"
        >
          <RiDeleteBin6Line className="text-red-600" />
          <span>Eliminar</span>
        </button>
      </MenuItem>
    </Menu>
  );
};

export default renderAssignmentActions;
