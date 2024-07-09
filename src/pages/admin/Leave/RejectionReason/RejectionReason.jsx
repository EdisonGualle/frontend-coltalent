import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { CardHeader, Typography } from "@material-tailwind/react";
import { RiEdit2Line} from 'react-icons/ri';
import LeaveTable from '../components/Table/LeaveTable';
import rejectionReasonColumns from './Table/rejectionReasonColumns';
import Dialog2 from '../../../../components/ui/Dialog2';
import { AlertContext } from '../../../../contexts/AlertContext';
import { fetchRejectionReasons, deleteOneRejectionReason, updateOneRejectionReason, createNewRejectionReason } from '../../../../redux/Leave/rejectionReasonSlince';
import SkeletonTable from '../components/Table/SkeletonTable';
import ModalForm from '../../../../components/ui/ModalForm';
import { TbMessageX } from "react-icons/tb";
import RejectionReasonForm from './RejectionReasonForm';

const RejectionReason = () => {
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const { rejectionReasons, status, hasFetchedOnce  } = useSelector((state) => state.rejectionReason);
  const [data, setData] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);

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
      dispatch(fetchRejectionReasons())
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
      setData(rejectionReasons);
    }
  }, [rejectionReasons, status]);

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
  
  const handleCancelDelete = () => setIsOpenDialogDelete(false);
  const handleClickDelete = (ids) => {
    setSelectedIds(ids);
    setIsOpenDialogDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      for (const rejectionReasonId of selectedIds) {
        const resultAction = await dispatch(deleteOneRejectionReason(rejectionReasonId));
        unwrapResult(resultAction);
      }
      setSelectedIds([]); // Limpiar los IDs seleccionados después de eliminar
      dispatch(fetchRejectionReasons());
      showAlert(`Registro${selectedIds.length > 1 ? 's' : ''} eliminado${selectedIds.length > 1 ? 's' : ''} correctamente`, 'success');
    } catch (error) {
      showAlert('Ocurrió un error al intentar eliminar el registro', 'error');
    } finally {
      setIsOpenDialogDelete(false);
    }
  };

  const handleEdit = (row) => {
    const rejectionReason = rejectionReasons.find(reason => reason.id === row.id);
    if (rejectionReason) {
      handleOpenEditModalForm(rejectionReason);
    }
  };

  const handleView = (row) => {
    const rejectionReason = rejectionReasons.find(reason => reason.id === row.id);
    if (rejectionReason) {
      // Aquí puedes manejar la visualización del motivo de rechazo si es necesario
      console.log('Ver motivo de rechazo:', rejectionReason);
    }
  };

  const actions = [
    {
      label: 'Editar',
      icon: <RiEdit2Line className="text-green-600 h-4 w-4" />,
      onClick: handleEdit,
      className: 'bg-green-100 hover:bg-green-200 cursor-pointer',
    }
  ];

  return (
    <div>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0">
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
      {isLoadingInitial && !rejectionReasons.length ? (
          <SkeletonTable
            columns={rejectionReasonColumns}
            showFilters={false}
            showExport={false}
            showAddNew={true}
            showColumnOptions={false}
            actions={actions}
          />
        ) : (
          <LeaveTable
            columns={rejectionReasonColumns}
            data={data}
            actions={actions}
            onAddNew={handleOpenModalForm}
            showFilters={false}
            showExport={false}
            showAddNew={true}
            showColumnOptions={false}
            showActions={true}
            onDelete={handleClickDelete}
          />
        )}
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
