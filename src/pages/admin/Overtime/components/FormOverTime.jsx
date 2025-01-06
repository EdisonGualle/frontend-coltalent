import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../../../redux/Employee/employeSlice.js";
import Input from "../../../../components/ui/Input.jsx";
import CustomSelect from "../../../../components/ui/Select.jsx";
import Textarea from "../../../../components/ui/Textarea.jsx";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
registerLocale("es", es); // Registrar el idioma español para react-datepicker

// Validar campos individuales
const validateField = (name, value, formData) => {
    switch (name) {
        case "employee_id":
            return !value ? "Selecciona un empleado." : "";
        case "date":
            return !value ? "Selecciona una fecha." : "";
        case "start_time":
            return !value ? "La hora de inicio es obligatoria." : "";
        case "end_time":
            return !value
                ? "La hora de fin es obligatoria."
                : formData.start_time && value <= formData.start_time
                    ? "La hora de fin debe ser posterior a la hora de inicio."
                    : "";
        case "break_start_time":
            if (!value && !formData.break_end_time) return ""; // No validar si ambos están vacíos
            return value && !formData.break_end_time
                ? "Debe ingresar la hora de fin del descanso si proporciona una hora de inicio."
                : formData.break_end_time && value >= formData.break_end_time
                    ? "La hora de inicio del descanso debe ser anterior a la hora de fin."
                    : formData.start_time && value <= formData.start_time
                        ? "La hora de inicio del descanso debe estar dentro de las horas de inicio y fin."
                        : "";
        case "break_end_time":
            if (!value && !formData.break_start_time) return ""; // No validar si ambos están vacíos
            return value && !formData.break_start_time
                ? "Debe ingresar la hora de inicio del descanso si proporciona una hora de fin."
                : formData.break_start_time && value <= formData.break_start_time
                    ? "La hora de fin del descanso debe ser posterior a la hora de inicio."
                    : formData.end_time && value >= formData.end_time
                        ? "La hora de fin del descanso debe estar dentro de las horas de inicio y fin."
                        : "";
        case "reason":
            return !value ? "El motivo es obligatorio." : "";
        default:
            return "";
    }
};

// Validar todos los campos
const validateAllFields = (formData) => ({
    employee_id: validateField("employee_id", formData.employee_id, formData),
    date: validateField("date", formData.date, formData),
    start_time: validateField("start_time", formData.start_time, formData),
    end_time: validateField("end_time", formData.end_time, formData),
    break_start_time: validateField("break_start_time", formData.break_start_time, formData),
    break_end_time: validateField("break_end_time", formData.break_end_time, formData),
    reason: validateField("reason", formData.reason, formData),
});


