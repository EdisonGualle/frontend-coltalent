export const getAllCellStyle = (columnId, value) => {
  if (columnId === 'status') {
    if (value === 'Activo') {
      return 'text-xs font-semibold  bg-green-100 text-green-600  shadow-sm';
    }
    if (value === 'Inactivo') {
      return 'text-xs font-semibold  bg-yellow-100 text-yellow-600 shadow-sm';
    } 
  }
  };
  