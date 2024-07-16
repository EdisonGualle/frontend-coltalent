export const getLeaveTypeCellStyle = (columnId, value) => {
    if (columnId === 'time_unit') {
      if (value === 'Días') {
        return 'bg-blue-100 text-blue-600'; 
      }
      if (value === 'Horas') {
        return 'bg-purple-100 text-purple-600'; 
      }
    }
  
    if (columnId === 'requires_document') {
      if (value === 'Si') {
        return 'bg-teal-100 text-teal-600'; 
      }
      if (value === 'No') {
        return 'bg-pink-100 text-pink-600'; 
      }
    }

    if (columnId === 'status') {
      if (value === 'Activo') {
        return 'bg-green-100 text-green-700';
      }
      if (value === 'Inactivo') {
        return 'bg-yellow-100 text-yellow-700';
      }
      
    }
  
    return '';
  };
  