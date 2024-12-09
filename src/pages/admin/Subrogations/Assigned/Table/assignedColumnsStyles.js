export const getAssignedCellStyle = (columnId, value) => {
  if (columnId === 'status') {
    if (value === 'En espera') {
      return 'text-xs font-semibold bg-blue-100 text-blue-600 shadow-sm'; 
    }
    if (value === 'En curso') {
      return 'text-xs font-semibold bg-green-100 text-green-600 shadow-sm'; 
    }
    if (value === 'Finalizada') {
      return 'text-xs font-semibold bg-gray-100 text-gray-600 shadow-sm'; 
    }
  }
};
