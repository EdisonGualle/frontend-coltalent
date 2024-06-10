export const getCellStyle = (columnId, value) => {
    if (columnId === 'status') {
      if (value === 'Absent') {
        return 'bg-red-100 text-red-600';
      }
      if (value === 'Late') {
        return 'bg-yellow-100 text-yellow-600';
      }
      if (value === 'Present') {
        return 'bg-green-100 text-green-600';
      }
    }
    return '';
  };
  