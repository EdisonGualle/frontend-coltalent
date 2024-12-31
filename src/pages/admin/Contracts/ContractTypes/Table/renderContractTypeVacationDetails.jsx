export const renderContractTypeVacationDetails = (row, asText = false) => {
    const vacationPerYear = row.vacation_days_per_year ?? "N/A";
    const maxAccumulated = row.max_vacation_days ?? "N/A";
    const minTenureMonths = row.min_tenure_months_for_vacation ?? "N/A";

    if (asText) {
        return `Vacaciones por año: ${vacationPerYear} días, Máximo acumulable: ${maxAccumulated} días, Antigüedad mínima: ${minTenureMonths} meses`;
    }

    return (
        <div className="flex flex-col gap-1">
            <span >
                <strong>{vacationPerYear}</strong> días/año
            </span>
            <span className="text-xs text-gray-600">
                Máximo acumulable: <strong>{maxAccumulated}</strong> días
            </span>
            <span className="text-xs text-gray-600">
                Antigüedad mínima: <strong>{minTenureMonths}</strong> meses
            </span>
        </div>
    );
};
