import React from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { RiMore2Fill, RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri";

const renderAssignmentActions = ({ row, onEdit, onDelete, }) => {
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
          document.activeElement.blur();
        }
      }}
    >
      <MenuItem className="p-0 hover:bg-transparent">
        <button
          onClick={() => onEdit(row)}
          className="w-full rounded-lg transition-colors text-xs hover:bg-gray-50 flex items-center gap-2 p-2"
        >
          <RiEdit2Line className="text-green-600" />
          <span>Editar</span>
        </button>
      </MenuItem>
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
