export const renderDelegationPeriod = (row, asText = false) => {
    const start = row.original_leave?.start_date;
    const end = row.original_leave?.end_date;

    if (!start || !end) {
        return asText
            ? "No definido"
            : <span className="text-gray-400 italic">No definido</span>;
    }

    if (start === end) {
        if (asText) {
            return `${start}`;
        }

        return (
            <span className="text-xs font-semibold bg-green-100 text-green-600 px-2 py-1 rounded-lg shadow-sm">
                {start}
            </span>
        );
    }

    if (asText) {
        return `${start} - ${end}`;
    }

    return (
        <div className="flex items-center">
            <span className="text-xs font-semibold bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg shadow-sm">
                {start}
            </span>
            <span className="mx-1 text-gray-500">-</span>
            <span className="text-xs font-semibold bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg shadow-sm">
                {end}
            </span>
        </div>
    );
};
