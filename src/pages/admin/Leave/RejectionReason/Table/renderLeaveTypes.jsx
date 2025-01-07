export const renderLeaveTypes = (row, asText = false) => {
    const typeStyles = "bg-blue-100 text-blue-600"; // Estilo base para los tipos de permisos

    const leaveTypes = row.leave_types.map((type) => type.name);
    
    if (leaveTypes.length === 0) {
        return asText
            ? "Sin tipos de permiso"
            : <span className="text-gray-400 italic">Sin tipos de permiso</span>;
    }

    if (asText) {
        return leaveTypes.join(", ");
    }

    return (
        <div className="flex flex-wrap gap-2">
            {leaveTypes.map((type, index) => (
                <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-lg shadow-sm ${typeStyles}`}
                >
                    {type}
                </span>
            ))}
        </div>
    );
};
