import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';
import { deleteOneDepartment, updateOneDepartment } from '../../../../../redux/Organization/DepartamentSlice';
import Dialog2 from '../../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../../contexts/AlertContext';
import { unwrapResult } from '@reduxjs/toolkit';
import DepartmentForm from '../DepartmentForm';
import ModalForm from '../../../../../components/ui/ModalForm';

const OptionsColumn = ({ departament, fetchDepartments }) => {
  const dispatch = useDispatch();
  const [isOpenDialog2, setIsOpenDialog2] = useState(false);
  const { showAlert } = useContext(AlertContext);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

      // Crear el objeto con los datos actualizados
      const updatedData = {
        id: departament.id,
        data,
      };

      // Despachar la acción para actualizar el departamento
      const actionResult = await dispatch(updateOneDepartment(updatedData));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      fetchDepartments();
      showAlert('Dirección actualizada correctamente', 'success');
      setFormErrors({});
      setIsOpenEditModal(false);
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      console.log('errorObject', errorObject);
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
  const handleDelete = async () => {
    try {
      // Despachar la acción para eliminar el departamento
      const actionResult = await dispatch(deleteOneDepartment(departament.id));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult); 
      fetchDepartments();
      showAlert('Dirección eliminada correctamente', 'success');
    } catch (error) {
      showAlert('Error al eliminar la dirección.', 'error');
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
          className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg transition-colors hover:bg-green-200"
        >
          <RiEdit2Line />
        </button>
        <button
          onClick={handleClick}
          className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg transition-colors hover:bg-red-200"
        >
          <RiDeleteBin6Line />
        </button>
      </div>
      
      {/* Modal de edicion*/}
      <Dialog2
        isOpen={isOpenDialog2}
        setIsOpen={setIsOpenDialog2}
        title="¿Eliminar departamento?"
        description="¿Está seguro que desea eliminar el departamento? Esta acción es permanente y no se podrá deshacer."
        confirmButtonText="Sí, eliminar departamento"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmButtonColor="bg-red-500"
        cancelButtonColor="border-gray-400"
        icon={
          <RiDeleteBin6Line className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />
        }
      />

      {/* Modal del formulario */}
      <ModalForm
        isOpen={isOpenEditModal}
        setIsOpen={setIsOpenEditModal}
        title="Editar departamento"
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
