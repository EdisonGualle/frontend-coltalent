import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { Link } from 'react-router-dom';
import {
  RiMore2Fill,
  RiUserLine,
  RiEdit2Line,
  RiUserUnfollowLine,
  RiDeleteBin6Line,
  RiCalendarCheckLine,
  RiKeyLine,
} from 'react-icons/ri';
import Dialog2 from '../../../../../components/common/Dialog';

const OptionsColumn = ({ employeeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState('');

  const handleConfirm = () => {
    console.log(`Confirmar ${action} para el empleado con ID: ${employeeId}`);
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
            onClick={() => handleActionClick('desactivar')}
          >
            <button className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <RiUserUnfollowLine className="text-yellow-500" />
              <span className="truncate">Desactivar</span>
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
              <RiCalendarCheckLine className="text-gray-500" />
              <span className="truncate">Asistencia</span>
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
        title={`¿${action === 'eliminar' ? 'Eliminar' : 'Desactivar'} cuenta?`}
        description={
          action === 'eliminar'
            ? 'Está seguro que desea eliminar la cuenta del empleado? Esta acción es permanente y no se podrá deshacer. Todos los datos del empleado se eliminarán.'
            : 'Está seguro que desea desactivar la cuenta del empleado? El empleado no podrá acceder al sistema hasta que se reactive su cuenta.'
        }
        confirmButtonText={`Si, ${action === 'eliminar' ? 'eliminar' : 'desactivar'} cuenta`}
        cancelButtonText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmButtonColor={action === 'eliminar' ? 'bg-red-500' : 'bg-yellow-500'}
        cancelButtonColor="border-gray-400"
        icon={
          action === 'eliminar' ? (
            <RiDeleteBin6Line className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />
          ) : (
            <RiUserUnfollowLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />
          )
        }
      />
    </>
  );
};

export default OptionsColumn;