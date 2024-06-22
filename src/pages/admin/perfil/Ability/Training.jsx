import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import { createNewTraining, deleteOneTraining, fetchTrainings, updateOneTraining } from '../../../../redux/Employee/Education/trainingSlince';
import DynamicTable from '../components/Table/DynamicTable';
import trainingColumns from './Columns/trainingColumns';
import SkeletonTable from '../components/Table/SkeletonTable';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import ModalForm from '../../../../components/ui/ModalForm';
import TrainingForm from './Forms/TrainingForm';
import { FaChalkboardTeacher } from "react-icons/fa";


const Training = () => {
  const { id } = useParams(); // Obtener el ID del empleado desde la URL
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  // Obtener los datos del estado global
  const { trainings, status, error } = useSelector((state) => state.training);
  const [data, setData] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);

  // Estado para almacenar los IDs de los registros seleccionados para eliminar
  const [selectedIds, setSelectedIds] = useState([]);

  // Estados para manejar el formulario modal de creación y edición
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Estados para almacenar los datos de la capacitación actualmente en edición
  const [currentTraining, setCurrentTraining] = useState(null);

  // Estado para saber si los datos ya se han cargado al menos una vez
  const [hasDataLoadedOnce, setHasDataLoadedOnce] = useState(false);

  useEffect(() => {
    // Reiniciar el estado relevante antes de cargar los nuevos datos
    setData([]);
    setIsLoadingInitial(true);
    setFormErrors({});
    // Cargar los nuevos datos
    dispatch(fetchTrainings(id));
  }, [id]); // Esta línea asegura que el efecto se ejecute cada vez que el `id` cambie

  // Actualizar los datos cuando se carguen
  useEffect(() => {
    if (status === 'succeeded' && Array.isArray(trainings)) {
      setData(trainings);
      setIsLoadingInitial(false);
      setHasDataLoadedOnce(true);
    }
  }, [trainings, status]);

  // Funciones para manejar el formulario modal de creación y edición
  const handleOpenModalForm = () => {
    setIsEditing(false);
    setCurrentTraining(null);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleOpenEditModal = (training) => {
    setIsEditing(true);
    setCurrentTraining(training);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleCloseModalForm = () => setIsOpenModalForm(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (trainingData) => {
    try {
      if (isEditing && currentTraining) {
        const { topic, institution, year, num_hours, training_type_id } = trainingData;

        const updateTrainingData = {
          id: currentTraining.id,
          topic,
          institution,
          year,
          num_hours,
          training_type_id: training_type_id || currentTraining.training_type.id
        };


        const resultAction = await dispatch(updateOneTraining({
          employeeId: id, updateTraining: updateTrainingData
        }));

        unwrapResult(resultAction);
        showAlert('Registro actualizado correctamente', 'success');
        dispatch(fetchTrainings(id));
      } else {
        const resultAction = await dispatch(createNewTraining({
          employeeId: id, newTraining: trainingData
        }));
        unwrapResult(resultAction);
        showAlert('Registro creado correctamente', 'success');
      }
      handleCloseModalForm();
      setFormErrors({});
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        institution: errors.institution ? errors.institution[0] : '',
        topic: errors.topic ? errors.topic[0] : '',
        training_type_id: errors.training_type_id ? errors.training_type_id[0] : '',
        year: errors.year ? errors.year[0] : '',
        num_hours: errors.num_hours ? errors.num_hours[0] : '',
      };

      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        const errorMessage = isEditing ? 'Ocurrió un error al actualizar el registro' : 'Ocurrió un error al crear el registro';
        showAlert(errorMessage, 'error');
      }
    }
  };

  // Funciones para manejar el dialogo de confirmación de eliminación
  const handleCancelDelete = () => setIsOpenDialogDelete(false);
  const handleClickDelete = (ids) => {
    setSelectedIds(ids);
    setIsOpenDialogDelete(true);
  };

  // Función para manejar la eliminación de registros
  const handleConfirmDelete = async () => {
    try {
      for (const trainingId of selectedIds) {
        const resultAction = await dispatch(deleteOneTraining({ employeeId: id, trainingId }));
        unwrapResult(resultAction);
      }
      dispatch(fetchTrainings(id));
      showAlert(`Registro${selectedIds.length > 1 ? 's' : ''} eliminado${selectedIds.length > 1 ? 's' : ''} correctamente`, 'success');
    } catch (error) {
      showAlert('Ocurrió un error al intentar eliminar el registro', 'error');
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
        title="Información sobre las capacitaciones recibidas."
        columns={trainingColumns}
        data={Array.isArray(data) ? data : []}
        onAddNew={handleOpenModalForm}
        onGenerateReport={() => console.log('Generando reporte...')}
        onEdit={(id) => handleOpenEditModal(data.find(training => training.id === id))}
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
        title={isEditing ? 'Editar publicación' : 'Agregar nueva publicación'}
        icon={<FaChalkboardTeacher className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth='max-w-2xl'
      >
        <TrainingForm
          training={currentTraining}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={handleCloseModalForm}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default Training;
