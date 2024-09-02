import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteOneEmployee } from '../../../../../redux/Employee/employeSlice';
import Dialog2 from '../../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../../contexts/AlertContext';
import { unwrapResult } from '@reduxjs/toolkit';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { Link } from 'react-router-dom';
import {
  RiMore2Fill,
  RiUserLine,
  RiEdit2Line,
  RiDeleteBin6Line,
  RiKeyLine,
} from 'react-icons/ri';
import ModalForm from '../../../../../components/ui/ModalForm';
import EmployeeForm from '../../EmployeeForm';
import { updateOneEmployee } from '../../../../../redux/Employee/employeSlice';

const OptionsColumn = ({ employee, updateEmployees }) => {
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const [isOpenDialog2, setIsOpenDialog2] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});


  // Efecto para limpiar los errores del formulario al cerrar el modal
  useEffect(() => {
    if (!isOpenEditModal) {
      setFormErrors({});
    }
  }, [isOpenEditModal]);

  // Función para eliminar un empleado
  const handleDelete = async () => {
    try {
      // Despachar la acción para eliminar el empleado
      const actionResult = await dispatch(deleteOneEmployee(employee.id)).unwrap();
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      updateEmployees();
      showAlert('Empleado eliminado correctamente', 'success');
    } catch (error) {
      showAlert(error.msg || 'Error al eliminar el empleado', 'error');
    }
  };

  // Funciones para manejar la apertura y cierre del diálogo y empleado
  const handleCancel = () => setIsOpenDialog2(false);
  const handleClick = () => setIsOpenDialog2(true);
  const handleConfirm = async () => {
    await handleDelete();
    setIsOpenDialog2(false);
  };


  // Función para manejar la actualización de empleados
  const handleEditSubmit = async (submissionData) => {
    try {
      await dispatch(updateOneEmployee({ id: submissionData.id, submissionData })).unwrap();
      updateEmployees();
      showAlert('Empleado actualizado correctamente.', 'success');
      setIsOpenEditModal(false);
    } catch (error) {
      if (error.errors) {
        console.log("Error: ", error.errors);
        setFormErrors(error.errors);
        showAlert('Por favor corrija los errores en el formulario.', 'error');
      } else {
        showAlert('Ocurrió un error en el servidor. Inténtelo de nuevo más tarde.', 'error');
      }
    }
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
        <div className="scroll-editado overflow-y-auto h-[13vh]">
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to={`/perfil/${employee.id}/datos-personales`}
              className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2"
            >
              <RiUserLine className="text-gray-900" />
              <span className="truncate">Perfil</span>
            </Link>
          </MenuItem>
          <MenuItem className="p-0 hover:bg-transparent">
            <button
              className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2"
              onClick={() => setIsOpenEditModal(true)}
            >
              <RiEdit2Line className="text-green-500" />
              <span className="truncate">Editar</span>
            </button>
          </MenuItem>
          {/* <MenuItem className="p-0 hover:bg-transparent" onClick={handleClick}>
            <button className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <RiDeleteBin6Line className="text-red-500" />
              <span className="truncate">Eliminar</span>
            </button>
          </MenuItem> */}
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to={`/permisos/${employee.id}/solicitar`}
              className="w-full rounded-lg transition-colors text-xs hover:bg-teal-50 flex items-center gap-x-2 p-2">
              <RiKeyLine className="text-blue-500" />
              <span className="truncate">Permisos</span>
            </Link>
          </MenuItem>
        </div>
      </Menu>
      <Dialog2
        isOpen={isOpenDialog2}
        setIsOpen={setIsOpenDialog2}
        title="¿Eliminar Empleado?"
        description="Está seguro que desea eliminar la cuenta del empleado? Esta acción es permanente y no se podrá deshacer. Todos los datos del empleado se eliminarán."
        confirmButtonText="Sí, eliminar empleado"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmButtonColor="bg-red-500"
        cancelButtonColor="border-gray-400"
        icon={
          <RiDeleteBin6Line className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />
        }
      />
      <ModalForm
        isOpen={isOpenEditModal}
        maxWidth='max-w-4xl'
        setIsOpen={setIsOpenEditModal}
        title="Editar empleado"
        icon={<RiEdit2Line className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />} // Icono para el modal de edición
      >
        <EmployeeForm
          onSubmit={handleEditSubmit}
          onCancel={() => setIsOpenEditModal(false)}
          formErrors={formErrors}
          initialData={{ id: employee.id, ...employee }}
          isEditMode={true}

        />
      </ModalForm>
    </>
  );
};

export default OptionsColumn;
