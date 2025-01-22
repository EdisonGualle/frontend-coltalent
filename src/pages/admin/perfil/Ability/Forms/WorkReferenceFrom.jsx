import React, { useState, useEffect } from "react";
import Input from "../../../../../components/ui/Input";
import { FaUserTie, FaPhone } from "react-icons/fa";
import { BsBriefcase } from "react-icons/bs";
import { BsBuildings } from "react-icons/bs";
import { PiHandshake } from "react-icons/pi";

const NAME_REQUIRED = "Se requiere el nombre";
const POSITION_REQUIRED = "Se requiere la posición";
const COMPANY_NAME_REQUIRED = "Se requiere el nombre de la empresa";
const CONTACT_NUMBER_REQUIRED = "Se requiere el número de contacto";
const RELATIONSHIP_TYPE_REQUIRED = "Se requiere el tipo de relación laboral";

const workReferenceForm = ({
    workReference,
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

    // Estados locales para manejar los errores y valores del formulario
    const [fromData, setFormData] = useState({
        name: "",
        position: "",
        company_name: "",
        contact_number: "",
        relationship_type: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        position: "",
        company_name: "",
        contact_number: "",
        relationship_type: "",
    });

    // Desestructurar los datos del formulario
    const { name, position, company_name, contact_number, relationship_type } = fromData;

    // Efecto para actualiar los errores del formulario
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
        if (isEditing && workReference) {
            setFormData({
                name: workReference.name,
                position: workReference.position,
                company_name: workReference.company_name,
                contact_number: workReference.contact_number,
                relationship_type: workReference.relationship_type,
            });

            setErrors({
                name: "",
                position: "",
                company_name: "",
                contact_number: "",
                relationship_type: "",
            });
        }
    }, [isEditing, workReference]);

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "name") {
            // Validar que el nombre tenga mínimo 2 palabras y máximo 4, sin caracteres especiales
            const words = value.trim().split(/\s+/);
            const hasSpecialCharacters = /[^a-zA-Z\s]/.test(value);
    
            let nameError = "";
            if (!value) {
                nameError = NAME_REQUIRED;
            } else if (words.length < 2) {
                nameError = "El nombre debe contener al menos 2 palabras.";
            } else if (words.length > 4) {
                nameError = "El nombre no puede contener más de 4 palabras.";
            } else if (hasSpecialCharacters) {
                nameError = "El nombre no puede contener caracteres especiales.";
            }
    
            setErrors((prevErrors) => ({ ...prevErrors, name: nameError }));
        } else if (name === "position") {
            const positionError = !value ? POSITION_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, position: positionError }));
        } else if (name === "company_name") {
            const companyNameError = !value ? COMPANY_NAME_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, company_name: companyNameError }));
        } else if (name === "contact_number") {
            // Validar que el número tenga exactamente 10 dígitos y comience con 09 o 08
            const isValidNumber = /^0[89]\d{8}$/.test(value);
            let contactNumberError = "";
    
            if (!value) {
                contactNumberError = CONTACT_NUMBER_REQUIRED;
            } else if (!isValidNumber) {
                contactNumberError =
                    "El número debe tener 10 dígitos y comenzar con 09 o 08.";
            }
    
            setErrors((prevErrors) => ({
                ...prevErrors,
                contact_number: contactNumberError,
            }));
        } else if (name === "relationship_type") {
            // Validar que solo contenga letras y espacios
            const isValidRelationshipType = /^[a-zA-Z\s]+$/.test(value);
            let relationshipTypeError = "";
    
            if (!value) {
                relationshipTypeError = RELATIONSHIP_TYPE_REQUIRED;
            } else if (!isValidRelationshipType) {
                relationshipTypeError = "El tipo de relación solo puede contener letras.";
            }
    
            setErrors((prevErrors) => ({
                ...prevErrors,
                relationship_type: relationshipTypeError,
            }));
        }
    
        setFormData({ ...fromData, [name]: value });
    };
    
    
    
    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            name: name ? "" : NAME_REQUIRED,
            position: position ? "" : POSITION_REQUIRED,
            company_name: company_name ? "" : COMPANY_NAME_REQUIRED,
            contact_number: contact_number ? "" : CONTACT_NUMBER_REQUIRED,
            relationship_type: relationship_type ? "" : RELATIONSHIP_TYPE_REQUIRED,
        };

        setErrors(newErrors);

        // Verificar si hay errores en el formulario antes de enviarlo
        const hasErrors = Object.values(newErrors).some((error) => error !== "");
        if (!hasErrors) {
            // Crear un objeto con los datos del formulario
            const workReferenceData = {
                name,
                position,
                company_name,
                contact_number,
                relationship_type,
            };


    
            // Enviar los datos al componente padre
            onSubmit(workReferenceData);
        }

        console.log(workReference.id);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        name="name"
                        placeholder={"Ej. Edison Gualle"}
                        value={name}
                        icon={FaUserTie}
                        onChange={handleChange}
                        error={errors.name}
                    />
                    <Input
                        label="Posición"
                        name="position"
                        placeholder={"Ej. Desarrollador de software"}
                        value={position}
                        icon={BsBriefcase}
                        onChange={handleChange}
                        error={errors.position}
                    />
                     <Input
                        label="Nombre de la empresa"
                        name="company_name"
                        placeholder={"Ej. Google"}
                        value={company_name}
                        icon={BsBuildings}
                        onChange={handleChange}
                        error={errors.company_name}
                    />
                    <Input
                        label="Número de contacto"
                        name="contact_number"
                        placeholder={"Ej. 0987654321"}
                        value={contact_number}
                        icon={FaPhone}
                        onChange={handleChange}
                        error={errors.contact_number}
                    />
                    <Input
                        label="Tipo de relación laboral"
                        name="relationship_type"
                        placeholder={"Ej. Jefe directo"}
                        value={relationship_type}
                        icon={PiHandshake}
                        onChange={handleChange}
                        error={errors.relationship_type}
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

    )

};

export default workReferenceForm;



