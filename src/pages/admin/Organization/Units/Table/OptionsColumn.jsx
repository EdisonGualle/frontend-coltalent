import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RiEdit2Line, RiDeleteBin6Line, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import { deleteOneUnit, updateOneUnit, toggleOneUnitStatus } from '../../../../../redux/Organization/UnitSlince';
import Dialog2 from '../../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../../contexts/AlertContext';
import { unwrapResult } from '@reduxjs/toolkit';
import ModalForm from '../../../../../components/ui/ModalForm';
import UnitForm from '../UnitForm';
import { fetchPositions } from '../../../../../redux/Organization/PositionSlice';

const OptionsColumn = ({ unit, fetchUnits }) => {
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

  // Función para actualizar una unidad
  const handleUpdate = async (formData) => {
    try {
      // Obtener los datos del formulario
      const { name, function: functionDescription, phone: landlinePhone, direction_id: directionId } = formData;

      // Crear el objeto con los datos actualizados
      const data = {
        name,
        function: functionDescription,
        phone: landlinePhone,
        direction_id: directionId,
      };

      // Crear el objeto con los datos actualizados a enviar a la API
      const updatedData = {
        id: unit.id,
        data,
      };

      // Despachar la acción para actualizar la unidad
      const actionResult = await dispatch(updateOneUnit(updatedData));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      fetchUnits();
      dispatch(fetchPositions());
      showAlert('Unidad actualizada correctamente', 'success');
      setFormErrors({});
      setIsOpenEditModal(false);
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        name: errors.name ? errors.name[0] : '',
        function: errors.function ? errors.function[0] : '',
        phone: errors.phone ? errors.phone[0] : '',
        direction_id: errors.direction_id ? errors.direction_id[0] : '',
      };
      // Mostrar alerta si hay errores
      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        showAlert('Error al actualizar la unidad.', 'error');
        setIsOpenEditModal(false);
      }
    }
  };

  // Funcion para eliminar una unidad
  // const handleDelete = async () => {
  //   try {
  //     // Despachar la acción para eliminar la unidad
  //     const actionResult = await dispatch(deleteOneUnit(unit.id));
  //     // Desempaquetar el resultado de la acción
  //     unwrapResult(actionResult);
  //     fetchUnits();
  //     dispatch(fetchPositions());
  //     showAlert('Unidad eliminada correctamente', 'success');
  //   } catch (error) {
  //     showAlert('Error al eliminar la unidad', 'error');
  //   }
  // };

  // Funciones para manejar la apertura y cierre del modal y actualizar la unidad
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

    // Función para alternar el estado de una unidad
    const handleToggleStatus = async () => {
      try {
        // Despachar la acción para alternar el estado de la unidad
        const actionResult = await dispatch(toggleOneUnitStatus(unit.id));
        // Desempaquetar el resultado de la acción
        unwrapResult(actionResult);
        fetchUnits();
        showAlert('Estado de la unidad actualizado correctamente', 'success');
      } catch (error) {
        showAlert('Error al actualizar el estado de la unidad.', 'error');
      }
    };

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
          title: '¿Desactivar unidad?',
          description: 'Desactivar esta unidad puede afectar a los empleados y procesos asociados. ¿Está seguro que desea continuar?',
          confirmButtonText: 'Sí, desactivar unidad',
          confirmButtonColor: 'bg-yellow-500',
          icon: <RiCloseCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />
        };
      } else {
        return {
          title: '¿Activar unidad?',
          description: 'Activar esta unidad permitirá que los empleados y procesos asociados puedan utilizarla nuevamente. ¿Está seguro que desea continuar?',
          confirmButtonText: 'Sí, activar unidad',
          confirmButtonColor: 'bg-green-500',
          icon: <RiCheckboxCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />
        };
      }
    };

    const toggleMessage = getToggleMessage(unit.status);

  
  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleEditClick}
          className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-lg transition-colors hover:bg-gray-200">
          <RiEdit2Line />
        </button>
        <button
          onClick={handleOpenToggleDialog}
          className={`flex items-center justify-center w-8 h-8 ${unit.status === 'Activo' ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} rounded-lg transition-colors`}
          title={unit.status === 'Activo' ? 'Desactivar' : 'Activar'}
        >
          {unit.status === 'Activo' ? <RiCloseCircleLine /> : <RiCheckboxCircleLine />}
        </button>
        {/* <button
          onClick={handleClick}
          className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg transition-colors hover:bg-red-200">
          <RiDeleteBin6Line />
        </button> */}
      </div>

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

      {/* Modal de eliminacion */}
      {/* <Dialog2
        isOpen={isOpenDialog2}
        setIsOpen={setIsOpenDialog2}
        title="¿Eliminar unidad?"
        description="¿Estás seguro de que deseas eliminar esta unidad? Esta acción es permanente y no se podrá deshacer."
        confirmButtonText="Sí, eliminar unidad"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmButtonColor="bg-red-500"
        cancelButtonColor="border-gray-400"
        icon={
          <RiDeleteBin6Line className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />
        }
      /> */}

      {/* Modal de edición */}
      <ModalForm
        isOpen={isOpenEditModal}
        setIsOpen={setIsOpenEditModal}
        title="Editar unidad"
        icon={<RiEdit2Line className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth="max-w-2xl"
      >
        <UnitForm
          isEditing={true}
          onSubmit={handleConfirmEdit}
          onCancel={handleCancelEdit}
          unit={unit}
          formErrors={formErrors}
        />
      </ModalForm>
    </>
  );
};

export default OptionsColumn;
