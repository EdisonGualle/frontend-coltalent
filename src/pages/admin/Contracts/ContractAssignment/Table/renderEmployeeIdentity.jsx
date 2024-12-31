export const renderEmployeeIdentity = (row, asText = false) => {
    const fullName = row.employee?.full_name || "Nombre no disponible";
    const identification = row.employee?.identification || "Cédula no disponible";

    if (asText) {
        return `${fullName}\n${identification}`;
    }

    return (
        <div className="flex flex-col gap-1">
            <span className="">{fullName}</span>
            <span className="text-xs text-gray-500">{identification}</span>
        </div>
    );
};
