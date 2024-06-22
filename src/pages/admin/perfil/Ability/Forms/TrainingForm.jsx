import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../../../components/ui/Input";
import CustomSelect from "../../../../../components/ui/Select";
import { fetchTrainingTypes } from "../../../../../redux/Employee/Education/trainingTypeSlince";
import { FaUniversity, FaLightbulb, FaRegClock, FaCalendarCheck } from "react-icons/fa";

const INSTITUTION_REQUIRED = "Se requiere la institución.";
const TOPIC_REQUIRED = "Se requiere el tema.";
const TRAINING_TYPE_REQUIRED = "Se requiere el tipo de capacitación.";
const YEAR_REQUIRED = "Se requiere el año.";
const NUM_HOURS_REQUIRED = "Se requiere el número de horas.";

const TrainingForm = ({
    training,
    isEditing,
    onSubmit,
    onCancel,
    confirmButtonText = isEditing ? "Guardar cambios" : "Crear registro",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-500",
    cancelButtonColor = "border-gray-400",
    formErrors = {},
}) => {
    const dispatch = useDispatch();
    const trainingTypesState = useSelector((state) => state.trainingType);

    const trainingTypes = trainingTypesState?.trainingTypes || [];

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    // Estados locales para manejar los errores y los datos del formulario
    const [formData, setFormData] = useState({
        institution: "",
        topic: "",
        selectTrainingType: null,
        year: "",
        num_hours: "",
    });
    const [errors, setErrors] = useState({
        institution: "",
        topic: "",
        training_type_id: "",
        year: "",
        num_hours: "",
    });

    // Desestructurar los datos del formulario
    const { institution, topic, selectTrainingType, year, num_hours } = formData;

    // Efecto para actualizar los errores del formulario
    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    // Efecto para cargar los tipos de capacitación
    useEffect(() => {
        dispatch(fetchTrainingTypes());
    }, []);

    // Efecto para actualizar el estado de deshabilitacion del botón de envío cuando cuabdo los errores cambian
    useEffect(() => {
        const isDisabled = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(isDisabled);
    }, [errors]);

    // Efecto para cargar los datos del formulario si se está editando
    useEffect(() => {
        if (isEditing && training && trainingTypes.length > 0) {
            const trainingType = trainingTypes.find((training_type) => training_type.id === training?.training_type?.id);

            setFormData({
                institution: training.institution,
                topic: training.topic,
                selectTrainingType: trainingType ? { value: trainingType.id, label: trainingType.name } : null,
                year: training.year,
                num_hours: training.num_hours,
            });

            setErrors({
                institution: "",
                topic: "",
                training_type_id: "",
                year: "",
                num_hours: "",
            });
        }
    }, [isEditing, training, trainingTypes]);

    // Función para manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "institution") {
            const institutionError = !value ? INSTITUTION_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, institution: institutionError }));
        } else if (name === "topic") {
            const topicError = !value ? TOPIC_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, topic: topicError }));
        } else if (name === "year") {
            const yearError = !value ? YEAR_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, year: yearError }));
        } else if (name === "num_hours") {
            const numHoursError = !value ? NUM_HOURS_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, num_hours: numHoursError }));
        }

        setFormData({ ...formData, [name]: value });

    };

    // Función para manejar el cambio en el campo de tipo de capacitación
    const handleTrainingTypeChange = (option) => {
        setFormData({ ...formData, selectTrainingType: option });
        setErrors((prevErrors) => ({
            ...prevErrors,
            training_type_id: option ? "" : TRAINING_TYPE_REQUIRED
        }));
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            institution: institution ? "" : INSTITUTION_REQUIRED,
            topic: topic ? "" : TOPIC_REQUIRED,
            training_type_id: selectTrainingType ? "" : TRAINING_TYPE_REQUIRED,
            year: year ? "" : YEAR_REQUIRED,
            num_hours: num_hours ? "" : NUM_HOURS_REQUIRED,
        };

        setErrors(newErrors);

        // Verificar si hay errores en el formulario antes de enviarlo

        const hasErrors = Object.values(newErrors).some((error) => error !== "");
        if (!hasErrors) {

            const trainingTypeId = selectTrainingType ? selectTrainingType.value.id : null;

            // Crear un objeto con los datos del formulario
            const updateTrainingData = {
                institution,
                topic,
                training_type_id: trainingTypeId,
                year,
                num_hours,
            };

            // Enviar los datos al componente padre
            onSubmit(updateTrainingData);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Tema"
                        name="topic"
                        placeholder={"Ej. Técnicas de programación en Java"}
                        value={topic}
                        icon={FaLightbulb}
                        onChange={handleChange}
                        error={errors.topic}
                    />
                    <Input
                        label="Institución"
                        name="institution"
                        placeholder={"Ej. Universidad Estatal de Milagro"}
                        value={institution}
                        icon={FaUniversity}
                        onChange={handleChange}
                        error={errors.institution}
                    />
                    <CustomSelect
                        label="Tipo de capacitación"
                        options={trainingTypes}
                        value={selectTrainingType}
                        onChange={handleTrainingTypeChange}
                        placeholder="Seleccionar tipo de capacitación"
                        error={errors.training_type_id}
                        isSearchable={true}
                        labelKey="name"
                    />
                    <Input
                        label="Año"
                        name="year"
                        placeholder="Ej. 2023"
                        value={year}
                        icon={FaCalendarCheck}
                        type="number"
                        min="1990"
                        max={new Date().getFullYear()}
                        onChange={handleChange}
                        error={errors.year}
                    />
                    <Input
                        label="Número de horas"
                        name="num_hours"
                        placeholder="Ej. 40"
                        value={num_hours}
                        icon={FaRegClock}
                        type="number"
                        min="10"
                        max="1000"
                        onChange={handleChange}
                        error={errors.num_hours}
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

export default TrainingForm;