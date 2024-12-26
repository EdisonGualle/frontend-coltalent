export const renderBreakHours = (row, asText = false) => {
    const formatTime = (time) => time.slice(0, 5); // Toma solo HH:MM de HH:MM:SS

    const breakStartTime = row.break_start_time ? formatTime(row.break_start_time) : null;
    const breakEndTime = row.break_end_time ? formatTime(row.break_end_time) : null;

    if (!breakStartTime || !breakEndTime) {
        return asText
            ? "No definido"
            : <span className="text-gray-400 italic">No definido</span>;
    }

    if (asText) {
        return `${breakStartTime} - ${breakEndTime}`;
    }

    return (
        <div className="flex items-center">
            <span className="">{breakStartTime}</span>
            <span className="mx-1 text-gray-500">-</span>
            <span className="">{breakEndTime}</span>
        </div>
    );
};
