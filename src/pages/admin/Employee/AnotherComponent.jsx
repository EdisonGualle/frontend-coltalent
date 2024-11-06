// AnotherComponent.jsx
import React, { useState } from 'react';
import WorkScheduleForm from './WorkScheduleForm';

const AnotherComponent = () => {
  const [workSchedule, setWorkSchedule] = useState({
    monday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    tuesday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    wednesday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    thursday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    friday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    saturday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    sunday: { start_time: '', end_time: '', has_lunch_break: false, lunch_start_time: '', lunch_end_time: '' },
    }
);

  const [scheduleErrors, setScheduleErrors] = useState({});

  return (
    <div>
      <WorkScheduleForm
        workSchedule={workSchedule}
        setWorkSchedule={setWorkSchedule}
        setScheduleErrors={setScheduleErrors}
      />
      {/* Aquí puedes manejar los errores u otros elementos relacionados */}
    </div>
  );
};

export default AnotherComponent;
