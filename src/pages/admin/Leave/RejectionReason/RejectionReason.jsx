import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { CardHeader, Typography } from "@material-tailwind/react";
import { RiEdit2Line, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';
import LeaveTable from '../components/Table/LeaveTable';
import rejectionReasonColumns from './Table/rejectionReasonColumns';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import {
  fetchRejectionReasons, deleteOneRejectionReason,
  updateOneRejectionReason, createNewRejectionReason,
  fetchAllRejectionReasonsIncludingDeleted, toggleOneRejectionReasonStatus
} from '../../../../redux/Leave/rejectionReasonSlince';
import SkeletonTable from '../components/Table/SkeletonTable';
import ModalForm from '../../../../components/ui/ModalForm';
import { TbMessageX } from "react-icons/tb";
import RejectionReasonForm from './RejectionReasonForm';
import { getCellStyle } from './Table/getCellStyle';
import LoadingIndicator from '../../../../components/ui/LoadingIndicator';


const RejectionReason = () => {
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const { status, hasFetchedOnce, allRejectionReasons } = useSelector((state) => state.rejectionReason);
  const [data, setData] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isOpenToggleDialog, setIsOpenToggleDialog] = useState(false);

  // Estado para almacenar los IDs de los registros seleccionados para eliminar
  const [selectedIds, setSelectedIds] = useState([]);

  // Estados para manejar el formulario modal de creación y edición
  const [isOpenModalForm, setIsOpenModalForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Estados para almacenar los datos del motivo de rechazo actualmente en edición
  const [currentRejectionReason, setCurrentRejectionReason] = useState(null);

  useEffect(() => {
    if (!hasFetchedOnce) {
      setIsLoadingInitial(true);
      dispatch(fetchAllRejectionReasonsIncludingDeleted())
        .then(unwrapResult)
        .then(() => {
          setIsLoadingInitial(false);
        })
        .catch(() => {
          setIsLoadingInitial(false);
        });
    } else {
      setIsLoadingInitial(false);
    }
  }, [dispatch, hasFetchedOnce]);

  // Actualizar los datos cuando se carguen
  useEffect(() => {
    if (status === 'succeeded') {
      setData(allRejectionReasons);
    }
  }, [allRejectionReasons, status]);

  // Funciones para manejar el formulario modal de creación y edición
  const handleOpenModalForm = () => {
    setIsEditing(false);
    setCurrentRejectionReason(null);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleOpenEditModalForm = (rejectionReason) => {
    setIsEditing(true);
    setCurrentRejectionReason(rejectionReason);
    setFormErrors({});
    setIsOpenModalForm(true);
  };

  const handleCloseModalForm = () => setIsOpenModalForm(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (formData) => {
    try {
      if (isEditing && currentRejectionReason) {
        const { reason } = formData;

        const updatedRejectionReasonData = {
          rejectionReasonId: currentRejectionReason.id,
          updateRejectionReason: { reason },
        };
        const resultAction = await dispatch(updateOneRejectionReason(updatedRejectionReasonData));
        unwrapResult(resultAction);
        showAlert('Registro actualizado correctamente', 'success');
        dispatch(fetchRejectionReasons());
      } else {
        const resultAction = await dispatch(createNewRejectionReason(formData));
        unwrapResult(resultAction);
        showAlert('Registro creado correctamente', 'success');
      }
      handleCloseModalForm();
      setFormErrors({});
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        reason: errors.reason ? errors.reason[0] : '',
      };

      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        const errorMessage = isEditing ? 'Ocurrió un error al actualizar el registro' : 'Ocurrió un error al crear el registro';
        showAlert(errorMessage, 'error');
      }
    }
  };

  // const handleCancelDelete = () => setIsOpenDialogDelete(false);
  // const handleClickDelete = (ids) => {
  //   setSelectedIds(ids);
  //   setIsOpenDialogDelete(true);
  // };

  // const handleConfirmDelete = async () => {
  //   try {
  //     for (const rejectionReasonId of selectedIds) {
  //       const resultAction = await dispatch(deleteOneRejectionReason(rejectionReasonId));
  //       unwrapResult(resultAction);
  //     }
  //     setSelectedIds([]); // Limpiar los IDs seleccionados después de eliminar
  //     dispatch(fetchAllRejectionReasonsIncludingDeleted());
  //     showAlert(`Registro${selectedIds.length > 1 ? 's' : ''} eliminado${selectedIds.length > 1 ? 's' : ''} correctamente`, 'success');
  //   } catch (error) {
  //     showAlert('Ocurrió un error al intentar eliminar el registro', 'error');
  //   } finally {
  //     setIsOpenDialogDelete(false);
  //   }
  // };

  const handleEdit = (row) => {
    const rejectionReason = allRejectionReasons.find(reason => reason.id === row.id);
    if (rejectionReason) {
      handleOpenEditModalForm(rejectionReason);
    }
  };


  const handleToggleClick = (row) => {
    setSelectedReason(row);
    setIsOpenToggleDialog(true);
  };

  const handleConfirmToggle = async () => {
    try {
      const resultAction = await dispatch(toggleOneRejectionReasonStatus(selectedReason.id));
      unwrapResult(resultAction);
      showAlert('Estado del motivo de rechazo actualizado correctamente', 'success');
      dispatch(fetchAllRejectionReasonsIncludingDeleted());
    } catch (error) {
      showAlert('Error al actualizar el estado del motivo de rechazo.', 'error');
    } finally {
      setIsOpenToggleDialog(false);
    }
  };

  const handleCancelToggle = () => setIsOpenToggleDialog(false);

  const getToggleMessage = (status) => {
    if (status === 'Activo') {
      return {
        title: '¿Desactivar motivo de rechazo?',
        description: 'Desactivar este motivo de rechazo puede afectar los procesos asociados. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, desactivar',
        confirmButtonColor: 'bg-yellow-500',
        icon: <RiCloseCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-yellow-500" />
      };
    } else {
      return {
        title: '¿Activar motivo de rechazo?',
        description: 'Activar este motivo de rechazo permitirá que los procesos asociados puedan utilizarlo nuevamente. ¿Está seguro que desea continuar?',
        confirmButtonText: 'Sí, activar',
        confirmButtonColor: 'bg-green-500',
        icon: <RiCheckboxCircleLine className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />
      };
    }
  };

  const renderActions = (row) => [
    {
      label: 'Editar',
      icon: <RiEdit2Line className="text-green-700 h-4 w-4 " />,
      onClick: () => handleEdit(row),
      className: 'bg-green-100 hover:bg-green-200 cursor-pointer',
    },
    {
      label: row.status === 'Activo' ? 'Desactivar' : 'Activar',
      icon: row.status === 'Activo' ? <RiCloseCircleLine className="text-yellow-700 h-4 w-4 " /> : <RiCheckboxCircleLine className="text-green-700 h-4 w-4" />,
      onClick: () => handleToggleClick(row),
      className: row.status === 'Activo' ? 'bg-yellow-100 hover:bg-yellow-200 cursor-pointer' : 'bg-green-100 hover:bg-green-200 cursor-pointer',
    }
  ];


  return (
    <div>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100 " >
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Motivos de rechazo
            </Typography>
            <Typography color="gray" className="mt-1">
              Lista de motivos de rechazo de solicitudes de permisos.
            </Typography>
          </div>
        </div>
      </CardHeader>

      <div className=''>
        {isLoadingInitial && !allRejectionReasons.length ? (
          <LoadingIndicator />
        ) : (
          <LeaveTable
            columns={rejectionReasonColumns}
            data={data}
            actions={renderActions}
            onAddNew={handleOpenModalForm}
            showFilters={false}
            showExport={false}
            showAddNew={true}
            showColumnOptions={false}
            showActions={true}
            onDelete={null}
            getCellStyle={getCellStyle}
          />
        )}
        {/* <Dialog2
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
        /> */}

        <Dialog2
          isOpen={isOpenToggleDialog}
          setIsOpen={setIsOpenToggleDialog}
          title={getToggleMessage(selectedReason?.status).title}
          description={getToggleMessage(selectedReason?.status).description}
          confirmButtonText={getToggleMessage(selectedReason?.status).confirmButtonText}
          cancelButtonText="Cancelar"
          onConfirm={handleConfirmToggle}
          onCancel={handleCancelToggle}
          confirmButtonColor={getToggleMessage(selectedReason?.status).confirmButtonColor}
          cancelButtonColor="border-gray-400"
          icon={getToggleMessage(selectedReason?.status).icon}
        />

        <ModalForm
          isOpen={isOpenModalForm}
          setIsOpen={setIsOpenModalForm}
          title={isEditing ? 'Editar motivo de rechazo' : 'Agregar nuevo motivo de rechazo'}
          icon={<TbMessageX className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
          maxWidth='max-w-2xl'
        >
          <RejectionReasonForm
            rejectionReason={currentRejectionReason}
            isEditing={isEditing}
            onSubmit={handleSubmit}
            onCancel={handleCloseModalForm}
            formErrors={formErrors}
          />
        </ModalForm>
      </div>
    </div>
  );
};

export default RejectionReason;
