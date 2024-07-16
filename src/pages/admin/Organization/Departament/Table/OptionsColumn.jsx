import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RiEdit2Line, RiDeleteBin6Line, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import { deleteOneDepartment, updateOneDepartment, toggleOneDepartmentStatus } from '../../../../../redux/Organization/DepartamentSlice';
import Dialog2 from '../../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../../contexts/AlertContext';
import { unwrapResult } from '@reduxjs/toolkit';
import DepartmentForm from '../DepartmentForm';
import ModalForm from '../../../../../components/ui/ModalForm';
import { fetchUnits } from '../../../../../redux/Organization/UnitSlince';

const OptionsColumn = ({ departament, fetchDepartments }) => {
  const dispatch = useDispatch();
  const [isOpenDialog2, setIsOpenDialog2] = useState(false);
  const { showAlert } = useContext(AlertContext);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [isOpenToggleDialog, setIsOpenToggleDialog] = useState(false);
  const [toggleAction, setToggleAction] = useState(null);

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
      fetchDepartments();
      dispatch(fetchUnits());
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

  // Función para eliminar un departamento
  // const handleDelete = async () => {
  //   try {
  //     // Despachar la acción para eliminar el departamento
  //     const actionResult = await dispatch(deleteOneDepartment(departament.id));
  //     // Desempaquetar el resultado de la acción
  //     unwrapResult(actionResult);
  //     fetchDepartments();
  //     dispatch(fetchUnits());
  //     showAlert('Dirección eliminada correctamente', 'success');
  //   } catch (error) {
  //     showAlert('Error al eliminar la dirección.', 'error');
  //   }
  // };

  // Función para activar/desactivar un departamento
  const handleToggleStatus = async () => {
    try {
      // Despachar la acción para activar/desactivar el departamento
      const actionResult = await dispatch(toggleOneDepartmentStatus(departament.id));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      fetchDepartments();
      dispatch(fetchUnits());
      showAlert('Estado de la dirección actualizado correctamente', 'success');
    } catch (error) {
      showAlert('Error al actualizar el estado de la dirección.', 'error');
    }
  };

  // Funciones para manejar la apertura y cierre del modal y  actualizar el departamento
  const handleEditClick = () => setIsOpenEditModal(true);
  const handleConfirmEdit = async (formData) => await handleUpdate(formData);
  const handleCancelEdit = () => {
    setFormErrors({});
    setIsOpenEditModal(false);
  };

  // Funciones para manejar la apertura y cierre del dialogo y eliminar el departamento
  // const handleCancel = () => setIsOpenDialog2(false);
  // const handleClick = async () => setIsOpenDialog2(true);
  // const handleConfirm = async () => {
  //   await handleDelete();
  //   setIsOpenDialog2(false);
  // };

  // Funciones para manejar la apertura y cierre del diálogo de activación/desactivación
  const handleOpenToggleDialog = () => setIsOpenToggleDialog(true);
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

  const toggleMessage = getToggleMessage(departament.status);

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleEditClick}
          className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-lg transition-colors hover:bg-gray-200"
          title="Editar"
        >
          <RiEdit2Line />
        </button>
        <button
          onClick={handleOpenToggleDialog}
          className={`flex items-center justify-center w-8 h-8 ${departament.status === 'Activo' ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} rounded-lg transition-colors`}
          title={departament.status === 'Activo' ? 'Desactivar' : 'Activar'}
        >
          {departament.status === 'Activo' ? <RiCloseCircleLine /> : <RiCheckboxCircleLine />}
        </button>
        {/* <button
          onClick={handleClick}
          className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg transition-colors hover:bg-red-200"
        >
          <RiDeleteBin6Line />
        </button> */}
      </div>

      {/* Modal de eliminacion*/}
      {/* <Dialog2
        isOpen={isOpenDialog2}
        setIsOpen={setIsOpenDialog2}
        title="¿Eliminar dirección?"
        description="¿Está seguro que desea eliminar la dirección? Esta acción es permanente y no se podrá deshacer."
        confirmButtonText="Sí, eliminar dirección"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmButtonColor="bg-red-500"
        cancelButtonColor="border-gray-400"
        icon={
          <RiDeleteBin6Line className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />
        }
      /> */}

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
