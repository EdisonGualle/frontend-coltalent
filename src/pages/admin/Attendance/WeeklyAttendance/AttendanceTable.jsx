// src/components/AttendanceTable.js
import React, { useState, useEffect } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { MdOutlineFreeBreakfast, MdRestaurantMenu } from 'react-icons/md';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatMonth = (date) => {
  const month = format(date, 'MMM', { locale: es });
  return capitalizeFirstLetter(month);
};

const AttendanceTable = () => {
  const [expanded, setExpanded] = useState(null);
  const [days, setDays] = useState([]);

  useEffect(() => {
    // Obtener la fecha de hoy
    const today = new Date();

    // Obtener el inicio de la semana (domingo)
    const start = startOfWeek(today, { weekStartsOn: 0 });

    // Crear una matriz para la semana actual con diferentes casos de marcaciones
    const currentWeek = [
      {
        hours: '0h 00m',
      },
      {
        hours: '10h 17m',
        timeRange: '08:00 - 18:17',
        punchIn: '2024-05-27 08:00',
        punchOut: '2024-05-27 18:17',
        lunchIn: '2024-05-27 12:00',
        lunchOut: '2024-05-27 12:30',
        fullTime: true,
        completedHours: true,
      },
      {
        hours: '5h 00m',
        timeRange: '09:00 - 14:00',
        punchIn: '2024-05-28 09:00',
        punchOut: '2024-05-28 14:00',
        fullTime: false,
        completedHours: false,
      },
      {
        hours: '6h 30m',
        timeRange: '09:00 - 15:30',
        punchIn: '2024-05-29 09:00',
        punchOut: '2024-05-29 15:30',
        lunchOut: '2024-05-29 12:00',
      },
      {
        hours: '0h 00m',
      },
      {
        hours: '0h 00m',
      },
      {
        hours: '0h 00m',
      },
    ];

    const daysWithDates = currentWeek.map((day, index) => {
      const date = addDays(start, index);
      return {
        day: capitalizeFirstLetter(format(date, 'eee', { locale: es })), // Día de la semana (abreviado) en español con la primera letra en mayúscula
        date: `${format(date, 'dd')} ${formatMonth(date)}`, // Fecha en formato 'dd MMM' en español con la primera letra del mes en mayúscula
        ...day,
      };
    });

    setDays(daysWithDates);
  }, []);

  const handleRowClick = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className=" mx-auto p-2 m-4 bg-gray-50 rounded-xl shadow-md">
      <div className="space-y-2">
        {days.map((day, index) => (
          <div key={index} className={`rounded-xl ${expanded === index ? 'border-2 border-gray-400' : ''} ${index === 0 && expanded === index ? 'rounded-t-xl' : ''} ${index === days.length - 1 && expanded === index ? 'rounded-b-xl' : ''}`}>
            <div
              className={`flex items-center justify-between p-2 cursor-pointer rounded-xl ${index === 0 || index === days.length - 1 ? 'bg-gray-200' : day.completedHours === false ? 'bg-rose-100' : 'bg-white'} flex-wrap`}
              onClick={() => handleRowClick(index)}
            >
              <div className="flex items-center w-full md:w-auto">
                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl ${day.completedHours === false ? 'bg-rose-400' : expanded === index ? 'bg-gray-500' : 'bg-gray-100'}`}>
                  <span className={`text-sm ${day.completedHours === false ? 'text-white' : expanded === index ? 'text-white' : 'text-gray-700'} font-bold`}>{day.day}</span>
                  <span className={`text-xs ${day.completedHours === false ? 'text-white' : expanded === index ? 'text-white' : 'text-gray-500'}`}>{day.date}</span>
                </div>
                <div className="ml-4">
                  <div className="text-md font-medium text-gray-800">{day.hours}</div>
                  {day.timeRange && <div className="text-xs text-gray-500">{day.timeRange}</div>}
                </div>
              </div>
              {day.fullTime !== undefined && (
                <div className="ml-auto text-right">
                  {day.fullTime ? (
                    <div className="flex items-center text-green-500">
                      <AiOutlineCheckCircle className="mr-1" />
                      <span className="text-xs text-gray-600">Tiempo completo</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <AiOutlineCloseCircle className="mr-1" />
                      <span className="text-xs text-gray-600">Tiempo incompleto</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {expanded === index && (
              <div className="p-2 bg-white border-t border-gray-200 rounded-b-xl">
                {day.punchIn && (
                  <div className="flex justify-between w-full">
                    {day.punchIn && (
                      <div className="flex items-center flex-col">
                        <div className="flex items-center">
                          <FaSignInAlt className="text-gray-500 mr-1 text-xs" />
                          <span className="text-xs text-gray-700">Entrada</span>
                        </div>
                        <span className="text-xs text-gray-500">{day.punchIn}</span>
                      </div>
                    )}
                    {day.punchOut && (
                      <>
                        <div className="flex items-center border-l border-gray-200 mx-4"></div>
                        <div className="flex items-center flex-col">
                          <div className="flex items-center">
                            <FaSignOutAlt className="text-gray-500 mr-1 text-xs" />
                            <span className="text-xs text-gray-700">Salida</span>
                          </div>
                          <span className="text-xs text-gray-500">{day.punchOut}</span>
                        </div>
                      </>
                    )}
                    {day.lunchOut && (
                      <>
                        <div className="flex items-center border-l border-gray-200 mx-4"></div>
                        <div className="flex items-center flex-col">
                          <div className="flex items-center">
                            <MdOutlineFreeBreakfast className="text-gray-500 mr-1 text-xs" />
                            <span className="text-xs text-gray-700">Salida Almuerzo</span>
                          </div>
                          <span className="text-xs text-gray-500">{day.lunchOut}</span>
                        </div>
                      </>
                    )}
                    {day.lunchIn && (
                      <>
                        <div className="flex items-center border-l border-gray-200 mx-4"></div>
                        <div className="flex items-center flex-col">
                          <div className="flex items-center">
                            <MdRestaurantMenu className="text-gray-500 mr-1 text-xs" />
                            <span className="text-xs text-gray-700">Entrada Almuerzo</span>
                          </div>
                          <span className="text-xs text-gray-500">{day.lunchIn}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceTable;
