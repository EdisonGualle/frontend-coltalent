const getUnitColumnsStyles = (columnId, value) => {
    if (columnId === 'status') {
        if (value === 'Activo') {
            return 'text-xs px-2 font-semibold  bg-green-100 text-green-600  shadow-sm';
        }
        if (value === 'Inactivo') {
            return 'text-xs px-2 font-semibold  bg-yellow-100 text-yellow-600 shadow-sm';
        }
    }
    return '';
}

export default getUnitColumnsStyles;