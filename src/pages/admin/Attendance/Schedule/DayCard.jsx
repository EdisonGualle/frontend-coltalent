import React from 'react';

const DayCard = ({ day, schedule }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 border-t-4 border-gray-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{day}</h2>
      {schedule && (schedule.entry || schedule.lunchStart || schedule.lunchEnd || schedule.exit) ? (
        <div className="space-y-2">
          {schedule.entry && <div className="flex justify-between text-sm text-gray-600"><span>Entrada:</span><span>{schedule.entry}</span></div>}
          {schedule.lunchStart && <div className="flex justify-between text-sm text-gray-600"><span>Inicio Almuerzo:</span><span>{schedule.lunchStart}</span></div>}
          {schedule.lunchEnd && <div className="flex justify-between text-sm text-gray-600"><span>Fin Almuerzo:</span><span>{schedule.lunchEnd}</span></div>}
          {schedule.exit && <div className="flex justify-between text-sm text-gray-600"><span>Salida:</span><span>{schedule.exit}</span></div>}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Descanso</p>
      )}
    </div>
  );
};

export default DayCard;
