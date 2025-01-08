import React, { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";
import { validateDescripcion, validateNames } from "../../../../Utils/validationsV2";

import { FaHouseDamage, FaUmbrellaBeach, FaBriefcaseMedical, FaHome, FaUserMd, FaUniversity, FaPlus, FaPlane, FaHospital, FaChild, FaGraduationCap, FaSuitcase, FaRegClock } from 'react-icons/fa';
import { FaHandshakeAngle } from "react-icons/fa6";
import Select from 'react-select';
import { getConfigurations } from "../../../../services/configurationService";



// Mapeo de nombres de iconos a componentes de iconos
const iconOptions = {
    FaUmbrellaBeach,        // Vacaciones
    FaBriefcaseMedical,     // Atención médica
    FaHandshakeAngle,       // Compensación
    FaHouseDamage,          // Calamidad doméstica
    FaHome,                 // Trabajo remoto
    FaUserMd,               // Médico
    FaUniversity,           // Institucional
    FaPlus,                 // Por defecto
    FaPlane,                // Viaje
    FaHospital,             // Hospitalización
    FaChild,                // Cuidado de hijos
    FaGraduationCap,        // Estudio
    FaSuitcase,             // Trabajo
    FaRegClock              // Compensación de tiempo
};

const options = Object.keys(iconOptions).map(key => ({
    value: key,
    label: (
        <div className="flex items-center">
            {React.createElement(iconOptions[key], { className: 'mr-2' })}
            <span>{key}</span>
        </div>
    ),
    icon: React.createElement(iconOptions[key])
}));


const NAME_REQUIRED = "Por favor, ingrese el nombre del tipo de permiso.";
const DESCRIPTION_REQUIRED = "Por favor, ingrese la descripción del tipo de permiso.";
const ADVANCE_NOTICE_DAYS_REQUIRED = "Por favor, ingrese los días de anticipación.";
const TIME_UNIT_REQUIRED = "Por favor, seleccione la unidad de tiempo.";
const MAX_DURATION_REQUIRED = "Por favor, ingrese la duración máxima.";
const ICON_REQUIRED = "Por favor, seleccione un icono.";

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
        icon: "",
        deducts_from_vacation: 0,
    });
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        max_duration: "",
        time_unit: "",
        advance_notice_days: "",
        icon: "",
        deducts_from_vacation: "",
    });

    const [configurations, setConfigurations] = useState({});

    const { name, description, max_duration, time_unit, requires_document, advance_notice_days, icon, color } = formData;

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
                advance_notice_days: leaveType.advance_notice_days,
                icon: leaveType.icon,
                deducts_from_vacation: leaveType.deducts_from_vacation ? 1 : 0,
            });

            setErrors({
                name: "",
                description: "",
                max_duration: "",
                time_unit: "",
                requires_document: "",
                advance_notice_days: "",
                icon: "",
                deducts_from_vacation: "",
            });
        }
    }, [isEditing, leaveType]);

    useEffect(() => {
        const fetchConfigurations = async () => {
            try {
                const response = await getConfigurations();

                // Accede al array dentro de la propiedad data
                const configArray = Array.isArray(response.data) ? response.data : [];

                const configData = {};
                configArray.forEach(config => {
                    configData[config.key] = config.value;
                });

                setConfigurations(configData);
            } catch (error) {
                console.error("Error al cargar las configuraciones:", error);
            }
        };

        fetchConfigurations();
    }, []);



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
                case "time_unit":
                    error = TIME_UNIT_REQUIRED;
                    break;
                case "max_duration":
                    error = MAX_DURATION_REQUIRED;
                    break;
                case "icon":
                    error = ICON_REQUIRED;
                    break;
                default:
                    break;
            }
        } else if (Object.keys(configurations).length > 0) { // Validar solo si las configuraciones están listas
            if (name === "max_duration" && time_unit === "Días" && (value < 1 || value > parseInt(configurations.max_duration_days))) {
                error = `La duración máxima en días debe estar entre 1 y ${configurations.max_duration_days}.`;
            } else if (name === "max_duration" && time_unit === "Horas") {
                const [hours, minutes] = value.split(":").map(Number);
                const totalMinutes = hours * 60 + minutes;
                const minDuration = parseInt(configurations.max_duration_hours_min.split(":")[0]) * 60 + parseInt(configurations.max_duration_hours_min.split(":")[1]);
                const maxDuration = parseInt(configurations.max_duration_hours_max.split(":")[0]) * 60 + parseInt(configurations.max_duration_hours_max.split(":")[1]);

                if (totalMinutes < minDuration || totalMinutes > maxDuration) {
                    error = `La duración máxima en horas debe estar entre ${configurations.max_duration_hours_min} y ${configurations.max_duration_hours_max}.`;
                }
            } else if (name === "advance_notice_days" && (value < 1 || value > parseInt(configurations.advance_notice_days))) {
                error = `Los días de anticipación deben estar entre 1 y ${configurations.advance_notice_days}.`;
            }
        }

        setErrors({
            ...errors,
            [name]: error,
        });
    };
    const handleIconChange = (selectedOption) => {
        setFormData({
            ...formData,
            icon: selectedOption ? selectedOption.value : "",
        });
        setErrors({
            ...errors,
            icon: selectedOption ? "" : ICON_REQUIRED,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const nameError = validateNames(name);
        const descriptionError = validateDescripcion(description);
    
        if (nameError || descriptionError) {
            console.log("Errores encontrados:", { nameError, descriptionError });
            setErrors({
                ...errors,
                name: nameError,
                description: descriptionError,
            });
            return;
        }
    
        if (!name || !description || !advance_notice_days || !time_unit || !max_duration || !icon) {
            setErrors({
                name: !name ? NAME_REQUIRED : "",
                description: !description ? DESCRIPTION_REQUIRED : "",
                advance_notice_days: !advance_notice_days
                    ? ADVANCE_NOTICE_DAYS_REQUIRED
                    : "",
                time_unit: !time_unit ? TIME_UNIT_REQUIRED : "",
                max_duration: !max_duration ? MAX_DURATION_REQUIRED : "",
                icon: !icon ? ICON_REQUIRED : "",
            });
            return;
        }
    
    
        if (typeof onSubmit === "function") {
            onSubmit({
                ...formData,
                requires_document: requires_document || "No",
            });
        } 
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
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col">
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="deducts_from_vacation"
                                name="deducts_from_vacation"
                                checked={formData.deducts_from_vacation === 1}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        deducts_from_vacation: e.target.checked ? 1 : 0, // 1 = Sí, 0 = No
                                    })
                                }
                                className="w-4 h-4 mt-1"
                            />
                            <label htmlFor="deducts_from_vacation" className="font-semibold">
                                Deducible de vacaciones
                            </label>
                        </div>
                        <span className="text-xs ps-6">Indica si el permiso deduce días de vacaciones.</span>
                        {errors.deducts_from_vacation && (
                            <span className="text-xs text-red-500 ps-6">{errors.deducts_from_vacation}</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-800 font-semibold">Icono</label>
                        <Select
                            options={options}
                            value={options.find(option => option.value === icon)}
                            onChange={handleIconChange}
                            className="border border-gray-300 rounded-lg p-2 w-full text-sm"
                            placeholder="Seleccione un icono"
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                menu: base => ({ ...base, zIndex: 9999 }),
                                menuList: base => ({
                                    ...base,
                                    maxHeight: 160,
                                    overflowY: 'auto',
                                }),
                                control: base => ({
                                    ...base,
                                    overflow: 'visible'
                                }),
                                container: base => ({
                                    ...base,
                                    position: 'relative',
                                    zIndex: 9999,
                                }),
                                dropdownIndicator: base => ({
                                    ...base,
                                    zIndex: 9999,
                                }),
                            }}
                            menuPlacement="auto"
                            menuPosition="fixed"
                        />
                        {errors.icon && (
                            <span className="text-red-500 text-xs">{errors.icon}</span>
                        )}
                    </div>

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