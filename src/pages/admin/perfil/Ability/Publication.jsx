import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import DynamicTable from '../components/Table/DynamicTable';
import { createNewPublication, deleteOnePublication, fetchPublications, updateOnePublication } from '../../../../redux/Employee/Backgrounds/publicationSlince';
import SkeletonTable from '../components/Table/SkeletonTable';
import publicationColumns from './Columns/publicationColumns';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import ModalForm from '../../../../components/ui/ModalForm';
import PublicationForm from './Forms/PublicationForm';
import { GrArticle } from "react-icons/gr";

const Publication = () => {
  const { id } = useParams(); // Obtener el ID del empleado desde la URL
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  // Obtener los datos del estado global
  const { publications, status, error } = useSelector((state) => state.publication);
  const [data, setData] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);

  // Estado para almacenar los IDs de los registros seleccionados para eliminar
  const [selectedIds, setSelectedIds] = useState([]);

  // Estados para manejar el formulario modal de creación y edición
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Estados para almacenar los datos del idioma actualmente en edición
  const [currentPublication, setCurrentPublication] = useState(null);


  // Estado para saber si los datos ya se han cargado al menos una vez
  const [hasDataLoadedOnce, setHasDataLoadedOnce] = useState(false);

  useEffect(() => {
    // Reiniciar el estado relevante antes de cargar los nuevos datos
    setData([]);
    setIsLoadingInitial(true);
    setFormErrors({});
    // Cargar los nuevos datos
    dispatch(fetchPublications(id));
  }, [id]); // Esta línea asegura que el efecto se ejecute cada vez que el `id` cambie

  // Actualizar los datos cuando se carguen
  useEffect(() => {
    if (status === 'succeeded' && Array.isArray(publications)) {
      setData(publications);
      setIsLoadingInitial(false);
      setHasDataLoadedOnce(true);
    }
  }, [publications, status]);

  // Funciones para manejar el formulario modal de creación y edición
  const handleOpenModalForm = () => {
    setIsEditing(false);
    setCurrentPublication(null);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleOpenEditModal = (publication) => {
    setIsEditing(true);
    setCurrentPublication(publication);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleCloseModalForm = () => setIsOpenModalForm(false);


  // Función para manejar el envío del formulario
  const handleSubmit = async (publicationData) => {
    try {
      if (isEditing && currentPublication) {
        const { publication_type_id, title, publisher, authorship, isbn_issn } = publicationData;
        const updatePublicationData = {
          id: currentPublication.id,
          publication_type_id: publication_type_id || currentPublication.publication_type.id,
          title,
          publisher,
          authorship,
          isbn_issn,
        };


        const resultAction = await dispatch(updateOnePublication({
          employeeId: id, updatePublication: updatePublicationData
        }));

        unwrapResult(resultAction);
        showAlert('Registro actualizado correctamente', 'success');
        dispatch(fetchPublications(id));
      } else {
        const resultAction = await dispatch(createNewPublication({
          employeeId: id, newPublication: publicationData
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
        publication_type_id: errors.publication_type_id ? errors.publication_type_id[0] : '',
        title: errors.title ? errors.title[0] : '',
        publisher: errors.publisher ? errors.publisher[0] : '',
        authorship: errors.authorship ? errors.authorship[0] : '',
        isbn_issn: errors.isbn_issn ? errors.isbn_issn[0] : '',
      };

      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        const errorMessage = isEditing ? 'Ocurrió un error al actualizar el registro' : 'Ocurrió un error al crear el registro';
        showAlert(errorMessage, 'error');
      }
    }
  };

  // Funciones para manejar el diálogo de confirmación de eliminación
  const handleCancelDelete = () => setIsOpenDialogDelete(false);
  const handleClickDelete = (ids) => {
    setSelectedIds(ids);
    setIsOpenDialogDelete(true);
  };

  // Función para eliminar los registros seleccionados
  const handleConfirmDelete = async () => {
    try {
      for (const publicationId of selectedIds) {
        const resultAction = await dispatch(deleteOnePublication({ employeeId: id, publicationId }));
        unwrapResult(resultAction);
      }
      dispatch(fetchPublications(id));
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
        title="Información sobre las publicaciones realizadas."
        columns={publicationColumns}
        data={Array.isArray(data) ? data : []}
        onAddNew={handleOpenModalForm}
        onGeneratemitReport={() => console.log('Generate report')}
        onEdit={(id) => handleOpenEditModal(data.find(publication => publication.id === id))}
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
        icon={<GrArticle className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth='max-w-2xl'
      >
        <PublicationForm
          isEditing={isEditing}
          publication={currentPublication}
          onSubmit={handleSubmit}
          onCancel={handleCloseModalForm}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default Publication;
