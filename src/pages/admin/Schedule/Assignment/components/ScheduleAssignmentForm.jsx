import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveEmployees } from "../../../../../redux/Employee/employeSlice.js";
import CustomSelect from "../../../../../components/ui/Select.jsx";
import { fetchAllSchedules } from "../../../../../redux/Schedules/ScheduleSlince.js";
import Input from "../../../../../components/ui/Input.jsx";
import { BsCalendarCheck, BsCalendarX } from "react-icons/bs";

// Validar que una hora semanal es igual a otra, considerando formatos como "4h", "4h 30m"
const areWeeklyHoursMatching = (scheduleHours, contractHours) => {
    const parseHoursToMinutes = (hoursString) => {
        // Normaliza el formato para manejar casos como "40h", "40h 30m", o "30m"
        const [hoursPart, minutesPart] = hoursString
            .trim()
            .replace("h", " ")
            .replace("m", "")
            .split(" ")
            .map((x) => parseInt(x, 10) || 0);

        const hours = hoursPart || 0;
        const minutes = minutesPart || 0;

        return hours * 60 + minutes;
    };

    const scheduleMinutes = parseHoursToMinutes(scheduleHours);
    const contractMinutes = contractHours * 60;

    return scheduleMinutes === contractMinutes;
};


const validateField = (name, value, formData, selectedEmployee, selectedSchedule) => {
    const contract = selectedEmployee?.value?.contract;

    switch (name) {
        case "employee_id":
            if (!selectedEmployee) {
                return "Por favor, selecciona un empleado.";
            }
            return ""; // Sin errores

        case "schedule_id":
            if (!selectedSchedule) {
                return "Por favor, selecciona un horario.";
            }
            if (
                selectedSchedule &&
                selectedEmployee &&
                !areWeeklyHoursMatching(
                    selectedSchedule.value.weekly_hours,
                    selectedEmployee.value.contract.contract_type.weekly_hours
                )
            ) {
                return `El horario seleccionado tiene ${selectedSchedule.value.weekly_hours} y no cumple con las ${selectedEmployee.value.contract.contract_type.weekly_hours} horas semanales requeridas por el contrato.`;
            }
            return ""; // Sin errores

        case "start_date":
            if (value) {
                const startDate = new Date(value);
                const contractStartDate = new Date(contract.start_date);
                const contractEndDate = contract.end_date ? new Date(contract.end_date) : null;

                if (startDate < contractStartDate || (contractEndDate && startDate > contractEndDate)) {
                    return `La fecha de inicio debe estar entre ${contract.start_date} y ${contract.end_date || "Indefinido"
                        }`;
                }

                if (formData.end_date && startDate > new Date(formData.end_date)) {
                    return "La fecha de inicio no puede ser después de la fecha de fin.";
                }
            }
            return ""; // Sin errores

        case "end_date":
            if (value) {
                const endDate = new Date(value);
                const contractStartDate = new Date(contract.start_date);
                const contractEndDate = contract.end_date ? new Date(contract.end_date) : null;

                if (endDate < contractStartDate || (contractEndDate && endDate > contractEndDate)) {
                    return `La fecha de fin debe estar entre ${contract.start_date} y ${contract.end_date || "Indefinido"
                        }`;
                }

                if (formData.start_date && endDate < new Date(formData.start_date)) {
                    return "La fecha de fin no puede ser antes de la fecha de inicio.";
                }

                if (!formData.start_date) {
                    return "Debe proporcionar la fecha de inicio si se define la fecha de fin.";
                }
            }
            return ""; // Sin errores

        default:
            return ""; // Sin errores adicionales
    }
};



const validateAllFields = (formData, selectedEmployee, selectedSchedule) => ({
    employee_id: validateField("employee_id", formData.employee_id, formData, selectedEmployee, selectedSchedule),
    schedule_id: validateField("schedule_id", formData.schedule_id, formData, selectedEmployee, selectedSchedule),
    start_date: validateField("start_date", formData.start_date, formData, selectedEmployee, selectedSchedule),
    end_date: validateField("end_date", formData.end_date, formData, selectedEmployee, selectedSchedule),
});


