import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import { fetchLeaveTypes } from '../../../redux/Leave/leaveTypeSlince';
import { createOneLeave } from '../../../redux/Leave/leaveSince';
import { AlertContext } from '../../../contexts/AlertContext';
import ConfirmationModal from './Request/ConfirmationModal';
import { BsCalendarCheck } from "react-icons/bs";
import { BsClock, BsClockHistory } from "react-icons/bs";
import { getConfigurations } from "../../../services/configurationService";
import { getEmployeeCalendar } from "../../../services/Calendar/calendarService";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
registerLocale("es", es); // Registrar el idioma español para react-datepicker
import DatePickerInput from "../../../components/ui/DatePickerInput";

import LeaveTypes from './LeaveTypes';
import FileUpload from './FileUpload';

// Mapping of string names to icon components

const Request = () => {
  const { id: employee_id } = useParams();
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);

  const { leaveTypes, status, hasFetchedOnce } = useSelector((state) => state.leaveType);

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [infoPanelLeave, setInfoPanelLeave] = useState(null); // Nuevo estado para el panel de información
  const [timeUnit, setTimeUnit] = useState('Horas'); // Estado para gestionar el tipo de permiso
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState(''); // Estado para gestionar la razón del permiso
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState('');
  const [errors, setErrors] = useState({}); // Estado para manejar los errores
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [configurations, setConfigurations] = useState({});
  const panelRef = useRef(null);

  const [employeeCalendar, setEmployeeCalendar] = useState([]);


  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const response = await getConfigurations();

        if (response.status && Array.isArray(response.data)) {
          const configData = {};
          response.data.forEach(config => {
            configData[config.key] = config.value;
          });
          setConfigurations(configData);
        }
      } catch (error) {
        throw new Error("Hubo un problema al obtener las configuraciones.");
      }
    };

    fetchConfigurations();
  }, []);

  useEffect(() => {
    const fetchEmployeeCalendar = async () => {
      try {
        const calendar = await getEmployeeCalendar(employee_id);
        setEmployeeCalendar(calendar);
      } catch (error) {
        throw new Error("Hubo un problema al obtener el calendario del empleado.");
      }
    };

    if (employee_id) {
      fetchEmployeeCalendar();
    }
  }, [employee_id]);

  useEffect(() => {
    if (!hasFetchedOnce && status !== 'loading') {
      dispatch(fetchLeaveTypes());
    }
  }, [dispatch, hasFetchedOnce, status]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setInfoPanelLeave(null); // Cierra el panel de información si se hace clic fuera de él
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [panelRef]);


  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setReason('');
    setAttachment(null);
    setAttachmentError('');
    setErrors({});
  };

  const handleTimeUnitChange = (e) => {
    setTimeUnit(e.target.value);
    // Resetear campos y errores
    resetForm();
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);

    let newErrors = {}; // Reiniciar errores

    if (!date) {
      newErrors.start_date = "Debe seleccionar una fecha válida.";
      setErrors(newErrors);
      return;
    }

    // Validar días de anticipación según el tipo de permiso
    if (selectedLeave && selectedLeave.advance_notice_days) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Asegurar que se comparen solo las fechas
      const selectedDate = new Date(date.setHours(0, 0, 0, 0));
      const diffDays = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24)); // Diferencia en días


      if (diffDays < selectedLeave.advance_notice_days) {
        newErrors.start_date = `Debe solicitar el permiso con al menos ${selectedLeave.advance_notice_days} ${selectedLeave.advance_notice_days === 1 ? "día" : "días"} de anticipación.`;
      }
    }

    // Validar si la fecha seleccionada es un día laboral
    const formattedDate = new Date(date.setHours(0, 0, 0, 0)).toISOString().split("T")[0];
    const calendarEntry = employeeCalendar.find((entry) => entry.date === formattedDate);

    if (!calendarEntry || calendarEntry.type !== "work_day") {
      newErrors.start_date = `La fecha seleccionada (${formattedDate}) no es válida: ${calendarEntry?.reason || "Día no laboral"}.`;
    }

    // Si se encuentran errores, actualizarlos
    if (Object.keys(newErrors).length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
      return;
    }

    // Si no hay errores, limpiar el estado de errores para la fecha
    setErrors((prevErrors) => {
      const { start_date, ...rest } = prevErrors;
      return rest;
    });

    // Validar otras dependencias como horas (si aplica en tu flujo actual).
    if (timeUnit === "Horas" && startTime) {
      validateTimes(startTime, endTime);
    }
  };


  const validateDates = (start, end) => {

    let newErrors = {}; // Reiniciar errores para esta validación
    const startDate = new Date(start.setHours(0, 0, 0, 0)); // Asegurar solo fecha
    const endDate = new Date(end.setHours(0, 0, 0, 0)); // Asegurar solo fecha

    // Validar el inicio
    const formattedStartDate = startDate.toISOString().split("T")[0]; // Formatear fecha a YYYY-MM-DD
    const startEntry = employeeCalendar.find((entry) => entry.date === formattedStartDate);

    if (!startEntry || startEntry.type !== "work_day") {
      newErrors.start_date = `La fecha de inicio (${formattedStartDate}) no es válida: ${startEntry?.reason || "Día no laboral"}.`;
    }

    // Validar el extremo
    const formattedEndDate = endDate.toISOString().split("T")[0]; // Formatear fecha a YYYY-MM-DD
    const endEntry = employeeCalendar.find((entry) => entry.date === formattedEndDate);

    if (!newErrors.start_date && (!endEntry || endEntry.type !== "work_day")) {
      newErrors.end_date = `La fecha de fin (${formattedEndDate}) no es válida: ${endEntry?.reason || "Día no laboral"}.`;
    }

    // Validar anticipación solo si no hay errores previos
    if (!newErrors.start_date && !newErrors.end_date && selectedLeave?.advance_notice_days) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const advanceNoticeDays = parseInt(selectedLeave.advance_notice_days, 10);
      const diffDaysAdvance = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

      if (diffDaysAdvance < advanceNoticeDays) {
        newErrors.start_date = `Debe solicitar el permiso con al menos ${advanceNoticeDays} ${advanceNoticeDays === 1 ? "día" : "días"} de anticipación.`;
      }
    }

    // Validar duración máxima solo si no hay errores previos
    if (!newErrors.start_date && !newErrors.end_date && selectedLeave?.max_duration) {
      const maxDuration = parseInt(selectedLeave.max_duration, 10);
      const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > maxDuration) {
        newErrors.end_date = `La duración del permiso no debe exceder los ${maxDuration} días.`;
      }
    }

    // Si no hay errores nuevos, limpiar todos los errores relacionados con fechas
    if (Object.keys(newErrors).length === 0) {
      delete errors.start_date;
      delete errors.end_date;
    }

    // Actualizar estado de errores
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors, // Añade o actualiza los errores relacionados con las fechas
    }));
  };


  const handleStartTimeChange = (e) => {
    const value = e.target.value;
    setStartTime(value);
    validateTimes(value, endTime);
  };

  const handleEndTimeChange = (e) => {
    const value = e.target.value;
    setEndTime(value);
    validateTimes(startTime, value);
  };


  const validateTimes = (start, end) => {
    let newErrors = {}; // Reiniciar errores


    if (!startDate) {
      newErrors.start_time = "Primero selecciona una fecha válida.";
      setErrors(newErrors);
      return;
    }


    // Validaciones 
    const formattedDate = new Date(startDate.setHours(0, 0, 0, 0)).toISOString().split("T")[0];
    const calendarEntry = employeeCalendar.find((entry) => entry.date === formattedDate);

    const schedule = calendarEntry.work_schedule;

    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    const startTime = new Date();
    startTime.setHours(startHours, startMinutes, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHours, endMinutes, 0, 0);

    // Aquí corregimos el problema asegurándonos de que los segundos y milisegundos sean 0
    const workStartTime = new Date();
    const workEndTime = new Date();
    const breakStartTime = new Date();
    const breakEndTime = new Date();

    const [workStartHours, workStartMinutes] = schedule.start_time.split(":").map(Number);
    const [workEndHours, workEndMinutes] = schedule.end_time.split(":").map(Number);
    const [breakStartHours, breakStartMinutes] = schedule.break_start_time.split(":").map(Number);
    const [breakEndHours, breakEndMinutes] = schedule.break_end_time.split(":").map(Number);

    workStartTime.setHours(workStartHours, workStartMinutes, 0, 0);
    workEndTime.setHours(workEndHours, workEndMinutes, 0, 0);
    breakStartTime.setHours(breakStartHours, breakStartMinutes, 0, 0);
    breakEndTime.setHours(breakEndHours, breakEndMinutes, 0, 0);

    // Validar si `startTime` está dentro del horario laboral (incluyendo límites)
    if (startTime < workStartTime || startTime > workEndTime) {
      newErrors.start_time = `La hora de inicio debe estar dentro del horario laboral (${schedule.start_time} - ${schedule.end_time}).`;
    }

    // Validar si `endTime` está dentro del horario laboral (incluyendo límites)
    if (endTime < workStartTime || endTime > workEndTime) {
      newErrors.end_time =  `La hora de fin debe estar dentro del horario laboral (${schedule.start_time} - ${schedule.end_time}).`;
    }

    // Validar si `startTime` cae en el horario de descanso
    if (startTime >= breakStartTime && startTime < breakEndTime) {
      newErrors.start_time = `La hora de inicio no puede estar dentro del horario de descanso (${schedule.break_start_time} - ${schedule.break_end_time}).`;
    }

    // Validar si `endTime` cae en el horario de descanso
    if (endTime > breakStartTime && endTime <= breakEndTime) {
      newErrors.end_time = `La hora de fin no puede estar dentro del horario de descanso (${schedule.break_start_time} - ${schedule.break_end_time}).`;
    }

    // Validar que `endTime` sea mayor que `startTime`
    if (startTime >= endTime) {
      newErrors.end_time = "La hora de fin debe ser mayor que la hora de inicio.";
    }

    // Validar que se cumpla el minimo de horas requeridas para el permiso en base a la configuración max_duration_hours_min
    const [minHours, minMinutes] = configurations.max_duration_hours_min.split(":").map(Number);
    const minDuration = minHours * 60 + minMinutes;
    const duration = (endTime - startTime) / (1000 * 60);
    if (duration < minDuration) {
      newErrors.end_time = `La duración mínima del permiso debe ser de ${formatDuration(minDuration)}.`;
    }

    // Validar que no se pase de la duración máxima permitida para el permiso (dependiendo si es por horas o días)
    let maxDuration;

    if (selectedLeave.time_unit === "Días") {
      const [maxHours, maxMinutes] = configurations.max_duration_hours_max.split(":").map(Number);
      maxDuration = maxHours * 60 + maxMinutes;
    } else if (timeUnit === "Horas") {
      const [maxHours, maxMinutes] = selectedLeave.max_duration.split(":").map(Number);
      maxDuration = maxHours * 60 + maxMinutes;
    } else {
      return;
    }

    // Validar si la duración calculada excede la duración máxima permitida
    if (duration > maxDuration) {
      newErrors.end_time = `La duración del permiso no debe exceder de ${formatDuration(maxDuration)}.`;
    }

    // Si no hay errores, eliminarlos
    if (Object.keys(newErrors).length === 0) {
      delete errors.start_time;
      delete errors.end_time;
    }

    // Actualizar errores en el estado
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors, // Actualizar errores relacionados con el tiempo
    }));
  };

  // Función auxiliar para formatear la duración
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let message = '';
    if (hours > 0) {
      message += `${hours} ${hours > 1 ? 'horas' : 'hora'}`;
    }
    if (mins > 0) {
      if (hours > 0) message += ' y ';
      message += `${mins} ${mins > 1 ? 'minutos' : 'minuto'}`;
    }
    return message;
  };

  const calculateTotalDuration = () => {
    if (timeUnit === 'Días' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
      return `${diffDays} ${diffDays > 1 ? 'días' : 'día'}`;
    } else if (timeUnit === 'Horas' && startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      const start = new Date();
      start.setHours(startHours, startMinutes, 0, 0);
      const end = new Date();
      end.setHours(endHours, endMinutes, 0, 0);

      if (end < start) {
        end.setDate(end.getDate() + 1); // Considerar como el siguiente día
      } else if (end.getTime() === start.getTime()) {
        // Si las horas de inicio y fin son exactamente iguales
        return `0 horas y 0 minutos`;
      }

      const durationMinutes = (end - start) / (1000 * 60);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      // Casos para mostrar diferentes formatos
      if (hours > 0 && minutes > 0) {
        return `${hours} horas y ${minutes} minutos`;
      } else if (hours > 0) {
        return `${hours} ${hours > 1 ? 'horas' : 'hora'}`;
      } else if (minutes > 0) {
        return `${minutes} ${minutes > 1 ? 'minutos' : 'minuto'}`;
      } else {
        return `0 horas y 0 minutos`;
      }

    }
    return '';
  };


  const handleReasonChange = (e) => {
    const value = e.target.value;
    setReason(value);

    let newErrors = { ...errors };
    if (value) {
      delete newErrors.reason;
    }
    setErrors(newErrors);
  };


  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    let newErrors = { ...errors };
    if (file && file.size > 5242880) {
      setAttachmentError('El archivo no debe exceder los 5 MB');
      newErrors.attachment = 'El archivo no debe exceder los 5 MB';
      setAttachment(null);
    } else {
      setAttachment(file);
      setAttachmentError('');
      delete newErrors.attachment;
    }
    setErrors(newErrors);
  };

  const handleRemoveAttachment = () => {
    // Si el permiso requiere documento, se debe mostrar el error
    if (selectedLeave?.requires_document === "Si") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        attachment: "El documento es requerido.",
      }));
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.attachment; // Elimina el error si no es necesario
        return newErrors;
      });
    }
  };

  const togglePanel = (leave) => {
    setInfoPanelLeave(infoPanelLeave === leave ? null : leave);
  };

  const handleLeaveTypeChange = (leave) => {
    // Reinicia todos los errores y valores del formulario
    setErrors({});
    resetForm();

    // Configura el nuevo permiso seleccionado
    setSelectedLeave(leave);
    setTimeUnit(leave.time_unit === 'Horas' ? 'Horas' : 'Días');

    // Limpia y revalida fechas si ya hay valores seleccionados
    if (startDate || endDate) {
      setStartDate('');
      setEndDate('');
    }

    // Si hay reglas específicas para documentos, actualiza los errores
    if (leave.requires_document !== 'Si') {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.attachment;
        return newErrors;
      });
    }

  };

  const getDurationColor = () => {
    if (errors.end_time || errors.start_time || errors.end_date || errors.start_date) {
      return 'text-red-600';
    }
    return 'text-gray-700';
  };

  if (status === 'loading') {
    return <div className="loading">Cargando...</div>;
  }

  if (status === 'failed') {
    return <div>Error cargando los tipos de permiso.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    // Validaciones básicas de campos requeridos
    if (!startDate) newErrors.start_date = 'La fecha de inicio es requerida.';
    if (!endDate && timeUnit === 'Días') newErrors.end_date = 'La fecha de fin es requerida.';
    if (!startTime && timeUnit === 'Horas') newErrors.start_time = 'La hora de inicio es requerida.';
    if (!endTime && timeUnit === 'Horas') newErrors.end_time = 'La hora de fin es requerida.';
    if (!reason) newErrors.reason = 'La razón es requerida.';
    if (selectedLeave?.requires_document === "Si" && !attachment) {
      newErrors.attachment = 'El documento es requerido.';
    }

    // Convertir fechas al formato esperado (YYYY-MM-DD)
    const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
    const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

    // Crear instancia de FormData
    const formData = new FormData();

    // Agregar valores al FormData
    formData.append('employee_id', employee_id || '');
    formData.append('leave_type_id', selectedLeave?.id || '');
    formData.append('start_date', formattedStartDate || '');
    if (timeUnit === 'Días') {
      formData.append('end_date', formattedEndDate || '');
    } else {
      formData.append('start_time', startTime || '');
      formData.append('end_time', endTime || '');
    }
    formData.append('reason', reason || '');
    if (attachment) {
      formData.append('attachment', attachment);
    }

    // Lógica para enviar el formulario
    setIsConfirmationOpen(true);
    setConfirmAction(() => async () => {
      try {
        await dispatch(createOneLeave({ employeeId: employee_id, leave: formData })).then(unwrapResult);
        // Resetear campos y mostrar mensaje de éxito
        resetForm();
        setSelectedLeave(null);
        setTimeUnit('Horas');
        showAlert('Solicitud creada correctamente', 'success', 3000);
      } catch (error) {
        const errorMsg = JSON.parse(error.message);
        if (errorMsg.msg) showAlert(errorMsg.msg, 'error', 3000);

        if (errorMsg.errors) {
          const backendErrors = errorMsg.errors;
          let newErrors = {};
          for (const [key, value] of Object.entries(backendErrors)) {
            newErrors[key] = value[0];
          }
          setErrors(newErrors);
        }
      }
    });
  };


  // Funciones de confirmación y cancelación
  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction();
    }
    setIsConfirmationOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmationOpen(false);
    setConfirmAction(null);
  };

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      {/* Parte del renderizado de los botones */}
      <LeaveTypes
        leaveTypes={leaveTypes}
        selectedLeave={selectedLeave}
        togglePanel={togglePanel}
        handleLeaveTypeChange={handleLeaveTypeChange} // Añade esta prop
      />

      {/* Panel de información */}
      {infoPanelLeave && (
        <div ref={panelRef} className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-64 z-50 text-sm text-gray-700">
          <h2 className="font-bold text-blue-900 mb-1">{infoPanelLeave.name}</h2>
          <p>{infoPanelLeave.description}</p>
          <div className="absolute bottom-full right-4 w-0 h-0 border-b-8 border-b-white border-l-8 border-l-transparent border-r-8 border-r-transparent"></div>
        </div>
      )}

      {selectedLeave && (
        <div className="flex items-center mb-4">
          {selectedLeave.time_unit !== 'Horas' && (
            <>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Días"
                  checked={timeUnit === 'Días'}
                  onChange={handleTimeUnitChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm">Solicitar por días</span>
              </label>
              <label className="flex items-center ms-2">
                <input
                  type="radio"
                  value="Horas"
                  checked={timeUnit === 'Horas'}
                  onChange={handleTimeUnitChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm">Solicitar por horas</span>
              </label>
            </>
          )}
          {selectedLeave.time_unit === 'Horas' && (
            <label className="flex items-center">
              <input
                type="radio"
                value="Horas"
                checked
                readOnly
                className="form-radio h-4 w-4 text-blue-600 "
              />
              <span className="ml-2 text-sm">Solicitar por horas</span>
            </label>
          )}
        </div>
      )}

      {/* Inputs dinámicos según el tipo de permiso */}
      {selectedLeave && (
        <>
          {timeUnit === 'Horas' && (
            <>

              <div className="flex space-x-4">
                <div className="w-1/2">

                  <DatePickerInput
                    label="Fecha solicitada"
                    selected={startDate ? new Date(startDate) : null}
                    onChange={(date) => {
                      setStartDate(date);
                      handleStartDateChange(date); // Llamar a la validación al cambiar la fecha
                    }}
                    startDate={startDate ? new Date(startDate) : null}
                    placeholderText="Selecciona una fecha"
                    minDate={new Date()}
                    maxDate={
                      configurations.max_days_for_leave
                        ? new Date(
                          new Date().setDate(
                            new Date().getDate() + parseInt(configurations.max_days_for_leave)
                          )
                        )
                        : null
                    }
                    dateFormat="d 'de' MMMM 'de' yyyy"
                    locale="es"
                    errorStartDate={errors.start_date}
                    icon={BsCalendarCheck}
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    label="Hora de inicio"
                    id="startTime"
                    type="time"
                    icon={BsClock}
                    value={startTime}
                    onChange={handleStartTimeChange}
                    error={errors.start_time}
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    label="Hora de fin"
                    id="endTime"
                    type="time"
                    icon={BsClockHistory}
                    value={endTime}
                    onChange={handleEndTimeChange}
                    error={errors.end_time}
                  />
                </div>
              </div>
            </>
          )}
          {timeUnit === 'Días' && (
            <>
              {/* Nuevo Input con DatePicker */}
              <DatePickerInput
                label="Rango de fechas solicitadas"
                selected={startDate ? new Date(startDate) : null}
                onChange={(update) => {
                  const [start, end] = update;
                  setStartDate(start);
                  setEndDate(end);

                  if (start && end) {
                    validateDates(start, end);
                  } else if (start) {
                    validateDates(start, start);
                  }
                }}
                startDate={startDate ? new Date(startDate) : null}
                endDate={endDate ? new Date(endDate) : null}
                selectsRange
                placeholderText="Selecciona un rango de fechas"
                minDate={new Date()}
                maxDate={
                  configurations.max_days_for_leave
                    ? new Date(
                      new Date().setDate(
                        new Date().getDate() + parseInt(configurations.max_days_for_leave)
                      )
                    )
                    : null
                }
                dateFormat="d 'de' MMMM 'de' yyyy"
                locale="es"
                errorStartDate={errors.start_date} // Mostrar error en fecha inicial
                errorEndDate={errors.end_date} // Mostrar error en fecha final
                icon={BsCalendarCheck}
              />
            </>
          )}
        </>
      )}
      {selectedLeave && (
        <div className="flex space-x-4 mt-3">
          <div className="w-1/2">
            <Textarea
              label="Motivo"
              id="reason"
              placeholder="Ingrese el motivo de la solicitud"
              value={reason}
              onChange={handleReasonChange}
              rows={2}
              error={errors.reason}
            />
          </div>
          <div className="w-1/2">
            <FileUpload
              attachment={attachment}
              setAttachment={setAttachment}
              attachmentError={errors.attachment} // Control del error desde el componente principal
              handleAttachmentChange={handleAttachmentChange}
              handleRemoveAttachment={handleRemoveAttachment} // Lógica de eliminación conectada al formulario
            />

          </div>
        </div>
      )}

      {/* Boton */}
      {selectedLeave && (
        <div className="flex items-center justify-between my-2">
          <div>
            {calculateTotalDuration() && (
              <span className={` ${getDurationColor()}`}>
                <span className='font-semibold'> Duración del permiso: </span>{calculateTotalDuration()}
              </span>
            )}
          </div>
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out ${Object.keys(errors).length ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={Object.keys(errors).length > 0}
          >
            Solicitar permiso
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

    </form>
  );
};

export default Request;