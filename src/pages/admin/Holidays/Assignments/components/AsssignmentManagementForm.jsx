import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../../../../redux/Employee/employeSlice.js";
import { fetchAllHolidays } from "../../../../../redux/Holidays/holidaysSlince.js";
import CustomSelect from "../../../../../components/ui/Select.jsx";
import TaggableSelect from "../../../../../components/ui/TaggableSelect";

// Validar campos individuales
const validateField = (name, value) => {
    switch (name) {
        case "employees":
            return value.length === 0 ? "Selecciona al menos un empleado." : "";
        case "holiday":
            return !value ? "Selecciona un día festivo." : "";
        default:
            return "";
    }
};

// Validar todos los campos
const validateAllFields = (formData) => ({
    employees: validateField("employees", formData.employees),
    holiday: validateField("holiday", formData.holiday),
});

const AsssignmentManagementForm = ({
    onSubmit,
    onCancel,
    formErrors = {},
    isSubmitting = false,
}) => {
    const dispatch = useDispatch();
    const employeesState = useSelector((state) => state.employee);
    const holidaysState = useSelector((state) => state.holidays);

    const employees = employeesState?.employees?.filter(
        (employee) => employee.has_active_contract
    ) || [];

    const holidays = holidaysState?.holidays?.filter(
        (holiday) => !holiday.applies_to_all
    ) || [];

    // Estados locales
    const [formData, setFormData] = useState({
        employees: [],
        holiday: null,
    });
    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false);

    // Efecto para cargar datos si no han sido previamente obtenidos
    useEffect(() => {
        if (!employeesState.hasFetchedAll) {
            dispatch(fetchEmployees());
        }
        if (!holidaysState.hasFetchedAll) {
            dispatch(fetchAllHolidays());
        }
    }, [dispatch, employeesState.hasFetchedAll, holidaysState.hasFetchedAll]);


    // Actualizar errores del backend
    useEffect(() => {
        setErrors((prevErrors) => ({ ...prevErrors, ...formErrors }));
    }, [formErrors]);

    // Actualizar el estado de errores global
    useEffect(() => {
        setHasErrors(Object.values(errors).some((error) => error));
    }, [errors]);


    // Manejar cambios en empleados seleccionados
    const handleEmployeeChange = (selectedEmployees) => {
        setFormData((prev) => ({ ...prev, employees: selectedEmployees }));
        const fieldError = validateField("employees", selectedEmployees);
        setErrors((prevErrors) => ({ ...prevErrors, employees: fieldError }));
    };

    // Manejar cambios en el día festivo seleccionado
    const handleHolidayChange = (selectedHoliday) => {
        setFormData((prev) => ({ ...prev, holiday: selectedHoliday }));
        const fieldError = validateField("holiday", selectedHoliday);
        setErrors((prevErrors) => ({ ...prevErrors, holiday: fieldError }));
    };

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateAllFields(formData);
        setErrors(validationErrors);

        if (Object.values(validationErrors).some((error) => error)) return;

        // Enviar datos si no hay errores
        const formattedData = {
            employees: formData.employees.map((employee) => employee.value),
            holiday: formData.holiday.value.id,
        };
        onSubmit(formattedData);
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de empleados */}
            <div>
                <TaggableSelect
                    label="Empleados"
                    id="employees"
                    placeholder="Selecciona empleados"
                    options={employees.map((employee) => ({
                        label: employee.full_name,
                        value: employee.id,
                    }))}
                    value={formData.employees}
                    onChange={handleEmployeeChange}
                    error={errors.employees}
                    enableSearch={true}
                />
            </div>

            {/* Selector de días festivos */}
            <div>
                <CustomSelect
                    label="Día Festivo"
                    options={holidays}
                    value={formData.holiday}
                    onChange={handleHolidayChange}
                    placeholder="Selecciona un día festivo"
                    error={errors.holiday}
                    isSearchable={true}
                    labelKey="name"
                />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4">
                <button
                    type="submit"
                    className={`p-2 rounded-xl text-white w-full bg-blue-600 outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitting || hasErrors ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    disabled={isSubmitting || hasErrors}
                >
                    Crear
                </button>
                <button
                    type="button"
                    className="p-2 rounded-xl bg-transparent border border-dashed border-gray-400 w-full outline-none transform transition-all duration-300 hover:scale-105"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}

export default AsssignmentManagementForm