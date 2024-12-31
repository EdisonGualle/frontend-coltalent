export const renderContractAssignmentPeriod = (row, asText = false) => {
    const formatDate = (date) => {
        if (!date) {
            return "Indefinido";
        }
        const [year, month, day] = date.split("-"); // Asume formato YYYY-MM-DD
        return `${day}/${month}/${year}`;
    };

    const startDate = row.start_date ? formatDate(row.start_date) : null;
    const endDate = row.end_date ? formatDate(row.end_date) : "Indefinido";

    if (!startDate) {
        return asText
            ? "Fecha de inicio no definida"
            : <span className="text-gray-500 italic">Fecha de inicio no definida</span>;
    }

    if (asText) {
        return `${startDate} - ${endDate}`;
    }

    return (
        <div className="flex items-center">
            <span className="">{startDate}</span>
            <span className="mx-1 text-gray-500">-</span>
            <span className={endDate === "Indefinido" ? "text-gray-500 italic" : ""}>
                {endDate}
            </span>
        </div>
    );
};
