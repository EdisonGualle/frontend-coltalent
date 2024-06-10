// src/utils/dateUtils.js

export const calculateTotalTime = (startDate, endDate, startTime, endTime, allDay) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      if (startDate === endDate) {
        if (allDay) {
          return '1 día';
        } else if (startTime && endTime) {
          const [startHour, startMinute] = startTime.split(':').map(Number);
          const [endHour, endMinute] = endTime.split(':').map(Number);
          start.setHours(startHour, startMinute);
          end.setHours(endHour, endMinute);
          const timeDiff = end.getTime() - start.getTime();
          if (timeDiff < 0) return ''; // Return nothing if time difference is negative
          const totalMinutes = Math.floor(timeDiff / (1000 * 60));
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
  
          if (hours > 0 && minutes > 0) {
            return `${hours} h ${minutes} min`;
          } else if (hours > 0) {
            return `${hours} horas`;
          } else {
            return `${minutes} minutos`;
          }
        } else {
          return '';
        }
      } else {
        const timeDiff = end.getTime() - start.getTime();
        if (timeDiff < 0) return ''; // Return nothing if time difference is negative
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        return dayDiff > 1 ? `${dayDiff} días` : '1 día';
      }
    }
    return '';
  };
  