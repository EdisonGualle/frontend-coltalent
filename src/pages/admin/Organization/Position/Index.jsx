import React, { useState, useEffect, useContext } from 'react';
import { RiAddLine } from "react-icons/ri";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import PositionTable from './Table/PositionTable';
import ModalForm from '../../../../components/ui/ModalForm';
import PositionForm from './PositionForm';
import { AlertContext } from '../../../../contexts/AlertContext';
import { unwrapResult } from '@reduxjs/toolkit';
import { createNewPosition, fetchPositions } from '../../../../redux/Organization/PositionSlice';
import { RiBriefcase2Line } from "react-icons/ri";

const PositionIndex = () => {
  const dispatch = useDispatch();
  // Selector para obtener el estado de los cargos
  const { status } = useSelector(state => state.position);
  const [isOpen, setIsOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { showAlert } = useContext(AlertContext);

  // Efecto para cargar los cargos
  useEffect(() => {
    // Si el estado es idle, se realiza la petición para obtener los cargos
    if (status === 'idle') {
      dispatch(fetchPositions());
    }
  }, [status, dispatch]);

  // Funciones para manejar la apertura y cierre del modal
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (positionData) => {
    try {
      // Despachar la acción para crear un nuevo cargo
      const actionResult = await dispatch(createNewPosition(positionData));
      // Desempaquetar el resultado de la acción
      unwrapResult(actionResult);
      handleClose();
      setFormErrors({});
      showAlert('Cargo creado correctamente', 'success');
    } catch (error) {
      // Manejo de errores
      const errorObject = JSON.parse(error.message);
      const { errors = {} } = errorObject || {};

      const formErrors = {
        name: errors.name ? errors.name[0] : '',
        function: errors.function ? errors.function[0] : '',
        unit_id: errors.unit_id ? errors.unit_id[0] : '',
      };
      if (Object.values(formErrors).some(Boolean)) {
        setFormErrors(formErrors);
      } else {
        showAlert('Error al crear el cargo', 'error');
      }
    }
  };

  return (
    <>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de Cargos
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver informacion sobre todos los cargos
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3 bg-secondary-500 text-white hover:bg-secondary-600 transition-colors rounded-xl py-2 px-5" size="sm"
              onClick={handleOpen}>
              <RiAddLine className="h-5 w-5" />
              <span className="font-semibold">Nueva cargo</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Tabla */}
      <PositionTable />

      {/* Modal para crear un nuevo carg*/}
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
    </>
  );
};

export default PositionIndex;