import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const WorkScheduleForm = ({ workSchedule, setWorkSchedule }) => {
  const daysOfWeek = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  // Estado para controlar la visibilidad de los días
  const [visibleDays, setVisibleDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });

  const toggleDayVisibility = (day) => {
    setVisibleDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day]
    }));
  };

  const handleScheduleChange = (day, field, value) => {
    setWorkSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: {
        ...prevSchedule[day],
        [field]: value
      }
    }));
  };

  const renderWorkScheduleInputs = () => {
    return Object.keys(daysOfWeek).map((day) => (
      <div key={day} className="mb-4 bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleDayVisibility(day)}
          className="w-full flex items-center justify-between text-left font-medium text-gray-700 capitalize p-3 focus:outline-none hover:bg-gray-100 rounded-t-lg transition-colors duration-200"
        >
          <span>{daysOfWeek[day]}</span>
          {visibleDays[day] ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {visibleDays[day] && (
        <div className="p-4 bg-gray-50 rounded-b-lg">
        <div className="grid grid-cols-4 gap-4">
          {/* Hora de entrada */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-600">Hora de entrada:</label>
            <input
              type="time"
              value={workSchedule[day].start_time}
              onChange={(e) => handleScheduleChange(day, 'start_time', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
            />
          </div>
      
          {/* Hora de salida */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-600">Hora de salida:</label>
            <input
              type="time"
              value={workSchedule[day].end_time}
              onChange={(e) => handleScheduleChange(day, 'end_time', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
            />
          </div>
      
          {/* Inicio del almuerzo */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-600">Inicio del almuerzo:</label>
            <input
              type="time"
              value={workSchedule[day].lunch_start_time}
              onChange={(e) => handleScheduleChange(day, 'lunch_start_time', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
            />
          </div>
      
          {/* Fin del almuerzo */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-600">Fin del almuerzo:</label>
            <input
              type="time"
              value={workSchedule[day].lunch_end_time}
              onChange={(e) => handleScheduleChange(day, 'lunch_end_time', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
            />
          </div>
        </div>
      </div>
      
        )}
      </div>
    ));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
      {renderWorkScheduleInputs()}
    </div>
  );
};

export default WorkScheduleForm;
