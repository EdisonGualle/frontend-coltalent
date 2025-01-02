export const renderDaysDetails = (row, asText = false) => {
    const isRecurring = row.is_recurring ? "Recurrente" : "No recurrente";
    const appliesToAll = row.applies_to_all ? "Aplica a todos" : "Aplica a algunos";

    if (asText) {
        return `${isRecurring}, ${appliesToAll}`;
    }

    return (
        <div className="flex gap-4">
            <span className={row.is_recurring ? "text-green-600" : "text-red-500"}>{isRecurring}</span>
            <span className="font-semibold">-</span>
            <span>{appliesToAll}</span>
        </div>
    );
};
