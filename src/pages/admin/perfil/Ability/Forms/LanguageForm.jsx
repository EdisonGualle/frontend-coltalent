import React, { useState, useEffect } from "react";
import Input from "../../../../../components/ui/Input";
import { RiSpeakLine } from "react-icons/ri";
import { PiCertificate } from "react-icons/pi";
import { LiaUniversitySolid } from "react-icons/lia";
import { TfiWrite } from "react-icons/tfi";
import { LuLanguages } from "react-icons/lu";
import { validateLanguage } from "../../../../../Utils/validationsV2";

const LANGUAGE_REQUIRED = "Se requiere el idioma.";
const SPOKEN_LEVEL_REQUIRED = "Se requiere el nivel de habla.";
const WRITTEN_LEVEL_REQUIRED = "Se requiere el nivel de escritura.";
const LEVEL_OUT_OF_RANGE = "El nivel debe estar entre 1 y 100.";
const CERTIFICATE_AND_INSTITUTION_REQUIRED = "Debe ingresar tanto el certificado de suficiencia como la institución emisora.";

const LanguageForm = ({
    languageForm,
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
        language: "",
        spoken_level: "",
        written_level: "",
        proficiency_certificate: "",
        issuing_institution: "",
    });
    const [errors, setErrors] = useState({
        language: "",
        spoken_level: "",
        written_level: "",
        proficiency_certificate: "",
        issuing_institution: "",
    });

    // Desestructurar los datos del formulario
    const { language, spoken_level, written_level, proficiency_certificate, issuing_institution } = formData;

    // Efecto para actualizar los errores del formulario
    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    // Efecto para actualizar el estado de deshabilitación del botón cuando los errores cambian
    useEffect(() => {
        const isDisabled = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(isDisabled);
    }, [errors]);

    // Efecto para cargar los datos del idioma a editar
    useEffect(() => {
        if (isEditing) {
            setFormData({
                language: languageForm.language,
                spoken_level: languageForm.spoken_level,
                written_level: languageForm.written_level,
                proficiency_certificate: languageForm.proficiency_certificate,
                issuing_institution: languageForm.issuing_institution,
            });
            setErrors({
                language: "",
                spoken_level: "",
                written_level: "",
                proficiency_certificate: "",
                issuing_institution: "",
            });
        }
    }, [isEditing, languageForm]);

    // Función para manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "spoken_level" || name === "written_level") {
            newValue = Math.max(1, Math.min(100, Number(value)));
        }

        setFormData({ ...formData, [name]: newValue });

        let newErrors = { ...errors };

        // Limpiar errores específicos del backend al escribir en los campos
        newErrors[name] = "";

        if (name === "spoken_level") {
            newErrors.spoken_level = !newValue ? SPOKEN_LEVEL_REQUIRED : "";
        } else if (name === "written_level") {
            newErrors.written_level = !newValue ? WRITTEN_LEVEL_REQUIRED : "";
        } else if (name === "language" && !newValue) {
            newErrors.language = LANGUAGE_REQUIRED;
        }

        if ((name === "proficiency_certificate" || name === "issuing_institution") && (proficiency_certificate || issuing_institution)) {
            if (!newValue) {
                newErrors.proficiency_certificate = !proficiency_certificate ? "" : newErrors.proficiency_certificate;
                newErrors.issuing_institution = !issuing_institution ? "" : newErrors.issuing_institution;
                newErrors[name] = CERTIFICATE_AND_INSTITUTION_REQUIRED;
            } else {
                newErrors.proficiency_certificate = "";
                newErrors.issuing_institution = "";
            }
        }

        setErrors(newErrors);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        let newErrors = { ...errors };

        if (name === "language" && value) {
            const validationError = validateLanguage(value);
            newErrors.language = validationError ? validationError : "";
        }

        setErrors(newErrors);
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            language: !language ? LANGUAGE_REQUIRED : errors.language,
            spoken_level: !spoken_level ? SPOKEN_LEVEL_REQUIRED : (spoken_level < 1 || spoken_level > 100 ? LEVEL_OUT_OF_RANGE : ""),
            written_level: !written_level ? WRITTEN_LEVEL_REQUIRED : (written_level < 1 || written_level > 100 ? LEVEL_OUT_OF_RANGE : ""),
        };

        if ((proficiency_certificate && !issuing_institution) || (!proficiency_certificate && issuing_institution)) {
            newErrors.proficiency_certificate = CERTIFICATE_AND_INSTITUTION_REQUIRED;
            newErrors.issuing_institution = CERTIFICATE_AND_INSTITUTION_REQUIRED;
        }

        setErrors(newErrors);

        // Verificar si hay errores
        const hasErrors = Object.values(newErrors).some((error) => error !== "");

        if (!hasErrors) {
            // Crear el objeto con los datos del formulario
            const updateLanguageData = {
                language,
                spoken_level,
                written_level,
                proficiency_certificate,
                issuing_institution,
            };
            console.log(updateLanguageData);
            // Enviar los datos al componente padre
            onSubmit(updateLanguageData);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Idioma"
                        name="language"
                        placeholder={"Ej: Inglés"}
                        value={language}
                        icon={LuLanguages}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.language}
                    />
                    <Input
                        label="Certificado de Suficiencia"
                        name="proficiency_certificate"
                        placeholder={"Ej: IELTS"}
                        value={proficiency_certificate}
                        icon={PiCertificate}
                        onChange={handleChange}
                        error={errors.proficiency_certificate}
                    />
                    <Input
                        label="Nivel Hablado"
                        type="number"
                        name="spoken_level"
                        placeholder="Ej: 100"
                        value={spoken_level}
                        onChange={handleChange}
                        icon={RiSpeakLine}
                        error={errors.spoken_level}
                        min={1}
                        max={100}
                    />
                    <Input
                        label="Nivel Escrito"
                        type="number"
                        name="written_level"
                        placeholder={"Ej: 50"}
                        value={written_level}
                        onChange={handleChange}
                        icon={TfiWrite}
                        error={errors.written_level}
                        min={1}
                        max={100}
                    />
                    <div className="col-span-2">
                        <Input
                            label="Institución Emisora"
                            placeholder={"Ej: Universidad de los Andes"}
                            name="issuing_institution"
                            icon={LiaUniversitySolid}
                            value={issuing_institution}
                            onChange={handleChange}
                            error={errors.issuing_institution}
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
        </div>
    );
};

export default LanguageForm;
