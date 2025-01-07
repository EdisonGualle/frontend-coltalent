import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import WeeklySchedule from './WeeklySchedule';
import { getEmployeeWorkSchedules } from '../../../../services/Employee/Schedules/workScheduleService.js';
import LoadingSpinner from '../../../../components/ui/LoadingIndicator.jsx';
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import { fetchEmployeeSchedule } from '../../../../redux/Calendar/weeklyScheduleSlince.js';

const Schedule = () => {
  const dispatch = useDispatch();
  const {weekSchedule, fetchStatus, hasFetchedAll} = useSelector(
    (state) => state.weeklySchedule
  );
  
  const { id: employee_id } = useParams();
  const [schedule, setSchedule] = useState({
    Domingo: {},  // Domingo al inicio
    Lunes: {},
    Martes: {},
    Miércoles: {},
    Jueves: {},
    Viernes: {},
    Sábado: {}  // Sábado al final
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchWorkSchedules = async () => {
      try {
        const response = await getEmployeeWorkSchedules(employee_id);
        const workSchedules = response.data; // Asegúrate de que response.data contenga la lista de horarios

        // Mapear los datos recibidos a los días de la semana
        const mappedSchedule = {
          Domingo: workSchedules.find(schedule => schedule.day_of_week === 7) || {},
          Lunes: workSchedules.find(schedule => schedule.day_of_week === 1) || {},
          Martes: workSchedules.find(schedule => schedule.day_of_week === 2) || {},
          Miércoles: workSchedules.find(schedule => schedule.day_of_week === 3) || {},
          Jueves: workSchedules.find(schedule => schedule.day_of_week === 4) || {},
          Viernes: workSchedules.find(schedule => schedule.day_of_week === 5) || {},
          Sábado: workSchedules.find(schedule => schedule.day_of_week === 6) || {}
        };

        // Transformar los datos al formato que necesita DayCard
        const formattedSchedule = {};
        Object.keys(mappedSchedule).forEach(day => {
          const daySchedule = mappedSchedule[day];
          if (daySchedule) {
            formattedSchedule[day] = {
              entry: daySchedule.start_time || null,
              lunchStart: daySchedule.lunch_start_time || null,
              lunchEnd: daySchedule.lunch_end_time || null,
              exit: daySchedule.end_time || null
            };
          } else {
            formattedSchedule[day] = {}; // Si no hay horario, se deja vacío
          }
        });

        setSchedule(formattedSchedule);
      } catch (error) {
        console.error("Error fetching work schedules:", error);
      } finally {
        setLoading(false); // Desactivar la carga al finalizar
      }
    };

    fetchWorkSchedules();

  }, [employee_id]);

  const handleEdit = () => {
    // Implementar lógica de edición aquí
    console.log('Editar horario');
  };

  // Mostrar el indicador de carga si `loading` es verdadero
  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return <WeeklySchedule schedule={schedule} onEdit={handleEdit} />;
};

export default Schedule;
