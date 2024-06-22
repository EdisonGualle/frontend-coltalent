import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';
import { deleteOneUnit, updateOneUnit } from '../../../../../redux/Organization/UnitSlince';
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
  const handleDelete = async () => {
    try {
      // Despachar la acción para eliminar la unidad
      const actionResult = await dispatch(deleteOneUnit(unit.id));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      fetchUnits();
      dispatch(fetchPositions());
      showAlert('Unidad eliminada correctamente', 'success');
    } catch (error) {
      showAlert('Error al eliminar la unidad', 'error');
    }
  };

  // Funciones para manejar la apertura y cierre del modal y actualizar la unidad
  const handleEditClick = () => setIsOpenEditModal(true);
  const handleConfirmEdit = async (formData) => await handleUpdate(formData);
  const handleCancelEdit = () => {
    setFormErrors({});
    setIsOpenEditModal(false);
  };

  // Funciones para manejar la apertura y cierre del dialogo y eliminar la unidad
  const handleCancel = () => setIsOpenDialog2(false);

  const handleClick = async () => setIsOpenDialog2(true);
  
  const handleConfirm = async () => {
    await handleDelete();
    setIsOpenDialog2(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleEditClick}
          className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg transition-colors hover:bg-green-200">
          <RiEdit2Line />
        </button>
        <button
          onClick={handleClick}
          className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg transition-colors hover:bg-red-200">
          <RiDeleteBin6Line />
        </button>
      </div>

      {/* Modal de eliminacion */}
      <Dialog2
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
      />

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
