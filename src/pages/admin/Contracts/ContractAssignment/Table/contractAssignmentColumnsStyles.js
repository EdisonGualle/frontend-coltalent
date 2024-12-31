export const getAllCellStyle = (columnId, value) => {
    if (columnId === 'status') {
        if (value === 'Activo') {
            return 'text-xs font-semibold px-2   bg-green-100 text-green-600  shadow-sm';
        }
        if (value === 'Finalizado') {
            return 'text-xs font-semibold px-2  bg-red-100 text-red-600 shadow-sm';
        }
    }
};
