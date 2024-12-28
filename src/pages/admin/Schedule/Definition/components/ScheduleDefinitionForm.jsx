import React, { useState, useEffect } from "react";

// Componentes personalizados
import Input from "../../../../../components/ui/Input";
import TaggableSelect from "../../../../../components/ui/TaggableSelect";

import { GrScheduleNew } from "react-icons/gr";
import { BsSunrise, BsSunset, BsHourglassTop, BsHourglassBottom } from "react-icons/bs";

// Verificar si un valor está dentro de un rango
const isWithinRange = (value, start, end) =>
    value && start && end && value >= start && value <= end;

// Validar las horas de descanso
const validateBreakTime = (breakTime, otherBreakTime, start, end, isStart) => {
    if (!breakTime && otherBreakTime) {
        return isStart
            ? "Debe ingresar la hora de inicio del descanso si proporciona una hora de fin."
            : "Debe ingresar la hora de fin del descanso si proporciona una hora de inicio.";
    }

    if (breakTime && otherBreakTime && ((isStart && breakTime >= otherBreakTime) || (!isStart && breakTime <= otherBreakTime))) {
        return isStart
            ? "La hora de inicio del descanso debe ser anterior a la hora de fin."
            : "La hora de fin del descanso debe ser posterior a la hora de inicio.";
    }

    if (breakTime && !isWithinRange(breakTime, start, end)) {
        return isStart
            ? "La hora de inicio del descanso debe estar dentro de la jornada laboral."
            : "La hora de fin del descanso debe estar dentro de la jornada laboral.";
    }

    return ""; // Sin errores
};

// Validar horas de inicio y fin de la jornada
const validateWorkTime = (time, otherTime, isStart) => {
    if (!time) {
        return isStart
            ? "La hora de inicio es obligatoria."
            : "La hora de fin es obligatoria.";
    }

    if (time && otherTime && ((isStart && time >= otherTime) || (!isStart && time <= otherTime))) {
        return isStart
            ? "La hora de inicio debe ser anterior a la hora de fin."
            : "La hora de fin debe ser posterior a la hora de inicio.";
    }

    return ""; // Sin errores
};

// Validar días de descanso
const validateRestDays = (restDays) => {
    return Array.isArray(restDays) && restDays.length === 0
        ? "Selecciona al menos un día de descanso."
        : "";
};

// Validación principal
const validateField = (name, value, formData) => {
    const { start_time, end_time, break_start_time, break_end_time, rest_days } = formData;

    switch (name) {
        case "name":
            return !value ? "El nombre es obligatorio." : "";
        case "start_time":
            return validateWorkTime(value, end_time, true);
        case "end_time":
            return validateWorkTime(value, start_time, false);
        case "break_start_time":
            return validateBreakTime(value, break_end_time, start_time, end_time, true);
        case "break_end_time":
            return validateBreakTime(value, break_start_time, start_time, end_time, false);
        case "rest_days":
            return validateRestDays(rest_days);
        default:
            return "";
    }
};

// Función auxiliar para validar todos los campos
const validateAllFields = (formData) => ({
    name: validateField("name", formData.name, formData),
    start_time: validateField("start_time", formData.start_time, formData),
    end_time: validateField("end_time", formData.end_time, formData),
    break_start_time: validateField("break_start_time", formData.break_start_time, formData),
    break_end_time: validateField("break_end_time", formData.break_end_time, formData),
    rest_days: validateField("rest_days", formData.rest_days, formData),
});


// Constantes para los días de la semana
const WEEK_DAYS_OPTIONS = [
    { label: "Domingo", value: 0 },
    { label: "Lunes", value: 1 },
    { label: "Martes", value: 2 },
    { label: "Miércoles", value: 3 },
    { label: "Jueves", value: 4 },
    { label: "Viernes", value: 5 },
    { label: "Sábado", value: 6 },
];


const ScheduleDefinitionForm = ({
    onSubmit,
    onCancel,
    formErrors = {},
    isEditing = false,
    initialData = {},
    confirmButtonText = isEditing ? "Actualizar" : "Crear",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-600",
    cancelButtonColor = "border-gray-400",
}) => {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        start_time: initialData.start_time || "",
        end_time: initialData.end_time || "",
        break_start_time: initialData.break_start_time || "",
        break_end_time: initialData.break_end_time || "",
        rest_days: (initialData.rest_days || []).map((day) => ({
            label: WEEK_DAYS_OPTIONS.find((option) => option.value === day)?.label || "",
            value: day,
        })),
    });

    const [errors, setErrors] = useState({});
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        const fieldError = validateField(name, value, { ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
    };

    const handleRestDaysChange = (selectedOptions) => {
        const formattedOptions = selectedOptions.map((option) => ({
            label: option.label,
            value: option.value,
        }));
        setFormData((prev) => ({ ...prev, rest_days: formattedOptions }));
        // Validar inmediatamente después de actualizar
        const fieldError = validateField("rest_days", formattedOptions, {
            ...formData,
            rest_days: formattedOptions,
        });
        setErrors((prev) => ({ ...prev, rest_days: fieldError }));
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitAttempted(true);
        const validationErrors = validateAllFields(formData);
        setErrors(validationErrors);
        if (Object.values(validationErrors).every((error) => !error)) {
            const formattedData = {
                ...formData,
                rest_days: formData.rest_days.map((day) => day.value),
            };
            onSubmit(formattedData);
        }
    };

    const hasErrors = Object.values(errors).some((error) => error);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombre del Horario */}
            <div>
                <Input
                    label="Nombre del Horario"
                    type="text"
                    name="name"
                    placeholder={"Ej. Horario Matutino"}
                    value={formData.name}
                    icon={GrScheduleNew}
                    onChange={handleChange}
                    error={errors.name}
                />
            </div>

            {/* Hora de Inicio y Fin */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        label="Inicio de Jornada"
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        icon={BsSunrise}
                        onChange={handleChange}
                        error={errors.start_time}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label="Fin de Jornada"
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        icon={BsSunset}
                        onChange={handleChange}
                        error={errors.end_time}
                    />
                </div>
            </div>

            {/* Break Inicio y Fin */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        label="Incio del Descanso"
                        type="time"
                        name="break_start_time"
                        value={formData.break_start_time}
                        icon={BsHourglassTop}
                        onChange={handleChange}
                        error={errors.break_start_time}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label="Fin del Descanso"
                        type="time"
                        name="break_end_time"
                        value={formData.break_end_time}
                        icon={BsHourglassBottom}
                        onChange={handleChange}
                        error={errors.break_end_time}
                    />
                </div>
            </div>

            {/* Días de Descanso */}
            <div>
                <TaggableSelect
                    label="Días de Descanso"
                    id="rest_days"
                    placeholder="Selecciona los días de descanso"
                    options={WEEK_DAYS_OPTIONS}
                    value={formData.rest_days}
                    onChange={handleRestDaysChange}
                    error={errors.rest_days}
                />
            </div>
            
            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="submit"
                    className={`p-2 px-1 rounded-xl text-white w-full outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitAttempted && hasErrors
                        ? `${confirmButtonColor} opacity-70 cursor-not-allowed`
                        : `${confirmButtonColor}`
                        }`}
                    disabled={isSubmitAttempted && hasErrors}
                >
                    {confirmButtonText}
                </button>
                <button
                    type="button"
                    className={`p-2 rounded-xl bg-transparent border border-dashed ${cancelButtonColor} w-full outline-none transform transition-all duration-300 hover:scale-105`}
                    onClick={onCancel}
                >
                    {cancelButtonText}
                </button>
            </div>
        </form>
    );
};

export default ScheduleDefinitionForm;
