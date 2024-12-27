import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../../../../redux/Employee/employeSlice.js";
import CustomSelect from "../../../../../components/ui/Select.jsx";
import { fetchAllSchedules } from "../../../../../redux/Schedules/ScheduleSlince.js";
import Input from "../../../../../components/ui/Input";
import { BsCalendarCheck, BsCalendarX } from "react-icons/bs";

// Función auxiliar para validar un campo específico
const validateField = (name, value, formData) => {
    switch (name) {
        case "employee_id":
            return !value ? "Por favor, selecciona un empleado." : "";
        case "schedule_id":
            return !value ? "Por favor, selecciona un horario." : "";
        case "start_date":
            return !value
                ? "La fecha de inicio es obligatoria."
                : formData.end_date && new Date(value) > new Date(formData.end_date)
                ? "La fecha de inicio no puede ser después de la fecha de fin."
                : "";
        case "end_date":
            return !value
                ? "La fecha de fin es obligatoria."
                : formData.start_date && new Date(value) < new Date(formData.start_date)
                ? "La fecha de fin no puede ser antes de la fecha de inicio."
                : "";
        default:
            return "";
    }
};

// Función auxiliar para validar todos los campos
const validateAllFields = (formData) => ({
    employee_id: validateField("employee_id", formData.employee_id),
    schedule_id: validateField("schedule_id", formData.schedule_id),
    start_date: validateField("start_date", formData.start_date, formData),
    end_date: validateField("end_date", formData.end_date, formData),
});

const AssignEmployeeScheduleForm = ({
    onSubmit,
    onCancel,
    formErrors = {},
    isEditing = false,
    initialData = {},
    confirmButtonText = isEditing ? "Guardar" : "Asignar",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-500",
    cancelButtonColor = "border-gray-400",
}) => {
    const dispatch = useDispatch();
    const employeesState = useSelector((state) => state.employee);
    const schedulesState = useSelector((state) => state.schedules);

    const employees = employeesState?.employees || [];
    const schedules = schedulesState?.schedules || [];

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
        if (employees.length === 0) {
            dispatch(fetchEmployees());
        }
        if (schedules.length === 0) {
            dispatch(fetchAllSchedules());
        }
    }, [dispatch, employees, schedules]);

    useEffect(() => {
        setHasErrors(Object.values(errors).some((error) => error));
    }, [errors]);

    const handleEmployeeChange = (option) => {
        setSelectedEmployee(option);

        const updatedErrors = {
            ...errors,
            employee_id: validateField("employee_id", option?.value || null),
        };
        setErrors(updatedErrors);
    };

    const handleScheduleChange = (option) => {
        setSelectedSchedule(option);

        const updatedErrors = {
            ...errors,
            schedule_id: validateField("schedule_id", option?.value || null),
        };
        setErrors(updatedErrors);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        const updatedErrors = validateAllFields({
            ...formData,
            [name]: value,
            employee_id: selectedEmployee?.value || null,
            schedule_id: selectedSchedule?.value || null,
        });
        setErrors(updatedErrors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalData = {
            employee_id: selectedEmployee?.value || null,
            schedule_id: selectedSchedule?.value || null,
            start_date: formData.start_date,
            end_date: formData.end_date,
        };

        const validationErrors = validateAllFields(finalData);

        if (Object.values(validationErrors).some((error) => error)) {
            setErrors(validationErrors);
            return;
        }

        onSubmit({
            ...finalData,
            employee_name: selectedEmployee.label,
            schedule_name: selectedSchedule.label,
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
                        icon={BsCalendarCheck }
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
                    aria-label={confirmButtonText}
                    className={`p-2 rounded-xl text-white w-full ${confirmButtonColor} outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${
                        hasErrors ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={hasErrors}
                >
                    {confirmButtonText}
                </button>
                <button
                    type="button"
                    aria-label={cancelButtonText}
                    className={`p-2 rounded-xl bg-transparent border border-dashed ${cancelButtonColor} w-full outline-none transform transition-all duration-300 hover:scale-105`}
                    onClick={onCancel}
                >
                    {cancelButtonText}
                </button>
            </div>
        </form>
    );
};

export default AssignEmployeeScheduleForm;