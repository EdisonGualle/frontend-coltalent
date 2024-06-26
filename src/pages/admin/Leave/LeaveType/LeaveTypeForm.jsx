import React, { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";
import { validateDescripcion, validateNames } from "../../../../Utils/validationsV2";

const NAME_REQUIRED = "Por favor, ingrese el nombre del tipo de permiso.";
const DESCRIPTION_REQUIRED = "Por favor, ingrese la descripción del tipo de permiso.";
const ADVANCE_NOTICE_DAYS_REQUIRED = "Por favor, ingrese los días de anticipación.";
const REQUIRES_DOCUMENT_REQUIRED = "Por favor, seleccione si requiere documentación.";
const TIME_UNIT_REQUIRED = "Por favor, seleccione la unidad de tiempo.";
const MAX_DURATION_REQUIRED = "Por favor, ingrese la duración máxima.";

const LeaveTypeForm = ({
    leaveType,
    isEditing,
    onSubmit,
    onCancel,
    confirmButtonText = isEditing ? "Guardar cambios" : "Crear registro",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-500",
    cancelButtonColor = "border-gray-400",
    formErrors = {},
}) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        max_duration: "",
        time_unit: "",
        requires_document: "",
        advance_notice_days: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        max_duration: "",
        time_unit: "",
        requires_document: "",
        advance_notice_days: "",
    });

    const { name, description, max_duration, time_unit, requires_document, advance_notice_days } = formData;

    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    useEffect(() => {
        const isDisabled = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(isDisabled);
    }, [errors]);

    useEffect(() => {
        if (isEditing && leaveType) {
            setFormData({
                name: leaveType.name,
                description: leaveType.description,
                max_duration: leaveType.max_duration,
                time_unit: leaveType.time_unit,
                requires_document: leaveType.requires_document,
                advance_notice_days: leaveType.advance_notice_days,
            });

            setErrors({
                name: "",
                description: "",
                max_duration: "",
                time_unit: "",
                requires_document: "",
                advance_notice_days: "",
            });
        }
    }, [isEditing, leaveType]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        let error = "";
        if (value.trim() === "") {
            switch (name) {
                case "name":
                    error = NAME_REQUIRED;
                    break;
                case "description":
                    error = DESCRIPTION_REQUIRED;
                    break;
                case "advance_notice_days":
                    error = ADVANCE_NOTICE_DAYS_REQUIRED;
                    break;
                case "requires_document":
                    error = REQUIRES_DOCUMENT_REQUIRED;
                    break;
                case "time_unit":
                    error = TIME_UNIT_REQUIRED;
                    break;
                case "max_duration":
                    error = MAX_DURATION_REQUIRED;
                    break;
                default:
                    break;
            }
        } else {
            if (name === "name") {
                error = validateNames(value);
            }
            if (name === "description") {
                error = validateDescripcion(value);
            }
            if (name === "max_duration" && time_unit === "Días" && (value < 1 || value > 30)) {
                error = "La duración máxima en días debe estar entre 1 y 30.";
            } else if (name === "max_duration" && time_unit === "Horas" && (value < "00:30" || value > "07:30")) {
                error = "La duración máxima en horas debe estar entre 00:30 y 07:30.";
            } else if (name === "advance_notice_days" && (value < 1 || value > 10)) {
                error = "Los días de anticipación deben estar entre 1 y 10.";
            }
        }

        setErrors({
            ...errors,
            [name]: error,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameError = validateNames(name);
        const descriptionError = validateDescripcion(description);
        if (nameError || descriptionError) {
            setErrors({
                ...errors,
                name: nameError,
                description: descriptionError,
            });
            return;
        }

        if (!name || !description || !advance_notice_days || !requires_document || !time_unit || !max_duration) {
            setErrors({
                name: !name ? NAME_REQUIRED : "",
                description: !description ? DESCRIPTION_REQUIRED : "",
                advance_notice_days: !advance_notice_days ? ADVANCE_NOTICE_DAYS_REQUIRED : "",
                requires_document: !requires_document ? REQUIRES_DOCUMENT_REQUIRED : "",
                time_unit: !time_unit ? TIME_UNIT_REQUIRED : "",
                max_duration: !max_duration ? MAX_DURATION_REQUIRED : "",
            });
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
                <Input
                    label="Nombre"
                    name="name"
                    placeholder="Ejemplo: Vacaciones"
                    value={name}
                    onChange={handleChange}
                    error={errors.name}
                />
                <Textarea
                    label="Descripción"
                    id="description"
                    placeholder="Ejemplo: Permiso anual remunerado"
                    value={description}
                    onChange={handleChange}
                    error={errors.description}
                    rows={2}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-800 font-semibold">Unidad de tiempo</label>
                        <div className="flex items-center">
                            <label className="flex items-center mr-4">
                                <input
                                    type="radio"
                                    name="time_unit"
                                    value="Días"
                                    checked={time_unit === "Días"}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm">Días</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="time_unit"
                                    value="Horas"
                                    checked={time_unit === "Horas"}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm">Horas</span>
                            </label>
                        </div>
                        {errors.time_unit && (
                            <span className="text-red-500 text-xs">{errors.time_unit}</span>
                        )}
                    </div>
                    {time_unit === "Días" && (
                        <Input
                            label="Duración máxima en días"
                            name="max_duration"
                            type="number"
                            placeholder="5"
                            value={max_duration}
                            onChange={handleChange}
                            error={errors.max_duration}
                        />
                    )}
                    {time_unit === "Horas" && (
                        <Input
                            label="Duración máxima en horas"
                            name="max_duration"
                            type="time"
                            placeholder="Ejemplo: 07:30"
                            value={max_duration}
                            onChange={handleChange}
                            error={errors.max_duration}
                            min="00:30"
                            max="07:30"
                        />
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-800 font-semibold">Requiere documentación</label>
                        <div className="flex items-center">
                            <label className="flex items-center mr-8">
                                <input
                                    type="radio"
                                    name="requires_document"
                                    value="Si"
                                    checked={requires_document === "Si"}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm">Si</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="requires_document"
                                    value="No"
                                    checked={requires_document === "No"}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm">No</span>
                            </label>
                        </div>
                        {errors.requires_document && (
                            <span className="text-red-500 text-xs">{errors.requires_document}</span>
                        )}
                    </div>
                    <Input
                        label="Días de anticipación"
                        name="advance_notice_days"
                        type="number"
                        placeholder="2"
                        value={advance_notice_days}
                        onChange={handleChange}
                        error={errors.advance_notice_days}
                        min="1"
                        max="10"
                    />
                </div>
            </div>
            <div className="flex items-center gap-x-2 mt-4">
                <button
                    type="submit"
                    className={`p-2 px-4 rounded-xl text-white w-full outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitDisabled
                        ? `bg-gray-400 opacity-70 cursor-not-allowed`
                        : `${confirmButtonColor}`
                        }`}
                    disabled={isSubmitDisabled}
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

export default LeaveTypeForm;