const FormOverTime = ({
    onSubmit,
    onCancel,
    formErrors = {},
    isSubmitting = false,
}) => {
    const dispatch = useDispatch();
    const employeesState = useSelector((state) => state.employee);

    const employees = employeesState?.employees?.filter(
        (employee) => employee.has_active_contract) || [];

    const [formData, setFormData] = useState({
        employee_id: null,
        date: null,
        start_time: "",
        end_time: "",
        break_start_time: "",
        break_end_time: "",
        reason: "",
        generates_compensatory: false,
    });

    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false);

    useEffect(() => {
        if (!employeesState.hasFetchedAll) {
            dispatch(fetchEmployees());
        }
    }, [dispatch, employeesState.hasFetchedAll]);

    useEffect(() => {
        setErrors((prevErrors) => ({ ...prevErrors, ...formErrors }));
    }, [formErrors]);

    useEffect(() => {
        setHasErrors(Object.values(errors).some((error) => error));
    }, [errors]);

    const handleEmployeeChange = (selectedEmployee) => {
        setFormData((prev) => ({ ...prev, employee_id: selectedEmployee }));
        const fieldError = validateField("employee_id", selectedEmployee);
        setErrors((prevErrors) => ({ ...prevErrors, employee_id: fieldError }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, date }));
        const fieldError = validateField("date", date);
        setErrors((prevErrors) => ({ ...prevErrors, date: fieldError }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        const fieldError = validateField(name, value, updatedFormData);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateAllFields(formData);
        setErrors(validationErrors);

        if (Object.values(validationErrors).some((error) => error)) return;

        const formattedData = {
            ...formData,
            employee_id: formData.employee_id?.value.id, // Extraer solo el id
            date: formData.date ? formData.date.toISOString().split("T")[0] : null,
        };

        onSubmit(formattedData);
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Empleado */}
            <div>
                <CustomSelect
                    label="Empleado"
                    options={employees}
                    value={formData.employee_id}
                    onChange={handleEmployeeChange}
                    placeholder="Selecciona un empleado"
                    error={errors.employee_id}
                    isSearchable={true}
                    labelKey="full_name"
                />
            </div>


            <div className="flex flex-col">
                {/* Label explícito para el DatePicker */}
                <label htmlFor="date" className="font-semibold mb-1">
                    Fecha
                </label>
                <DatePicker
                    id="date"
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="d 'de' MMMM 'de' yyyy"
                    locale="es"
                    placeholderText="Selecciona una fecha"
                    className={`w-full border rounded-md px-3 py-2 text-sm ${errors.date ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={isSubmitting}
                    minDate={new Date(new Date().setMonth(new Date().getMonth() - 1))} // Bloquear antes de hace un mes
                    maxDate={new Date()} // Bloquear fechas futuras
                />
                {/* Mostrar errores de validación si existen */}
                {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
            </div>



            {/* Hora de inicio y fin */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Hora de inicio"
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    error={errors.start_time}

                />
                <Input
                    label="Hora de fin"
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    error={errors.end_time}

                />
            </div>


            {/* Hora de descanso */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Inicio descanso"
                    type="time"
                    name="break_start_time"
                    value={formData.break_start_time}
                    onChange={handleChange}
                    error={errors.break_start_time}
                />
                <Input
                    label="Fin descanso"
                    type="time"
                    name="break_end_time"
                    value={formData.break_end_time}
                    onChange={handleChange}
                    error={errors.break_end_time}
                />
            </div>

            {/* Motivo */}
            <div>
                <Textarea
                    label="Motivo"
                    id="reason"
                    name="reason"
                    placeholder="Ej: Trabajo extra para cierre de proyecto."
                    value={formData.reason}
                    onChange={handleChange}
                    error={errors.reason}
                    rows={3}
                />
            </div>

            {/* Genera compensación */}
            <div className="flex items-center gap-10">
                <label htmlFor="generates_compensatory" className="font-semibold">
                    Genera compensación
                </label>
                <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${formData.generates_compensatory ? "bg-blue-500" : "bg-gray-200 border border-gray-300"
                        }`}
                    onClick={() =>
                        setFormData((prev) => ({
                            ...prev,
                            generates_compensatory: !prev.generates_compensatory,
                        }))
                    }
                >
                    <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ${formData.generates_compensatory ? "translate-x-6 bg-blue-600" : "translate-x-0"
                            }`}
                    ></div>
                </div>
            </div>

            {/* Nota informativa */}
            <div className="text-xs text-gray-600 bg-gray-50 border border-gray-300 rounded-md p-2 mt-4 ">
                <span className="font-semibold">Nota:</span> Solo se registran trabajos ya realizados. Por favor, asegúrese de ingresar la información de manera precisa.
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4">
                <button
                    type="submit"
                    className={`p-2 rounded-xl text-white w-full bg-blue-600 outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitting || hasErrors ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    disabled={isSubmitting || hasErrors}
                >
                    Registrar
                </button>
                <button
                    type="button"
                    className={`p-2 rounded-xl bg-transparent border border-dashed border-gray-400 w-full outline-none transform transition-all duration-300 hover:scale-105 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default FormOverTime;