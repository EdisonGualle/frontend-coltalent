export const renderRequestedPeriod = (row, asText = false) => {
    const period = row.requested_period;

    if (!period) {
        return asText
            ? "No definido"
            : <span className="text-gray-400 italic">No definido</span>;
    }

    if (period.start && period.end) {
        if (asText) {
            return period.start === period.end
                ? `${period.start}`
                : `${period.start} - ${period.end}`;
        }

        return (
            <div>
                {period.start === period.end ? (
                    // Color para fechas iguales
                    <span className="text-xs font-semibold  bg-green-100 text-green-600 px-2 py-1 rounded-lg shadow-sm">
                        {period.start}
                    </span>
                ) : (
                    // Color para rango de fechas
                    <div>
                        <span className="text-xs font-semibold bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg shadow-sm">
                            {period.start}
                        </span>
                        <span className="text-xs  text-gray-500 mx-1">-</span>
                        <span className="text-xs font-semibold bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg shadow-sm">
                            {period.end}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    if (period.date) {
        const timeRange =
            period.start_time && period.end_time
                ? ` (${period.start_time} - ${period.end_time})`
                : "";

        if (asText) {
            return `${period.date}${timeRange}`;
        }

        // Color para una fecha única
        return (
            <div>
                <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded-lg shadow-sm">
                    {period.date}
                </span>
                {timeRange && <span className="text-xs ml-2 text-gray-500">{timeRange}</span>}
            </div>
        );
    }

    return asText
        ? "No definido"
        : <span className="text-gray-400 italic">No definido</span>;
};
