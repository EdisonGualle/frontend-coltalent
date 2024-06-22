import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import { createNewWorkExperience, deleteOneWorkExperience, fetchWorkExperiences, updateOneWorkExperience } from '../../../../redux/Employee/Backgrounds/workExperienceSlince';
import DynamicTable from '../components/Table/DynamicTable';
import workExperienceColumns from './Columns/workExperienceColumns';
import SkeletonTable from '../components/Table/SkeletonTable';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import ModalForm from '../../../../components/ui/ModalForm';
import WorkExperienceForm from './Forms/WorkExperienceForm';
import { MdWorkspacePremium } from "react-icons/md";

const WorkExperience = () => {
  const { id } = useParams(); // Obtener el ID del empleado desde la URL
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  // Obtener los datos del estado global
  const { workExperiences, status, error } = useSelector((state) => state.workExperience);
  const [data, setData] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);

  // Estado para almacenar los IDs de los registros seleccionados para eliminar 
  const [selectedIds, setSelectedIds] = useState([]);

  // Estados para manejar el formulario modal de creación y edición
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Estados para almacenar los datos de la experiencia laboral actualmente en edición
  const [currentWorkExperience, setCurrentWorkExperience] = useState(null);

  // Estado para saber si los datos ya se han cargado al menos una vez
  const [hasDataLoadedOnce, setHasDataLoadedOnce] = useState(false);

  useEffect(() => {
    // Reiniciar el estado relevante antes de cargar los nuevos datos
    setData([]);
    setIsLoadingInitial(true);
    setFormErrors({});
    // Cargar los nuevos datos
    dispatch(fetchWorkExperiences(id));
  }, [id]); // Esta línea asegura que el efecto se ejecute cada vez que el `id` cambie

  // Actualizar los datos cuando se carguen
  useEffect(() => {
    if (status === 'succeeded' && Array.isArray(workExperiences)) {
      setData(workExperiences);
      setIsLoadingInitial(false);
      setHasDataLoadedOnce(true);
    }
  }, [workExperiences, status]);

  // Funciones para manejar el formulario modal de creación y edición
  const handleOpenModalForm = () => {
    setIsEditing(false);
    setCurrentWorkExperience(null);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleOpenEditModalForm = (workExperience) => {
    setIsEditing(true);
    setCurrentWorkExperience(workExperience);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleCloseModalForm = () => setIsOpenModalForm(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (workExperienceData) => {
    try{
      if(isEditing && currentWorkExperience){
        const{ from, to, position, institution, responsabilities, activities, functions, departure_reason, note } = workExperienceData;

        const updateWorkExperienceData = {
          id: currentWorkExperience.id,
          from,
          to,
          position,
          institution,
          responsabilities,
          activities,
          functions,
          departure_reason,
          note,
        };

        const resultAction = await dispatch(updateOneWorkExperience({
          employeeId: id, updateWorkExperience: updateWorkExperienceData
        }));

        unwrapResult(resultAction);
        showAlert('Registro actualizado correctamente', 'success');
        dispatch(fetchWorkExperiences(id));
      }else{
        const resultAction = await dispatch(createNewWorkExperience({
          employeeId: id, newWorkExperience: workExperienceData
        }));
        unwrapResult(resultAction);
        showAlert('Registro creado correctamente', 'success');
      }
      handleCloseModalForm();
      setFormErrors({});
    }catch(error){
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        from: errors.from ? errors.from[0] : '',
        to: errors.to ? errors.to[0] : '',
        position: errors.position ? errors.position[0] : '',
        institution: errors.institution ? errors.institution[0] : '',
        responsabilities: errors.responsabilities ? errors.responsabilities[0] : '',
        activities: errors.activities ? errors.activities[0] : '',
        functions: errors.functions ? errors.functions[0] : '',
        departure_reason: errors.departure_reason ? errors.departure_reason[0] : '',
        note: errors.note ? errors.note[0] : '',
      };

      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        const errorMessage = isEditing ? 'Ocurrió un error al actualizar el registro' : 'Ocurrió un error al crear el registro';
        showAlert(errorMessage, 'error');
      }

    }
  };

  //Funciones para manejar el dialogo de confirmación de eliminación
  const handleCancelDelete = () => setIsOpenDialogDelete(false);
  const handleClickDelete = (ids) => {
    setSelectedIds(ids);
    setIsOpenDialogDelete(true);
  };

  // Función para manejar la eliminación de registros
  const handleConfirmDelete = async () => {
    try {
      for (const workExperienceId of selectedIds) {
        const resultAction = await dispatch(deleteOneWorkExperience({ employeeId: id, workExperienceId }));
        unwrapResult(resultAction);
      }
      dispatch(fetchWorkExperiences(id));
      showAlert(`Registro${selectedIds.length > 1 ? 's' : ''} eliminado${selectedIds.length > 1 ? 's' : ''} correctamente`, 'success');
    } catch (error) {
      showAlert('Ocurrió un error al eliminar el registro', 'error');
    } finally {
      setIsOpenDialogDelete(false);
    }
  };

  // Renderizar un esqueleto mientras los datos se cargan por primera vez
  if (isLoadingInitial && !hasDataLoadedOnce && status === 'loading') {
    return <SkeletonTable />;
  }



  return (
    <div>
      <DynamicTable
        title="Información sobre la experiencia laboral."
        columns={workExperienceColumns}
        data={Array.isArray(data) ? data : []}
        onAddNew={handleOpenModalForm}
        onGenerateReport={() => console.log('Generando reporte...')}
        onEdit={(id)=>handleOpenEditModalForm(data.find((workExperience)=>workExperience.id===id))}
        onDelete={handleClickDelete}
      />
      <Dialog2
        isOpen={isOpenDialogDelete}
        setIsOpen={setIsOpenDialogDelete}
        title={`¿Eliminar ${selectedIds.length > 1 ? 'los registros seleccionados' : 'el registro seleccionado'}?`}
        description={`¿Estás seguro de que deseas eliminar ${selectedIds.length > 1 ? 'estos registros' : 'este registro'}? Esta acción es permanente y no se podrá deshacer.`}
        confirmButtonText="Sí, eliminar"
        cancelButtonText="Cancelar"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmButtonColor="bg-red-500"
        cancelButtonColor="border-gray-400"
      />
      <ModalForm
        isOpen={isOpenModalForm}
        setIsOpen={setIsOpenModalForm}
        title={isEditing ? 'Editar experiencia laboral' : 'Agregar nueva experiencia laboral'}
        icon={<MdWorkspacePremium className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth='max-w-2xl'
      >
        <WorkExperienceForm
          workExperience={currentWorkExperience}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={handleCloseModalForm}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default WorkExperience;
