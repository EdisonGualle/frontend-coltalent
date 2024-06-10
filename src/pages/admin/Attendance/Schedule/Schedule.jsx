import React, { useState } from 'react';
import WeeklySchedule from './WeeklySchedule';

const Schedule = () => {
  const [schedule, setSchedule] = useState({
    Domingo: {},  // Domingo al inicio
    Lunes: { entry: '08:00', lunchStart: '12:00', lunchEnd: '13:00', exit: '17:00' },
    Martes: { entry: '08:00', exit: '17:00' },
    Miércoles: { entry: '08:00', lunchStart: '12:00', exit: '17:00' },
    Jueves: { entry: '08:00', lunchStart: '12:00', lunchEnd: '13:00' },
    Viernes: { entry: '08:00', exit: '17:00' },
    Sábado: {}  // Sábado al final
  });

  const handleEdit = () => {
    // Implementar lógica de edición aquí
    console.log('Editar horario');
  };

  return <WeeklySchedule schedule={schedule} onEdit={handleEdit} />;
};

export default Schedule;
