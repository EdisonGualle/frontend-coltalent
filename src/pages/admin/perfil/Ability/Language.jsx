import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import DynamicTable from '../components/Table/DynamicTable';
import { createNewLanguage, deleteOneLanguage, fetchLanguages, updateOneLanguage } from '../../../../redux/Employee/Backgrounds/languageSlince';
import SkeletonTable from '../components/Table/SkeletonTable';
import languageColumns from './Columns/languageColumns';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import ModalForm from '../../../../components/ui/ModalForm';
import LanguageForm from './Forms/LanguageForm';
import { RiSpeakLine } from "react-icons/ri";

const Language = () => {
  const { id } = useParams(); // Obtener el ID del empleado desde la URL
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  // Obtener los datos del estado global
  const { languages, status, error } = useSelector((state) => state.language);
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
  const [currentLanguage, setCurrentLanguage] = useState(null);

  // Estado para saber si los datos ya se han cargado al menos una vez
  const [hasDataLoadedOnce, setHasDataLoadedOnce] = useState(false);

  useEffect(() => {
    // Reiniciar el estado relevante antes de cargar los nuevos datos
    setData([]);
    setIsLoadingInitial(true);
    setFormErrors({});
    // Cargar los nuevos datos
    dispatch(fetchLanguages(id));
  }, [id]); // Esta línea asegura que el efecto se ejecute cada vez que el `id` cambie

  // Actualizar los datos cuando se carguen
  useEffect(() => {
    if (status === 'succeeded' && Array.isArray(languages)) {
      setData(languages);
      setIsLoadingInitial(false);
      setHasDataLoadedOnce(true);
    }
  }, [languages, status]);


    // Funciones para manejar el formulario modal de creación y edición
    const handleOpenModalForm = () => {
      setIsEditing(false);
      setCurrentLanguage(null);
      setFormErrors({}); // Limpiar errores del formulario
      setIsOpenModalForm(true);
    };
  
    const handleOpenEditModal = (language) => {
      setIsEditing(true);
      setCurrentLanguage(language);
      setFormErrors({}); // Limpiar errores del formulario
      setIsOpenModalForm(true);
    };
  
    const handleCloseModalForm = () => setIsOpenModalForm(false);
  
    // Función para manejar el envío del formulario
    const handleSubmit = async (languageData) => {
      try {
        if (isEditing && currentLanguage) {
          const { language, spoken_level, written_level, proficiency_certificate, issuing_institution } = languageData;
          const updateLanguageData = {
            id: currentLanguage.id,
            language,
            spoken_level,
            written_level,
            proficiency_certificate,
            issuing_institution,
          };
  
          const resultAction = await dispatch(updateOneLanguage({
            employeeId: id, updateLanguage: updateLanguageData
          }));
  
          unwrapResult(resultAction);
          showAlert('Registro actualizado correctamente', 'success');
          dispatch(fetchLanguages(id));
        } else {
          const resultAction = await dispatch(createNewLanguage({
            employeeId: id, newLanguage: languageData
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
          language: errors.language ? errors.language[0] : '',
          spoken_level: errors.spoken_level ? errors.spoken_level[0] : '',
          written_level: errors.written_level ? errors.written_level[0] : '',
          proficiency_certificate: errors.proficiency_certificate ? errors.proficiency_certificate[0] : '',
          issuing_institution: errors.issuing_institution ? errors.issuing_institution[0] : '',
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

  // Función para manejar la eliminación de registros
  const handleConfirmDelete = async () => {
    try {
      for (const languageId of selectedIds) {
        const resultAction = await dispatch(deleteOneLanguage({ employeeId: id, languageId }));
        unwrapResult(resultAction);
      }
      dispatch(fetchLanguages(id));
      showAlert(`Registro${selectedIds.length > 1 ? 's' : ''} eliminado${selectedIds.length > 1 ? 's' : ''} correctamente`, 'success');
    } catch (error) {
      showAlert('Ocurrió un error al intentar eliminar el registro', 'error');
    } finally {
      setIsOpenDialogDelete(false);
    }
  };



  // Renderizar un esqueleto mientras se cargan los datos iniciales
  if (isLoadingInitial && !hasDataLoadedOnce && status === 'loading') {
    return <SkeletonTable />;
  }

  return (
    <div>
      <DynamicTable
        title="Información sobre los idiomas que hablas"
        columns={languageColumns}
        data={Array.isArray(data) ? data : []}
        onAddNew={handleOpenModalForm}
        onGeneratemitReport={() => console.log('Generate report')}
        onEdit={(id) => handleOpenEditModal(data.find(language => language.id === id))}
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
        title={isEditing ? 'Editar idioma' : 'Agregar idioma'}
        icon={<RiSpeakLine className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth='max-w-2xl'
      >
        <LanguageForm
          isEditing={isEditing}
          languageForm={currentLanguage}
          onSubmit={handleSubmit}
          onCancel={handleCloseModalForm}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default Language;
