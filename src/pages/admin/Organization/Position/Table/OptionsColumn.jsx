import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RiEdit2Line, RiDeleteBin6Line, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import { deleteOnePosition, updateOnePosition, toggleOnePositionStatus } from '../../../../../redux/Organization/PositionSlice';
import Dialog2 from '../../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../../contexts/AlertContext';
import { unwrapResult } from '@reduxjs/toolkit';
import ModalForm from '../../../../../components/ui/ModalForm';
import PositionForm from '../PositionForm';

const OptionsColumn = ({ position, fetchPositions }) => {
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const [isOpenDialog2, setIsOpenDialog2] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [isOpenToggleDialog, setIsOpenToggleDialog] = useState(false);
  const [toggleAction, setToggleAction] = useState(null);

  // Efecto para limpiar los errores del formulario al cerrar el modal
  useEffect(() => {
    if (!isOpenEditModal) {
      setFormErrors({});
    }
  }, [isOpenEditModal]);

  // Efecto para mostrar los errores del formulario al abrir el modal
  useEffect(() => {
    if (isOpenEditModal && Object.values(formErrors).some(Boolean)) {
      setIsOpenEditModal(true);
    }
  }, [formErrors, isOpenEditModal]);

  // Función para actualizar una posición
  const handleUpdate = async (formData) => {
    try {
      // Obtener los datos del formulario
      const { name, function: functionDescription, unit_id: unitId, direction_id: directionId, is_manager: isManager } = formData;

      // Crear el objeto con los datos actualizados
      const data = {
        name,
        function: functionDescription,
        unit_id: unitId,
        direction_id: directionId,
        is_manager: isManager,
      };

      // Crear el objeto con los datos actualizados a enviar a la API
      const updatedData = {
        id: position.id,
        data,
      };

      // Despachar la acción para actualizar la posición
      const actionResult = await dispatch(updateOnePosition(updatedData));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      fetchPositions();
      showAlert('Cargo actualizado correctamente', 'success');
      setFormErrors({});
      setIsOpenEditModal(false);
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        name: errors.name ? errors.name[0] : '',
        function: errors.function ? errors.function[0] : '',
        unit_id: errors.unit_id ? errors.unit_id[0] : '',
        direction_id: errors.direction_id ? errors.direction_id[0] : '',
        is_manager: errors.is_manager ? errors.is_manager[0] : '',
      };

      // Mostrar alerta si hay errores
      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        showAlert('Error al actualizar el cargo', 'error');
        setIsOpenEditModal(false);
      }
    }
  };

  // Función para eliminar una posición
  // const handleDelete = async () => {
  //   try {
  //     // Despachar la acción para eliminar la posición
  //     const actionResult = await dispatch(deleteOnePosition(position.id));
  //     // Desempaquetar el resultado de la acción
  //     unwrapResult(actionResult);
  //     fetchPositions();
  //     showAlert('Cargo eliminado correctamente', 'success');
  //   } catch (error) {
  //     console.log('Error deleting position:', error);
  //     showAlert('Error al eliminar el cargo', 'error');
  //   }
  // }

  // Funciones para manejar la apertura y cierre del modal y actualizar la posición
  const handleEditClick = () => setIsOpenEditModal(true);
  const handleConfirmEdit = async (formData) => await handleUpdate(formData);
  const handleCancelEdit = () => {
    setFormErrors({});
    setIsOpenEditModal(false);
  };

  // Funciones para manejar la apertura y cierre del dialogo y eliminar la unidad
  // const handleCancel = () => setIsOpenDialog2(false);
  // const handleClick = async () => setIsOpenDialog2(true);
  // const handleConfirm = async () => {
  //   await handleDelete();
  //   setIsOpenDialog2(false);
  // };


  // Función para activar/desactivar una posición
  const handleToggleStatus = async () => {
    try {
      // Despachar la acción para activar/desactivar la posición
      const actionResult = await dispatch(toggleOnePositionStatus(position.id));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      fetchPositions();
      showAlert('Estado del cargo actualizado correctamente', 'success');
    } catch (error) {
      showAlert('Error al actualizar el estado del cargo.', 'error');
    }
  };

  // Funciones para manejar la apertura y cierre del diálogo de activación/desactivación
  const handleOpenToggleDialog = () => setIsOpenToggleDialog(true);
  const handleConfirmToggle = async () => {
    setIsOpenToggleDialog(false);
    await handleToggleStatus();
  };
  const handleCancelToggle = () => setIsOpenToggleDialog(false);


  // Función para personalizar el mensaje de confirmación
  const getToggleMessage = (status) => {
    if (status === 'Activo') {
      return {
        title: '¿Desactivar cargo?',
        description: 'Desactivar este cargo puede afectar a los empleados y procesos asociados. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, desactivar cargo',
        confirmButtonColor: 'bg-yellow-500',
        icon: <RiCloseCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />
      };
    } else {
      return {
        title: '¿Activar cargo?',
        description: 'Activar este cargo permitirá que los empleados y procesos asociados puedan utilizarlo nuevamente. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, activar cargo',
        confirmButtonColor: 'bg-green-500',
        icon: <RiCheckboxCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />
      };
    }
  };


  const toggleMessage = getToggleMessage(position.status);

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleEditClick}
          className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-lg transition-colors hover:bg-gray-200"
        >
          <RiEdit2Line />
        </button>
        <button
          onClick={handleOpenToggleDialog}
          className={`flex items-center justify-center w-8 h-8 ${position.status === 'Activo' ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} rounded-lg transition-colors`}
          title={position.status === 'Activo' ? 'Desactivar' : 'Activar'}
        >
          {position.status === 'Activo' ? <RiCloseCircleLine /> : <RiCheckboxCircleLine />}
        </button>
        {/* <button
          onClick={handleClick}
          className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg transition-colors hover:bg-red-200"
        >
          <RiDeleteBin6Line />
        </button> */}
      </div>

      {/* Modal de eliminacion */}
      {/* <Dialog2
        isOpen={isOpenDialog2}
        setIsOpen={setIsOpenDialog2}
        title="¿Eliminar cargo?"
        description={`¿Estás seguro de eliminar el cargo ${position.name}? Esta acción no se puede deshacer.`}
        confirmButtonText="Sí, eliminar cargo"
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

      {/* Modal de edición */}
      <ModalForm
        isOpen={isOpenEditModal}
        setIsOpen={setIsOpenEditModal}
        title="Editar cargo"
        icon={<RiEdit2Line className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth="max-w-lg"
      >
        <PositionForm
          isEditing={true}
          onSubmit={handleConfirmEdit}
          onCancel={handleCancelEdit}
          position={position}
          formErrors={formErrors}
        />
      </ModalForm>
    </>
  );
};

export default OptionsColumn;
