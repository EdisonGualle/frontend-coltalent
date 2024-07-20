import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  FaHouseDamage, FaUmbrellaBeach,
  FaBriefcaseMedical, FaHome, FaUserMd,
  FaUniversity, FaPlus, FaPlane, FaHospital,
  FaChild, FaGraduationCap, FaSuitcase,
  FaRegClock, FaInfoCircle
} from 'react-icons/fa';
import { FaHandshakeAngle } from "react-icons/fa6";
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import { fetchLeaveTypes } from '../../../redux/Leave/leaveTypeSlince';
import { createOneLeave } from '../../../redux/Leave/leaveSince';
import { AlertContext } from '../../../contexts/AlertContext';
import ConfirmationModal from './Request/ConfirmationModal';
import { BsCalendarCheck, BsCalendarX } from "react-icons/bs";
import { BsClock, BsClockHistory } from "react-icons/bs";


// Mapping of string names to icon components
const iconMap = {
  FaHouseDamage,
  FaUmbrellaBeach,
  FaBriefcaseMedical,
  FaHome,
  FaUserMd,
  FaUniversity,
  FaPlus,
  FaPlane,
  FaHospital,
  FaChild,
  FaGraduationCap,
  FaSuitcase,
  FaRegClock,
  FaHandshakeAngle
};
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

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


  const panelRef = useRef(null);

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



  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    validateDates(value, endDate);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
    validateDates(startDate, value);
  };

  const validateDates = (start, end) => {
    let newErrors = { ...errors };
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Para comparar solo la fecha sin la hora

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate < today) {
      newErrors.start_date = 'La fecha de inicio debe ser una fecha futura.';
    } else {
      delete newErrors.start_date;
    }

    if (endDate < today) {
      newErrors.end_date = 'La fecha de fin debe ser una fecha futura.';
    } else {
      delete newErrors.end_date;
    }

    if (endDate < startDate) {
      newErrors.end_date = 'La fecha de fin debe ser posterior o igual a la fecha de inicio.';
    } else {
      delete newErrors.end_date;
    }

    if (selectedLeave && selectedLeave.max_duration) {
      const maxDuration = selectedLeave.max_duration;
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day

      if (diffDays > maxDuration) {
        newErrors.end_date = `La duración del permiso no debe exceder los ${maxDuration} días.`;
      } else if (!newErrors.end_date) {
        delete newErrors.end_date;
      }
    }

    if (selectedLeave && selectedLeave.advance_notice_days) {
      const advanceNoticeDays = selectedLeave.advance_notice_days;
      const diffTimeAdvance = startDate - today;
      const diffDaysAdvance = Math.ceil(diffTimeAdvance / (1000 * 60 * 60 * 24));

      if (diffDaysAdvance < advanceNoticeDays) {
        newErrors.start_date = `Debe solicitar el permiso con al menos ${advanceNoticeDays} ${advanceNoticeDays === 1 ? 'día' : 'días'} de anticipación.`;
      } else {
        delete newErrors.start_date;
      }
    }

    setErrors(newErrors);
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
    let newErrors = { ...errors };

    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(startHours, startMinutes, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHours, endMinutes, 0, 0);

    if (endTime <= startTime) {
      // Si la hora de fin es anterior a la hora de inicio, asumir que es al día siguiente
      endTime.setDate(endTime.getDate() + 1);
    }

    const duration = (endTime - startTime) / (1000 * 60); // duración en minutos

    if (duration < 30) { // 30 minutos
      newErrors.end_time = 'La duración mínima del permiso debe ser de 30 minutos.';
    } else {
      delete newErrors.end_time;
    }

    if (selectedLeave && selectedLeave.max_duration) {
      const [maxHours, maxMinutes] = selectedLeave.max_duration.split(':').map(Number);
      const maxDuration = maxHours * 60 + maxMinutes; // duración máxima en minutos

      if (duration > maxDuration) {
        newErrors.end_time = `La duración del permiso no debe exceder las ${maxHours} horas y ${maxMinutes} minutos.`;
      } else if (!newErrors.end_time) {
        delete newErrors.end_time;
      }
    }

    if (timeUnit === 'Horas' && selectedLeave.time_unit === 'Días') {
      const maxAllowedDuration = 7.5 * 60; // 7 horas y media en minutos
      if (duration > maxAllowedDuration) {
        newErrors.end_time = 'La duración del permiso no debe exceder las 7 horas y 30 minutos.';
      } else if (!newErrors.end_time) {
        delete newErrors.end_time;
      }
    }

    setErrors(newErrors);
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
      if (end <= start) {
        end.setDate(end.getDate() + 1); // consider it as the next day
      }
      const durationMinutes = (end - start) / (1000 * 60);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return `${hours} horas y ${minutes} minutos`;
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
  const handleRemoveAttachment = (e) => {
    e.preventDefault();
    setAttachment(null);
  }

  const leaveChunks = chunkArray(leaveTypes, 5);

  const togglePanel = (leave) => {
    setInfoPanelLeave(infoPanelLeave === leave ? null : leave);
  };


  // Nueva función para manejar el cambio de tipo de permiso
  const handleLeaveTypeChange = (leave) => {
    setSelectedLeave(leave);
    setTimeUnit(leave.time_unit === 'Horas' ? 'Horas' : 'Días');
    // Resetear campos y errores
    resetForm();
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
  
    if (!startDate) {
      newErrors.start_date = 'La fecha de inicio es requerida.';
    }
  
    if (!endDate && timeUnit === 'Días') {
      newErrors.end_date = 'La fecha de fin es requerida.';
    }
  
    if (!startTime && timeUnit === 'Horas') {
      newErrors.start_time = 'La hora de inicio es requerida.';
    }
  
    if (!endTime && timeUnit === 'Horas') {
      newErrors.end_time = 'La hora de fin es requerida.';
    }
  
    if (!reason) {
      newErrors.reason = 'La razón es requerida.';
    }
  
    if (selectedLeave && selectedLeave.requires_document === 'Si' && !attachment) {
      newErrors.attachment = 'El documento es requerido.';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsConfirmationOpen(true);
      setConfirmAction(() => async () => {
        const formData = new FormData();
        formData.append('employee_id', employee_id);
        formData.append('leave_type_id', selectedLeave.id);
        formData.append('start_date', startDate);
        if (timeUnit === 'Días') {
          formData.append('end_date', endDate);
        } else {
          formData.append('start_time', startTime);
          formData.append('end_time', endTime);
        }
        formData.append('reason', reason);
        if (attachment) {
          formData.append('attachment', attachment);
        }
  
        try {
          const resultAction = await dispatch(createOneLeave({ employeeId: employee_id, leave: formData }));
          unwrapResult(resultAction);
  
          // Resetear campos y errores
          setSelectedLeave(null);
          setTimeUnit('Horas');
          resetForm();
          showAlert('Solicitud creada correctamente', 'success', 3000);
        } catch (error) {
          const errorMsg = JSON.parse(error.message);
  
          if (errorMsg.msg) {
            showAlert(errorMsg.msg, 'error', 3000);
          }
  
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
    }
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
    <form className="px-6" onSubmit={handleSubmit}>
      {/* Parte del renderizado de los botones */}
      {leaveChunks.map((chunk, index) => {
        return (
          <div key={index} className="flex justify-center items-center flex-wrap mb-4">
            {chunk.map((leave, idx) => (
              <div
                key={idx}
                className={`relative p-4 bg-white text-gray-700 rounded-lg shadow-md m-2 flex flex-col items-center w-40 cursor-pointer transition-transform transform hover:scale-105 ${selectedLeave === leave ? 'border-2 border-blue-400 shadow-md' : ''}`}
                onClick={() => handleLeaveTypeChange(leave)}
              >
                <FaInfoCircle
                  className="absolute top-0 right-0 m-2 cursor-pointer text-gray-500 hover:text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePanel(leave);
                  }}
                />
                {React.createElement(iconMap[leave.icon] || FaRegClock, { className: "text-3xl mb-2" })}
                <span className="text-center text-sm font-semibold">{leave.name.toUpperCase()}</span>
              </div>
            ))}
          </div>
        );
      })}

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

                  <Input
                    label="Fecha de solicitud del permiso"
                    id="startDate"
                    type="date"
                    icon={BsCalendarCheck}
                    value={startDate}
                    onChange={handleStartDateChange}
                    error={errors.start_date}
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
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <Input
                    label="Fecha de inicio del permiso"
                    id="startDate"
                    type="date"
                    icon={BsCalendarCheck}
                    value={startDate}
                    onChange={handleStartDateChange}
                    error={errors.start_date}
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    label="Fecha de fin del permiso"
                    id="endDate"
                    type="date"
                    icon={BsCalendarX}
                    value={endDate}
                    onChange={handleEndDateChange}
                    error={errors.end_date}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}

      {selectedLeave && (
        <div className="flex space-x-4 mt-3">
          <div className="w-1/2">
            <Textarea
              label="Razón"
              id="reason"
              placeholder="Ingrese el motivo de la solicitud"
              value={reason}
              onChange={handleReasonChange}
              rows={2}
              error={errors.reason}
            />
          </div>
          <div className="w-1/2">
            <div className="mb-3">
              <label className="block text-base font-semibold text-gray-700 mb-1">
                Adjuntar Documento
              </label>
              <div className="flex justify-center items-center w-full  h-16 px-2 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <input
                  type="file"
                  name="file_upload"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  id="attachment"
                  onChange={handleAttachmentChange}
                />
                <label
                  htmlFor="attachment"
                  className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                >
                  {!attachment ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="font-medium text-gray-600">
                        Arrastra un documento para adjuntar, o{" "}
                        <span className="text-blue-600 underline">examinar</span>
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700">{attachment.name}</span>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </label>
              </div>
              {attachmentError && (
                <p className="mt-1 text-xs text-red-600">{attachmentError}</p>
              )}
              {errors.attachment && (
                <p className="mt-1 text-xs text-red-600">{errors.attachment}</p>
              )}
            </div>
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