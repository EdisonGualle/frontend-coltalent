export const renderDaysDetails = (row, asText = false) => {
    const isRecurring = row.is_recurring ? "Recurrente" : "No recurrente";
    const appliesToAll = row.applies_to_all ? "Aplica a todos" : "Aplica a algunos";

    if (asText) {
        return `${isRecurring}, ${appliesToAll}`;
    }

    return (
        <div className="flex flex-col text-sm text-gray-700">
            <span className="font-medium">{isRecurring}</span>
            <span>{appliesToAll}</span>
        </div>
    );
};
