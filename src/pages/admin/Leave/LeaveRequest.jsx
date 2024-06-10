import React, { useState, useEffect, useRef } from 'react';
import { FaUmbrellaBeach, FaBriefcaseMedical, FaHome, FaUserMd, FaUniversity, FaInfoCircle } from 'react-icons/fa';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import { calculateTotalTime } from './Utils/dateUtils';

const leaveTypes = [
  { type: 'COMPENSACION', icon: <FaBriefcaseMedical />, description: 'Descripción de COM dawd awd awdawd awdawdPENSACION' },
  { type: 'CARGO VACACIONES', icon: <FaUmbrellaBeach />, description: 'Descripción de VACACIONES' },
  { type: 'CALAMIDAD DOMESTICA', icon: <FaHome />, description: 'Descripción de CALAMIDAD DOMESTICA' },
  { type: 'ATENCION MEDICA', icon: <FaUserMd />, description: 'Descripción de ATENCION MEDICA' },
  { type: 'INSTITUCIONAL', icon: <FaUniversity />, description: 'Descripción de INSTITUCIONAL' }
];

const Request = () => {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [file, setFile] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // Simulación de datos de respuesta desde el backend
      setLeaves(leaveTypes);
    };

    fetchData();
  }, []);

  const togglePanel = (leave) => {
    setSelectedLeave(selectedLeave === leave ? null : leave);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setSelectedLeave(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [panelRef]);

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const leaveChunks = chunkArray(leaves, 5);

  const findLongestTextIndex = (array) => {
    let maxLength = 0;
    let maxIndex = 0;
    array.forEach((item, index) => {
      if (item.type.length > maxLength) {
        maxLength = item.type.length;
        maxIndex = index;
      }
    });
    return maxIndex;
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (e.target.value !== endDate) {
      setAllDay(true);
      setStartTime('');
      setEndTime('');
    }
    setTotalTime(calculateTotalTime(e.target.value, endDate, startTime, endTime, allDay));
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    if (e.target.value !== startDate) {
      setAllDay(true);
      setStartTime('');
      setEndTime('');
    }
    setTotalTime(calculateTotalTime(startDate, e.target.value, startTime, endTime, allDay));
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleAllDayChange = (e) => {
    setAllDay(e.target.checked);
    if (e.target.checked) {
      setStartTime('');
      setEndTime('');
    }
    setTotalTime(calculateTotalTime(startDate, endDate, startTime, endTime, e.target.checked));
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    setTotalTime(calculateTotalTime(startDate, endDate, e.target.value, endTime, allDay));
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
    setTotalTime(calculateTotalTime(startDate, endDate, startTime, e.target.value, allDay));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para manejar la solicitud
    console.log('Solicitud enviada');
    console.log('Archivo seleccionado:', file);
  };

  return (
    <div className="p-3 relative">
      {leaveChunks.map((chunk, index) => {
        const longestTextIndex = findLongestTextIndex(chunk);
        const adjustedChunk = [...chunk];
        const [longestTextItem] = adjustedChunk.splice(longestTextIndex, 1);
        adjustedChunk.splice(2, 0, longestTextItem);

        return (
          <div key={index} className="flex justify-center items-center flex-wrap mb-4">
            {adjustedChunk.map((leave, idx) => (
              <div key={idx} className="relative">
                <button
                  className="bg-white p-4 rounded-lg shadow-lg m-2 hover:bg-gray-100 transform hover:scale-105 transition-transform duration-200 ease-in-out flex flex-col items-center w-40"
                >
                  <span className="text-3xl text-gray-500 mb-2">{leave.icon}</span>
                  <span className="text-gray-500 font-semibold text-sm text-center">{leave.type}</span>
                </button>
                <FaInfoCircle
                  className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                  onClick={() => togglePanel(leave)}
                />
              </div>
            ))}
          </div>
        );
      })}

      <form className="px-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 pb-2">
          <Input
            label="Fecha de inicio"
            id="startDate"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <Input
            label="Fecha de fin"
            id="endDate"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
          />
          <Input
            label="Tiempo total"
            id="totalTime"
            value={totalTime}
            readOnly
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-2">
          <Textarea
            label="Motivo"
            id="reason"
            placeholder="Ingrese el motivo de la solicitud"
            value={reason}
            onChange={handleReasonChange}
            rows={2}
          />
          <div className="flex flex-col justify-end">
            <label className="mb-2 text-sm font-medium text-gray-700">Archivo</label>
            <div className="relative flex items-center justify-center p-5 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="file"
                id="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <span className="text-gray-500">{file ? file.name : "Seleccionar archivo"}</span>
            </div>
          </div>
        </div>
        {startDate && endDate && (
          <>
            {startDate === endDate && (
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={allDay}
                  onChange={handleAllDayChange}
                  className="mr-2"
                />
                <label htmlFor="allDay" className="mr-4">Todo el día</label>
                <input
                  type="checkbox"
                  id="defineHours"
                  checked={!allDay}
                  onChange={() => setAllDay(!allDay)}
                  className="mr-2"
                />
                <label htmlFor="defineHours">Definir horas</label>
                {!allDay && (
                   <div className="flex items-center px-2">
                     <span className="mx-2 text-gray-500">desde</span>
                   <div>
                     <input
                       type="time"
                       id="startTime"
                       className=" block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                       value={startTime}
                       onChange={handleStartTimeChange}
                     />
                   </div>
                   <span className="mx-2 text-gray-500">hasta</span>
                   <div>
                    
                     <input
                       type="time"
                       id="endTime"
                       className=" block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                       value={endTime}
                       onChange={handleEndTimeChange}
                     />
                   </div>
                 </div>
                )}
              </div>
            )}
          </>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg  hover:bg-blue-700 transition duration-200 ease-in-out float-right">
          Solicitar
        </button>
      </form>

      {selectedLeave && (
        <div ref={panelRef} className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-64 z-50 text-sm text-gray-700">
          <h2 className="font-bold text-blue-900 mb-1">{selectedLeave.type}</h2>
          <p>{selectedLeave.description}</p>
          <div className="absolute bottom-full right-4 w-0 h-0 border-b-8 border-b-white border-l-8 border-l-transparent border-r-8 border-r-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default Request;
