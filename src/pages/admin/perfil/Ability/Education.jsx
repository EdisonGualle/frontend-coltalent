import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import DynamicTable from '../components/Table/DynamicTable';
import { createNewFormalEducation, deleteOneFormalEducation, fetchFormalEducations, updateOneFormalEducation } from '../../../../redux/Employee/Education/formalEducationSince';
import SkeletonTable from '../components/Table/SkeletonTable';
import educationColumns from './Columns/educationColumns';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import ModalForm from '../../../../components/ui/ModalForm';
import EducationForm from './Forms/EducationForm';
import { MdOutlineSubtitles } from "react-icons/md";

const Education = () => {
  const { id } = useParams(); // Obtener el ID del empleado desde la URL
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  // Obtener los datos del estado global
  const { formalEducations, status, error } = useSelector((state) => state.formalEducation);
  const [data, setData] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);

  // Estado para almacenar los IDs de los registros seleccionados para eliminar
  const [selectedIds, setSelectedIds] = useState([]);

  // Estados para manejar el formulario modal de creación y edición
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Estado para almacenar los datos de la educación actualmente en edición
  const [currentEducation, setCurrentEducation] = useState(null);

  // Estado para saber si los datos ya se han cargado al menos una vez
  const [hasDataLoadedOnce, setHasDataLoadedOnce] = useState(false);

  useEffect(() => {
    // Reiniciar el estado relevante antes de cargar los nuevos datos
    setData([]);
    setIsLoadingInitial(true);
    setFormErrors({});
    // Cargar los nuevos datos
    dispatch(fetchFormalEducations(id));
  }, [id]); // Esta línea asegura que el efecto se ejecute cada vez que el `id` cambie

  // Actualizar los datos cuando se carguen
  useEffect(() => {
    if (status === 'succeeded' && Array.isArray(formalEducations)) {
      setData(formalEducations);
      setIsLoadingInitial(false);
      setHasDataLoadedOnce(true);
    }
  }, [formalEducations, status]);

  // Funciones para manejar el diálogo de confirmación de eliminación
  const handleCancelDelete = () => setIsOpenDialogDelete(false);
  const handleClickDelete = (ids) => {
    setSelectedIds(ids);
    setIsOpenDialogDelete(true);
  };

  // Función para manejar la eliminación de registros
  const handleConfirmDelete = async () => {
    try {
      for (const educationId of selectedIds) {
        const actionResult = await dispatch(deleteOneFormalEducation({ employeeId: id, educationId }));
        unwrapResult(actionResult);
      }
      dispatch(fetchFormalEducations(id));
      showAlert(`Registro${selectedIds.length > 1 ? 's' : ''} eliminado${selectedIds.length > 1 ? 's' : ''} correctamente`, 'success');
    } catch (error) {
      showAlert('Ocurrió un error al intentar eliminar el registro', 'error');
    } finally {
      setIsOpenDialogDelete(false);
    }
  };

  // Funciones para manejar el formulario modal de creación y edición
  const handleOpenModalForm = () => {
    setIsEditing(false);
    setCurrentEducation(null);
    setIsOpenModalForm(true);
  };

  const handleOpenEditModal = (education) => {
    setIsEditing(true);
    setCurrentEducation(education);
    setIsOpenModalForm(true);
  };
  const handleCloseModalForm = () => setIsOpenModalForm(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (educationData) => {
    try {
      if (isEditing && currentEducation) {
        const { level_id, state_id, institution, title } = educationData;
        const updateData = {
          id: currentEducation.id,
          level_id: level_id || currentEducation.level.id,
          state_id: state_id || currentEducation.state.id,
          institution,
          title,
        };

        const actionResult = await dispatch(updateOneFormalEducation({
          employeeId: id,
          updateEducation: updateData,
        }));
        unwrapResult(actionResult);
        showAlert('Registro actualizado correctamente', 'success');
        dispatch(fetchFormalEducations(id));
      } else {
        const actionResult = await dispatch(createNewFormalEducation({ employeeId: id, newEducation: educationData }));
        unwrapResult(actionResult);
        showAlert('Registro creado correctamente', 'success');
      }
      handleCloseModalForm();
      setFormErrors({});
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        level_id: errors.level_id ? errors.level_id[0] : '',
        institution: errors.institution ? errors.institution[0] : '',
        title: errors.title ? errors.title[0] : '',
        state_id: errors.state_id ? errors.state_id[0] : '',
      };

      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        showAlert('Ocurrió un error al crear el registro', 'error');
      }
    }
  };


  // Renderizar el componente
  if (isLoadingInitial && !hasDataLoadedOnce && status === 'loading') {
    return <SkeletonTable />;
  }
  
  if (status === 'failed') {
    return <div>Error</div>;
  }

  
  return (
    <div>
      <DynamicTable
        title="Información sobre la educación recibida."
        columns={educationColumns}
        data={Array.isArray(data) ? data : []}
        onAddNew={handleOpenModalForm}
        onGeneratemitReport={() => console.log('Generate report')}
        onEdit={(id) => handleOpenEditModal(data.find(education => education.id === id))}
        onDelete={handleClickDelete}
      />
      <Dialog2
        isOpen={isOpenDialogDelete}
        setIsOpen={setIsOpenDialogDelete}
        title={`¿Eliminar ${selectedIds.length > 1 ? 'los registros seleccionados' : 'el registro seleccionado'}?`}
        description={`¿Estás seguro de que deseas eliminar ${selectedIds.length > 1 ? 'estos registros' : 'este registro'}? Esta acción es permanente y no se podrá deshacer.`}
        confirmButtonText="Sí, eliminar"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmButtonColor="bg-red-500"
        cancelButtonColor="border-gray-400"
      />

      <ModalForm
        isOpen={isOpenModalForm}
        setIsOpen={setIsOpenModalForm}
        title={isEditing ? "Editar educación" : "Agregar nueva educación"}
        icon={<MdOutlineSubtitles className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth="max-w-2xl"
      >
        <EducationForm
          isEditing={isEditing}
          education={currentEducation}
          onSubmit={handleSubmit}
          onCancel={handleCloseModalForm}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default Education;