const ScheduleAssignmentForm = ({
    onSubmit,
    onCancel,
    formErrors = {},
    isEditing = false,
    isSubmitting = false,
    initialData = {},
    confirmButtonText = isEditing ? "Guardar" : "Asignar",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-500",
    cancelButtonColor = "border-gray-400",
}) => {
    const dispatch = useDispatch();
    const employeesState = useSelector((state) => state.employee);
    const schedulesState = useSelector((state) => state.schedules);

    const employees = employeesState?.employeesActive || [];
    const schedules = schedulesState?.schedules.filter(schedule => schedule.status === "Activo") || [];

    const [selectedEmployee, setSelectedEmployee] = useState(
        initialData.employee_id
            ? { value: initialData.employee_id, label: initialData.employee_name }
            : null
    );

    const [selectedSchedule, setSelectedSchedule] = useState(
        initialData.schedule_id
            ? { value: initialData.schedule_id, label: initialData.schedule_name }
            : null
    );

    const [formData, setFormData] = useState({
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
    });

    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false);

    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    useEffect(() => {
        if (!employeesState.hasFetchedActive) {
            dispatch(fetchActiveEmployees());
        }
        if (!schedulesState.hasFetchedAll) {
            dispatch(fetchAllSchedules());
        }
    }, [dispatch, employees, schedules]);

    useEffect(() => {
        setHasErrors(Object.values(errors).some((error) => error));
    }, [errors]);

    const handleEmployeeChange = (option) => {
        setSelectedEmployee(option);

        console.log('Empleado seleccionado', option);
        // Actualiza únicamente el error del empleado
        const updatedErrors = {
            ...errors,
            employee_id: validateField("employee_id", option?.value?.id || null, formData, option, selectedSchedule),

        };
        setErrors(updatedErrors);
    };

    const handleScheduleChange = (option) => {
        setSelectedSchedule(option);

        console.log('Calendario seleccionado', option);
        // Actualiza únicamente el error del horario
        const updatedErrors = {
            ...errors,
            schedule_id: validateField("schedule_id", option?.value || null, formData, selectedEmployee, option),
        };
        setErrors(updatedErrors);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        const updatedErrors = {
            ...errors,
            [name]: validateField(
                name,
                value,
                { ...formData, [name]: value },
                selectedEmployee,
                selectedSchedule
            ),
        };

        // Validar el campo relacionado solo si ambos tienen valores
        if (name === "start_date" && value && formData.end_date) {
            updatedErrors.end_date = validateField(
                "end_date",
                formData.end_date,
                { ...formData, start_date: value },
                selectedEmployee,
                selectedSchedule
            );
        }
        if (name === "end_date" && value && formData.start_date) {
            updatedErrors.start_date = validateField(
                "start_date",
                formData.start_date,
                { ...formData, end_date: value },
                selectedEmployee,
                selectedSchedule
            );
        }

        setErrors(updatedErrors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Obtiene el ID del empleado seleccionado
        const employeeId = selectedEmployee?.value?.id || null;

        // Prepara los datos según los requerimientos del backend
        const finalData = {
            schedule_id: selectedSchedule?.value?.id || null, // ID del horario
            start_date: formData.start_date || null,         // Fecha de inicio o null
            end_date: formData.end_date || null,             // Fecha de fin o null
        };

        console.log("Datos preparados para enviar al componente padre:", {
            employee_id: employeeId,
            ...finalData,
        });

        // Validar campos
        const validationErrors = validateAllFields(
            {
                ...formData,
                employee_id: selectedEmployee?.value?.id || null,
                schedule_id: selectedSchedule?.value?.id || null
            },
            selectedEmployee,
            selectedSchedule
        );


        if (Object.values(validationErrors).some((error) => error)) {
            setErrors(validationErrors);
            return;
        }

        // Envía al componente padre
        onSubmit({
            employee_id: employeeId,
            ...finalData,
        });
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <CustomSelect
                    label="Empleado"
                    options={employees}
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                    placeholder="Selecciona un empleado"
                    error={errors.employee_id}
                    isSearchable={true}
                    labelKey="full_name"
                />
            </div>
            <div>
                <CustomSelect
                    label="Horario"
                    options={schedules}
                    value={selectedSchedule}
                    onChange={handleScheduleChange}
                    placeholder="Selecciona un horario"
                    error={errors.schedule_id}
                    isSearchable={true}
                    labelKey="name"
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        label="Desde"
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        icon={BsCalendarCheck}
                        error={errors.start_date}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label="Hasta"
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        icon={BsCalendarX}
                        error={errors.end_date}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="submit"
                    aria-label={isSubmitting ? "Enviando..." : confirmButtonText}
                    className={`p-2 rounded-xl text-white w-full 
                        ${confirmButtonColor} outline-none border border-transparent transform transition-all duration-300 hover:scale-105 
                        ${isSubmitting || hasErrors ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    disabled={hasErrors}
                >
                    {isSubmitting ? "Enviando..." : confirmButtonText}
                </button>
                <button
                    type="button"
                    aria-label={cancelButtonText}
                    className={`p-2 rounded-xl bg-transparent border border-dashed ${cancelButtonColor} w-full outline-none transform transition-all duration-300 hover:scale-105 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    {cancelButtonText}
                </button>
            </div>
        </form>
    );
};

export default ScheduleAssignmentForm;