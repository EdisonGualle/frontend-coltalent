export const getLeaveTypeCellStyle = (columnId, value) => {
    if (columnId === 'time_unit') {
      if (value === 'Días') {
        return 'text-xs px-2 font-semibold  bg-blue-100 text-blue-600 shadow-sm'; 
      }
      if (value === 'Horas') {
        return 'text-xs px-2 font-semibold  bg-purple-100 text-purple-600 shadow-sm'; 
      }
    }
  
    if (columnId === 'requires_document') {
      if (value === 'Si') {
        return 'text-xs px-2 font-semibold  bg-teal-100 text-teal-600 shadow-sm'; 
      }
      if (value === 'No') {
        return 'text-xs px-2 font-semibold  bg-pink-100 text-pink-600 shadow-sm'; 
      }
    }

    if (columnId === 'status') {
      if (value === 'Activo') {
        return 'text-xs px-2 font-semibold  bg-green-100 text-green-600  shadow-sm';
      }
      if (value === 'Inactivo') {
        return 'text-xs px-2 font-semibold  bg-yellow-100 text-yellow-600 shadow-sm';
      }
      
    }
  
    return '';
  };
  