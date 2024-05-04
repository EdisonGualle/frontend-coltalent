import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { Link } from 'react-router-dom';
import {
  RiMore2Fill,
  RiUserLine,
  RiEdit2Line,
  RiDeleteBin6Line,
  RiKeyLine,
} from 'react-icons/ri';
import Dialog2 from '../../../../../components/ui/Dialog2';

const OptionsColumn = ({ employeeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState('');

  const handleConfirm = () => {
    console.log(`Confirmar eliminar para el empleado con ID: ${employeeId}`);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleActionClick = (actionType) => {
    setIsOpen(true);
    setAction(actionType);
  };

  return (
    <>
      <Menu
        menuButton={
          <MenuButton className="flex items-center justify-center w-8 h-8 hover:bg-gray-300 rounded-lg transition-colors">
            <RiMore2Fill className="text-gray-400" />
          </MenuButton>
        }
        align="end"
        arrow
        arrowClassName="bg-gray-300"
        transition
        menuClassName="bg-gray-300 p-1 rounded-lg shadow-lg"
      >
        <div className="overflow-y-auto h-[13vh]">
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to="/employee/profile"
              className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2"
            >
              <RiUserLine className="text-gray-900" />
              <span className="truncate">Perfil</span>
            </Link>
          </MenuItem>
          <MenuItem className="p-0 hover:bg-transparent">
            <button className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <RiEdit2Line className="text-green-500" />
              <span className="truncate">Editar</span>
            </button>
          </MenuItem>
          <MenuItem
            className="p-0 hover:bg-transparent"
            onClick={() => handleActionClick('eliminar')}
          >
            <button className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <RiDeleteBin6Line className="text-red-500" />
              <span className="truncate">Eliminar</span>
            </button>
          </MenuItem>
          <MenuItem className="p-0 hover:bg-transparent">
            <button className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <RiKeyLine className="text-blue-500" />
              <span className="truncate">Permisos</span>
            </button>
          </MenuItem>
        </div>
      </Menu>
      <Dialog2
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="¿Eliminar cuenta?"
        description="Está seguro que desea eliminar la cuenta del empleado? Esta acción es permanente y no se podrá deshacer. Todos los datos del empleado se eliminarán."
        confirmButtonText="Sí, eliminar cuenta"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmButtonColor="bg-red-500"
        cancelButtonColor="border-gray-400"
        icon={
          <RiDeleteBin6Line className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />
        }
      />
    </>
  );
};

export default OptionsColumn;