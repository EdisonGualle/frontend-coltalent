import React, { useState, useEffect, useContext } from 'react';
import { RiAddLine, RiBriefcase2Line } from "react-icons/ri";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import ModalForm from '../../../../components/ui/ModalForm';
import PositionForm from './PositionForm';
import { AlertContext } from '../../../../contexts/AlertContext';
import { unwrapResult } from '@reduxjs/toolkit';
import { createNewPosition, fetchPositions } from '../../../../redux/Organization/PositionSlice';
import MotionWrapper from '../../../../components/ui/MotionWrapper';
import Skeleton from '../../../../components/Table/Skeleton';
import OptionsColumn from './Table/OptionsColumn';
import OrganizationTable from '../components/OrganizationTable';
import { positionColumnsFixed, positionColumnsVisible, positionColumnsGeneral, positionColumnsFilters } from './Table/PositionColumns';
import getPositionColumnsStyles from './Table/positionColumnsStyles';

const PositionIndex = () => {
  const dispatch = useDispatch();
  const { fetchAllStatus, positions, hasFetchedAll } = useSelector(state => state.position);
  const [isOpen, setIsOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { showAlert } = useContext(AlertContext);

  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchPositions());
    }
  }, [dispatch, hasFetchedAll]);


  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (positionData) => {
    try {
      const actionResult = await dispatch(createNewPosition(positionData));
      unwrapResult(actionResult);
      handleClose();
      setFormErrors({});
      showAlert('Cargo creado correctamente', 'success');
    } catch (error) {
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        name: errors.name ? errors.name[0] : '',
        function: errors.function ? errors.function[0] : '',
        unit_id: errors.unit_id ? errors.unit_id[0] : '',
        direction_id: errors.direction_id ? errors.direction_id[0] : '',
        is_manager: errors.is_manager ? errors.is_manager[0] : '',
      };

      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        showAlert('Error al crear el cargo', 'error');
      }
    }
  };

  return (
    <div>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de Cargos
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver información sobre todos los cargos
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors rounded-xl py-2 px-5" size="sm"
              onClick={handleOpen}>
              <RiAddLine className="h-5 w-5" />
              <span className="font-semibold">Nuevo cargo</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Tabla */}
      <MotionWrapper keyProp="position-table">
        {fetchAllStatus === 'loading' && positions.length === 0 ? (
          <Skeleton />
        ) : (
          <OrganizationTable
          allColumns={positionColumnsGeneral}
          columns={[...positionColumnsFixed, ...positionColumnsVisible]}
          fixedColumns={positionColumnsFixed}
          getCellStyle={getPositionColumnsStyles}
          data={positions}
          dynamicFilterColumns={positionColumnsFilters}
          showFilters={false}
          showAddNew={false}
          showActions={true}
          showColumnOptions={true}
          actions={(row) => <OptionsColumn position={row} />}
          />
        )}
      </MotionWrapper>

      {/* Modal para crear un nuevo cargo */}
      <ModalForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Crear nuevo cargo"
        icon={<RiBriefcase2Line className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
        maxWidth="max-w-lg"
      >
        <PositionForm
          isEditing={false}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          formErrors={formErrors}
        />
      </ModalForm>
    </div>
  );
};

export default PositionIndex;
