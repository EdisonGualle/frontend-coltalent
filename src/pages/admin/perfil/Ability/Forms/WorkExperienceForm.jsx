import React, { useState, useEffect } from "react";
import Input from "../../../../../components/ui/Input";
import Textarea from "../../../../../components/ui/Textarea"
import { AiOutlineCalendar } from "react-icons/ai";
import { BsCalendarCheck } from "react-icons/bs";
import { MdWorkOutline, MdOutlineBusinessCenter} from "react-icons/md";

const FROM_REQUIRED = "Se requiere la fecha de inicio.";
const TO_REQUIRED = "Se requiere la fecha de finalización.";
const POSITION_REQUIRED = "Se requiere la posición.";
const INSTITUTION_REQUIRED = "Se requiere la institución.";
const RESPONSIBILITIES_REQUIRED = "Se requieren las responsabilidades.";

const WorkExperienceForm = ({
    workExperience,
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

    // Estados locales para manejar los errores y los datos del formulario
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        position: "",
        institution: "",
        responsibilities: "",
        activities: "",
        functions: "",
        departure_reason: "",
        note: "",
    });
    const [errors, setErrors] = useState({
        from: "",
        to: "",
        position: "",
        institution: "",
        responsibilities: "",
        activities: "",
        functions: "",
        departure_reason: "",
        note: "",
    });

    // Desestructurar los datos del formulario
    const { from, to, position, institution, responsibilities, activities, functions, departure_reason, note } = formData;

    // Efecto para actualizar los errores del formulario
    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    // Efecto para actualizar el estado de deshabilitacion del botón de envío cuando cuabdo los errores cambian
    useEffect(() => {
        const isDisabled = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(isDisabled);
    }, [errors]);

    // Efecto para cargar los datos del formulario cuando se editando
    useEffect(() => {
        if (isEditing && workExperience) {
            setFormData({
                from: workExperience.from,
                to: workExperience.to,
                position: workExperience.position,
                institution: workExperience.institution,
                responsibilities: workExperience.responsibilities,
                activities: workExperience.activities,
                functions: workExperience.functions,
                departure_reason: workExperience.departure_reason,
                note: workExperience.note,
            });

            setErrors({
                from: "",
                to: "",
                position: "",
                institution: "",
                responsibilities: "",
                activities: "",
                functions: "",
                departure_reason: "",
                note: "",
            });
        }
    }, [isEditing, workExperience]);

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'from') {
            const fromError = !value ? FROM_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, from: fromError }));
        } else if (name === 'to') {
            const toError = !value ? TO_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, to: toError }));
        } else if (name === 'position') {
            const positionError = !value ? POSITION_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, position: positionError }));
        } else if (name === 'institution') {
            const institutionError = !value ? INSTITUTION_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, institution: institutionError }));
        } else if (name === 'responsibilities') {
            const responsibilitiesError = !value ? RESPONSIBILITIES_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, responsibilities: responsibilitiesError }));
        }

        setFormData({ ...formData, [name]: value });

    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            from: from ? "" : FROM_REQUIRED,
            to: to ? "" : TO_REQUIRED,
            position: position ? "" : POSITION_REQUIRED,
            institution: institution ? "" : INSTITUTION_REQUIRED,
            responsibilities: responsibilities ? "" : RESPONSIBILITIES_REQUIRED,
        };

        setErrors(newErrors);

        // Verificar si hay errores en el formulario antes de enviarlo
        const hasErrors = Object.values(newErrors).some((error) => error !== "");
        if (!hasErrors) {
            // Crear un objeto con los datos del formulario
            const updateWorkExperience = {
                from,
                to,
                position,
                institution,
                responsibilities,
                activities,
                functions,
                departure_reason,
                note,
            };
             
            // Enviar los datos al componente padre
            onSubmit(updateWorkExperience);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Desde"
                        name="from"
                        placeholder={"Ej. 01/01/2020"}
                        value={from}
                        icon={AiOutlineCalendar}
                        type="date"
                        min="1990-01-01"
                        max={new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                        error={errors.from}
                    />
                    <Input
                        label="Hasta"
                        name="to"
                        placeholder={"Ej. 01/01/2021"}
                        value={to}
                        icon={BsCalendarCheck}
                        type="date"
                        min="1990-01-01"
                        max={new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                        error={errors.to}
                    />
                    <Input
                        label="Posición"
                        name="position"
                        placeholder={"Ej. Desarrollador Fullstack"}
                        value={position}
                        icon={MdWorkOutline}
                        onChange={handleChange}
                        error={errors.position}
                    />
                    <Input
                        label="Institución"
                        name="institution"
                        placeholder={"Ej. Universidad Estatal de Milagro"}
                        value={institution}
                        icon={MdOutlineBusinessCenter}
                        onChange={handleChange}
                        error={errors.institution}
                    />
                    <Textarea
                        label="Responsabilidades"
                        id="responsibilities"
                        placeholder="Ej. Mi responsabilidad era desarrollar aplicaciones web"
                        value={responsibilities}
                        onChange={handleChange}
                        error={errors.responsibilities}
                        rows={2}
                    />
                    <Textarea
                        label="Actividades"
                        id="activities"
                        placeholder="Ej. Mis actividades eran analizar requerimientos"
                        value={activities}
                        onChange={handleChange}
                        error={errors.activities}
                        rows={2}
                    />
                    <Textarea
                        label="Funciones"
                        id="functions"
                        placeholder="Ej. Mis funciones eran liderar el equipo de desarrollo"
                        value={functions}
                        onChange={handleChange}
                        error={errors.functions}
                        rows={2}
                    />
                    <Textarea
                        label="Razón de Salida"
                        id="departure_reason"
                        placeholder="Ej. Salí de la empresa por motivos personales"
                        value={departure_reason}
                        onChange={handleChange}
                        error={errors.departure_reason}
                        rows={2}
                    />
                    <Textarea
                        label="Nota"
                        id="note"
                        placeholder="Ej. Nota adicional"
                        value={note}
                        onChange={handleChange}
                        error={errors.note}
                        rows={2}
                    />
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
        </div>
    );
};

export default WorkExperienceForm;
