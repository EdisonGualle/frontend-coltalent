// src/config/getCellStyle.js
export const getCellStyle = (columnId, value) => {
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
  