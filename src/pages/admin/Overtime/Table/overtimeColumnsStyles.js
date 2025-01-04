export const getAllCellStyle = (columnId, value) => {
    if (columnId === 'day_type') {
        if (value === 'Horas extras') {
            return 'text-xs font-semibold px-2 bg-purple-100 text-purple-600 shadow-sm'; // Azul para horas extras
        }
        if (value === 'Trabajo en día de descanso') {
            return 'text-xs font-semibold px-2 bg-blue-100 text-blue-600 shadow-sm'; // Naranja para trabajo en día de descanso
        }
        if (value === 'Trabajo en día festivo') {
            return 'text-xs font-semibold px-2 bg-yellow-100 text-yellow-600 shadow-sm'; // Morado para trabajo en día festivo
        }
    }
};
