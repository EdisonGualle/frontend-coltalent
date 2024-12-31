export const renderContractTypeDuration = (row, asText = false) => {
    const duration = row.max_duration_months
        ? `${row.max_duration_months} ${row.max_duration_months === 1 ? "mes" : "meses"}`
        : "Indefinido";

    // Normalizamos el valor de `renewable` para manejar 1/0 o true/false
    const isRenewable = row.renewable === 1 || row.renewable === true;

    const renewableTag = isRenewable
        ? (
            <span className="inline-block bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs font-semibold">
                Renovable
            </span>
        )
        : (
            <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs font-semibold">
                No Renovable
            </span>
        );

    if (asText) {
        return `${duration} (${isRenewable ? "Renovable" : "No Renovable"})`;
    }

    return (
        <div className="flex flex-col items-start">
            <span>{duration}</span>
            <div>{renewableTag}</div>
        </div>
    );
};
