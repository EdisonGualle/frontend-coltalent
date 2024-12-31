export const renderContractTypeWeeklyHours = (row, asText = false) => {
    // Obtener las horas semanales o mostrar "N/D"
    const weeklyHours = row.weekly_hours ?? "N/D";

    // Retornar directamente el texto, formateado según corresponda
    const text = weeklyHours === "N/D" ? "N/D" : `${weeklyHours} horas`;

    // Modo texto para exportaciones
    if (asText) {
        return text;
    }

    // Render visual para la tabla
    return <span>{text}</span>;
};
