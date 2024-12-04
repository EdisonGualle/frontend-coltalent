export const getAuthorizationCellStyle = (columnId, value) => {
  if (columnId === 'duration') {
    if (value.includes('Día') || value.includes('Días')) {
      return 'bg-blue-100 text-blue-600';
    }
    if (value.includes('Hora') || value.includes('Horas')) {
      return 'bg-purple-100 text-purple-600';
    }
    if (value.includes('Minutos') || value.includes('Minuto')) {
      return 'bg-indigo-100 text-indigo-600 ';
    }
  }

  if (columnId === 'state.name') {
    if (value === 'Pendiente') {
      return 'text-xs font-semibold  bg-yellow-100 text-yellow-600 shadow-sm';
    }
    if (value === 'Aprobado') {
      return 'text-xs font-semibold  bg-green-100 text-green-600 shadow-sm';
    }
    if (value === 'Rechazado') {
      return 'text-xs font-semibold  bg-red-100 text-red-600 shadow-sm';
    }
    if (value === 'Corregir') {
      return 'text-xs font-semibold  bg-orange-100 text-orange-600 shadow-sm';
    }
  }

  if (columnId === 'comentario_1.action') {
    if (value === 'Pendiente') {
      return 'bg-yellow-100 text-yellow-600';
    }
    if (value === 'Aprobado') {
      return 'bg-green-100 text-green-600';
    }
    if (value === 'Rechazado') {
      return 'bg-red-100 text-red-600';
    }
    if (value === 'Corregir') {
      return 'bg-orange-100 text-orange-600';
    }
  }

  if (columnId === 'comentario_2.action') {
    if (value === 'Pendiente') {
      return 'bg-yellow-100 text-yellow-600';
    }
    if (value === 'Aprobado') {
      return 'bg-green-100 text-green-600';
    }
    if (value === 'Rechazado') {
      return 'bg-red-100 text-red-600';
    }
    if (value === 'Corregir') {
      return 'bg-orange-100 text-orange-600';
    }
  }

  return '';
};
