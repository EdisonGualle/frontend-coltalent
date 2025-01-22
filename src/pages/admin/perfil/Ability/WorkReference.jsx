import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import { createNewWorkReference, deleteOneWorkReference, fetchWorkReferences, updateOneWorkReference } from '../../../../redux/Employee/Backgrounds/workReferenceSlince';
import DynamicTable from '../components/Table/DynamicTable';
import workReferenceColumns from './Columns/workReferenceColumns';
import SkeletonTable from '../components/Table/SkeletonTable';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import ModalForm from '../../../../components/ui/ModalForm';
import WorkReferenceForm from './Forms/WorkReferenceFrom';
import { LuFileBadge } from "react-icons/lu";


const WorkReference = () => {
  const { id } = useParams(); // Obtener el ID del empleado desde la URL
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  // Obtener los datos del estado global
  const { workReferences, status, error } = useSelector((state) => state.workReference);
  const [data, setData] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);

  // Estado para almacenar los IDs de los registros seleccionados para eliminar
  const [selectedIds, setSelectedIds] = useState([]);

  // Estados para manejar el formulario modal de creación y edición
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Estados para almacenar los datos de la referencia laboral actualmente en edición
  const [currentWorkReference, setCurrentWorkReference] = useState(null);

  // Estado para saber si los datos ya se han cargado al menos una vez
  const [hasDataLoadedOnce, setHasDataLoadedOnce] = useState(false);

  useEffect(() => {
    // Reiniciar el estado relevante antes de cargar los nuevos datos
    setData([]);
    setIsLoadingInitial(true);
    setFormErrors({});
    // Cargar los nuevos datos
    dispatch(fetchWorkReferences(id));
  }, [id]); // Esta línea asegura que el efecto se ejecute cada vez que el `id` cambie

  // Actualizar los datos cuando se carguen
  useEffect(() => {
    if (status === 'succeeded' && Array.isArray(workReferences)) {
      setData(workReferences);
      setIsLoadingInitial(false);
      setHasDataLoadedOnce(true);
    }
  }, [workReferences, status]);

  // Funciones para manejar el formulario modal de creación y edición
  const handleOpenModalForm = () => {
    setIsEditing(false);
    setCurrentWorkReference(null);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleOpenEditModalForm = (workReference) => {
    setIsEditing(true);
    setCurrentWorkReference(workReference);
    setFormErrors({});
    setIsOpenModalForm(true);
  }

  const handleCloseModalForm = () => setIsOpenModalForm(false);

  // Funcion para manejar el envio del formulario
  const handleSubmit = async (workReferenceData) => {
    try {
      if (isEditing && currentWorkReference) {
        const {name, position, company_name, contact_number, relationship_type} = workReferenceData;

        const updateWorkReferenceData = {
          id: currentWorkReference.id,
          name,
          position,
          company_name,
          contact_number,
          relationship_type,
        };

        const resultAction = await dispatch(updateOneWorkReference({
          employeeId: id, updateWorkReference: updateWorkReferenceData
        }));

        unwrapResult(resultAction);
        showAlert('Registro actualizado correctamente', 'success');
      } else {
        const resultAction = await dispatch(createNewWorkReference({ 
          employeeId: id, newWorkReference: workReferenceData 
        }));
        unwrapResult(resultAction);
        showAlert('Registro creado correctamente', 'success');
      }
      handleCloseModalForm();
      setFormErrors({});
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors  = {
        name: errors.name ? errors.name[0] : '',
        position: errors.position ? errors.position[0] : '',
        company_name: errors.company_name ? errors.company_name[0] : '',
        contact_number: errors.contact_number ? errors.contact_number[0] : '',
        relationship_type: errors.relationship_type ? errors.relationship_type[0] : '',
      };

      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        const errorMessage = isEditing ? 'Ocurrió un error al actualizar el registro' : 'Ocurrió un error al crear el registro';
        showAlert(errorMessage, 'error');
      }

      }

    };


  //  Funciones para manejar el dialogo de confirmacion de eliminacion
  const handleCancelDelete = () => setIsOpenDialogDelete(false);
  const handleClickDelete = (ids) => {
    setSelectedIds(ids);
    setIsOpenDialogDelete(true);
  };

  // Funcion para manejar la eliminacion de los registros seleccionados
  const handleConfirmDelete = async () => {
    try {
      for (const workReferenceId of selectedIds) {
        const resultAction = await dispatch(deleteOneWorkReference({ employeeId: id, workReferenceId }));
        unwrapResult(resultAction);
      }
      dispatch(fetchWorkReferences(id));
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
        title="Información sobre las referencias laborales."
        columns={workReferenceColumns}
        data={Array.isArray(data) ? data : []}
        onAddNew={handleOpenModalForm}
        onGenerateReport={() => console.log('Generando reporte...')}
        onEdit={(id)=>handleOpenEditModalForm(data.find((workReference)=>workReference.id===id))}
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
        title={isEditing ? 'Editar referencia laboral' : 'Agregar nueva referencia laboral'}
        icon={< LuFileBadge className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth='max-w-2xl'
      >
        <WorkReferenceForm
          workReference={currentWorkReference}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={handleCloseModalForm}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default WorkReference;