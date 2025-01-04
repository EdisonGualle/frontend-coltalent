export const renderWorkSchedule = (row, asText = false) => {
    const startTime = row.start_time || null;
    const endTime = row.end_time || null;
    const breakStartTime = row.break_start_time || null;
    const breakEndTime = row.break_end_time || null;
    const workedHours = row.worked_value || null; // Total de horas trabajadas

    // Validar si las horas de inicio y fin están presentes
    if (!startTime || !endTime) {
        return asText
            ? "No definido"
            : <span className="text-gray-400 italic">Horario no definido</span>;
    }

    // Construir el texto para los tiempos de descanso (si existen)
    const breakTime = breakStartTime && breakEndTime
        ? <span className="flex items-center  ">
            <span className="">Tiempo de descanso:</span>
            <span className="ml-1">{breakStartTime}</span>
            <span className="mx-1">a</span>
            <span>{breakEndTime}</span>
        </span>
        : null;

    if (asText) {
        return `${startTime} a ${endTime}${breakStartTime && breakEndTime ? ` | Descanso: ${breakStartTime} a ${breakEndTime}` : ''} | Total: ${workedHours || 'N/A'} hrs`;
    }

    return (
        <div className="flex flex-col">
            {/* Horas trabajadas */}
            <span className="flex items-center  ">
                <span className="">Horario de trabajo:</span>
                <span className="ml-1">{startTime}</span>
                <span className="mx-1 text-gray-500">a</span>
                <span>{endTime}</span>
            </span>

            {/* Descanso (si existe) */}
            {breakTime && <>{breakTime}</>}

            {/* Total de horas trabajadas */}
            <span className="flex items-center  text-gray-700 ">
                <span className="font-semibold">Horas totales:</span>
                <span className="ml-1">{workedHours || "N/A"} hrs</span>
            </span>
        </div>
    );
};
