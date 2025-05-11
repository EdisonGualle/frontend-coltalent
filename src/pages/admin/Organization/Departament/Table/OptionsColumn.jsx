import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { RiMore2Fill } from "react-icons/ri";
import { AiOutlineDelete, AiOutlineCheck, AiOutlineEdit } from "react-icons/ai";

import { RiEdit2Line, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import { updateOneDepartment, toggleOneDepartmentStatus } from '../../../../../redux/Organization/DepartamentSlice';
import Dialog2 from '../../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../../contexts/AlertContext';
import { unwrapResult } from '@reduxjs/toolkit';
import DepartmentForm from '../DepartmentForm';
import ModalForm from '../../../../../components/ui/ModalForm';
import { fetchUnits } from '../../../../../redux/Organization/UnitSlince';
import {fetchPositions} from '../../../../../redux/Organization/PositionSlice';
const OptionsColumn = ({ departament }) => {
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  const [isOpenToggleDialog, setIsOpenToggleDialog] = useState(false);
  const [isToggleStatus, setIsToggleStatus] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState(departament.status);

  //Efecto para limpiar los errores del formulario al cerrar el modal
  useEffect(() => {
    if (!isOpenEditModal) {
      setFormErrors({});
    }
  }, [isOpenEditModal]);


  //Efecto para mostrar los errores del formulario al abrir el modal
  useEffect(() => {
    if (isOpenEditModal && Object.values(formErrors).some(Boolean)) {
      setIsOpenEditModal(true);
    }
  }, [formErrors, isOpenEditModal]);

  // Función para actualizar un departamento
  const handleUpdate = async (formData) => {
    try {
      // Obtener los datos del formulario
      const { name, function: functionDescription, head_employee_id: headEmployeeId } = formData;

      // Crear el objeto con los datos actualizados
      const data = {
        name,
        function: functionDescription,
        head_employee_id: headEmployeeId,
      };

      // Crear el objeto con los datos actualizados a enivar a la API
      const updatedData = {
        id: departament.id,
        data,
      };

      // Despachar la acción para actualizar el departamento
      const actionResult = await dispatch(updateOneDepartment(updatedData));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      dispatch(fetchUnits());
      dispatch(fetchPositions());
      showAlert('Dirección actualizada correctamente', 'success');
      setFormErrors({});
      setIsOpenEditModal(false);
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};
      const formErrors = {
        name: errors.name ? errors.name[0] : '',
        function: errors.function ? errors.function[0] : '',
        head_employee_id: errors.head_employee_id ? errors.head_employee_id[0] : '',
      };
      // Mostrar alerta si hay errores
      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        showAlert('Error al actualizar la dirección.', 'error');
        setIsOpenEditModal(false);
      }
    }
  };

  // Función para activar/desactivar un departamento
  const handleToggleStatus = async () => {
    setIsToggleStatus(true);
    try {
      // Despachar la acción para activar/desactivar el departamento
      await dispatch(toggleOneDepartmentStatus(departament.id)).then(unwrapResult);
      // Desempaquetar el resultado de la acción
      showAlert('Estado de la dirección actualizado correctamente', 'success');
    } catch (error) {
      showAlert('Error al actualizar el estado de la dirección.', 'error');
    } finally {
      setIsToggleStatus(false);
    }
  };

  // Funciones para manejar la apertura y cierre del modal y  actualizar el departamento
  const handleEditClick = () => setIsOpenEditModal(true);
  const handleConfirmEdit = async (formData) => await handleUpdate(formData);
  const handleCancelEdit = () => {
    setFormErrors({});
    setIsOpenEditModal(false);
  };


  // Funciones para manejar la apertura y cierre del diálogo de activación/desactivación
  const handleOpenToggleDialog = () => {
    setVisibleStatus(departament.status);
    setIsOpenToggleDialog(true);
  };

  const handleConfirmToggle = async () => {
    await handleToggleStatus();
    setIsOpenToggleDialog(false);
  };
  const handleCancelToggle = () => setIsOpenToggleDialog(false);


  // Función para personalizar el mensaje de confirmación
  const getToggleMessage = (status) => {
    if (status === 'Activo') {
      return {
        title: '¿Desactivar dirección?',
        description: 'Desactivar esta dirección puede afectar a los empleados y procesos asociados. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, desactivar dirección',
        confirmButtonColor: 'bg-yellow-500',
        icon: <RiCloseCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />
      };
    } else {
      return {
        title: '¿Activar dirección?',
        description: 'Activar esta dirección permitirá que los empleados y procesos asociados puedan utilizarla nuevamente. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, activar dirección',
        confirmButtonColor: 'bg-green-500',
        icon: <RiCheckboxCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />
      };
    }
  };

  const toggleMessage = getToggleMessage(visibleStatus);

  return (
    <>
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
      >
        <MenuItem className="p-0 hover:bg-transparent">
          <button
            onClick={() => handleEditClick()}
            className="w-full rounded-lg transition-colors text-xs hover:bg-gray-50 flex items-center gap-2 p-2"
          >
            <AiOutlineEdit className="text-blue-500 text-sm" />
            <span className="text-gray-800">Editar</span>
          </button>
        </MenuItem>
        <MenuItem className="p-0 hover:bg-transparent">
          <button
            onClick={() => handleOpenToggleDialog()}
            className="w-full rounded-lg transition-colors text-xs hover:bg-gray-50 flex items-center gap-2 p-2"
          >
            {departament.status === "Inactivo" ? (
              <>
                <AiOutlineCheck className="text-green-500 text-sm" />
                <span className="text-gray-800">Activar</span>
              </>
            ) : (
              <>
                <AiOutlineDelete className="text-yellow-500 text-sm" />
                <span className="text-gray-800">Desactivar</span>
              </>
            )}
          </button>
        </MenuItem>
      </Menu>

      <Dialog2
        isOpen={isOpenToggleDialog}
        setIsOpen={setIsOpenToggleDialog}
        title={toggleMessage.title}
        description={toggleMessage.description}
        confirmButtonText={toggleMessage.confirmButtonText}
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmToggle}
        onCancel={handleCancelToggle}
        confirmButtonColor={toggleMessage.confirmButtonColor}
        cancelButtonColor="border-gray-400"
        icon={toggleMessage.icon}
        isLoading={isToggleStatus}
      />

      {/* Modal del formulario */}
      <ModalForm
        isOpen={isOpenEditModal}
        setIsOpen={setIsOpenEditModal}
        title="Editar dirección"
        icon={<RiEdit2Line className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
      >
        <DepartmentForm
          isEditing={true}
          onSubmit={handleConfirmEdit}
          onCancel={handleCancelEdit}
          department={departament}
          formErrors={formErrors}
        />
      </ModalForm>
    </>
  );
};

export default OptionsColumn;
