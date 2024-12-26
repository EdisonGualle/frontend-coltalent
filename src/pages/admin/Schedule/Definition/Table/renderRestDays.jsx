export const renderRestDays = (row, asText = false) => {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dayStyles = {
        "Domingo": "bg-gray-100 text-gray-600",
        "Lunes": "bg-blue-100 text-blue-600",
        "Martes": "bg-green-100 text-green-600",
        "Miércoles": "bg-yellow-100 text-yellow-600",
        "Jueves": "bg-purple-100 text-purple-600",
        "Viernes": "bg-orange-100 text-orange-600",
        "Sábado": "bg-violet-100 text-violet-600"
    };

    const restDays = row.rest_days.map((day) => daysOfWeek[day] || "Desconocido");

    if (restDays.length === 0) {
        return asText
            ? "Sin días de descanso"
            : <span className="text-gray-400 italic">Sin días de descanso</span>;
    }

    if (asText) {
        return restDays.join(", ");
    }

    return (
        <div className="flex flex-wrap gap-2">
            {restDays.map((day, index) => (
                <span
                    key={index}
                    className={`text-xs  px-2 py-1 rounded-lg shadow-sm ${dayStyles[day] || "bg-gray-400 text-gray-700"}`}
                >
                    {day}
                </span>
            ))}
        </div>
    );
};
