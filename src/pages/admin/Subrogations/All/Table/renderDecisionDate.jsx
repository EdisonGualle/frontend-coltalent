export const renderDecisionDate = (row, asText = false) => {
    const decisionDate = row.delegated_by?.decision_date;

    if (!decisionDate) {
        return asText
            ? "No definido"
            : <span className="text-gray-400 italic">No definido</span>;
    }

    // Convertir la fecha y hora a formato 24h con AM/PM
    const [datePart, timePart] = decisionDate.split(" "); // Separar fecha y hora
    if (!datePart || !timePart) {
        return asText
            ? "Formato inválido"
            : <span className="text-red-400 italic">Formato inválido</span>;
    }

    const [hours, minutes, seconds] = timePart.split(":").map(Number); // Obtener horas, minutos y segundos
    const isPM = hours >= 12; // Determinar si es PM
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // Formatear horas en 12h
    const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`; // Construir formato AM/PM

    if (asText) {
        return `${datePart} (${formattedTime})`;
    }

    return (
        <div className="flex items-center space-x-2">
            <span className="  ">
                {datePart} 
            </span>
            <br />
            <span className=" text-xs text-gray-500">
                ({formattedTime})
            </span>
        </div>
    );
};
