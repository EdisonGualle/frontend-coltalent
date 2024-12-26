export const renderWorkHours = (row, asText = false) => {
    const formatTime = (time) => time.slice(0, 5); // Toma solo HH:MM de HH:MM:SS

    const startTime = row.start_time ? formatTime(row.start_time) : null;
    const endTime = row.end_time ? formatTime(row.end_time) : null;

    if (!startTime || !endTime) {
        return asText
            ? "No definido"
            : <span className="text-gray-400 italic">No definido</span>;
    }

    if (asText) {
        return `${startTime} - ${endTime}`;
    }

    return (
        <div className="flex items-center">
            <span className="">{startTime}</span>
            <span className="mx-1 text-gray-500">-</span>
            <span className="">{endTime}</span>
        </div>
    );
};
