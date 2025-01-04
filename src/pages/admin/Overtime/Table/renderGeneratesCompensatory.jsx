export const renderGeneratesCompensatory = (row, asText = false) => {
    const value = row.generates_compensatory;
    // Convertir el valor a texto según el tipo de dato
    const textValue =
        value === true || value === "true" || value === 1
            ? "Si"
            : value === false || value === "false" || value === 0
            ? "No"
            : "N/A";

    // Retornar solo texto si `asText` es true
    if (asText) {
        return textValue;
    }

    // Estilos de color según el valor
    const styleClass =
        textValue === "Si"
            ? "text-xs px-2 py-1 rounded-lg font-semibold bg-teal-100 text-teal-600 shadow-sm"
            : textValue === "No"
            ? "text-xs px-2 py-1 font-semibold bg-pink-100 text-pink-600 shadow-sm"
            : "text-xs px-2 py-1 font-semibold bg-gray-100 text-gray-500 shadow-sm";

    return (
        <span className={styleClass}>
            {textValue}
        </span>
    );
};
