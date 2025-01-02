export const renderHolidayDetails = (row) => {
    const formattedDate = row.holiday?.date || "Sin fecha";
    const isRecurring = row.holiday?.is_recurring ? "Recurrente" : "No recurrente";

    return (
        <div className="flex flex-col gap-1">
            <div>
                <span className="font-semibold">Fecha</span> {formattedDate}
            </div>
            <div>
                <span className="font-semibold">  Estado:</span> <span className={`  ${row.holiday?.is_recurring ? "text-green-600" : "text-red-500"}`}> {isRecurring}</span>
            </div>
        </div>
    );
};
