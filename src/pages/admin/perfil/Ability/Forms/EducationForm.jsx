import React, { useState, useEffect } from "react";
import Input from "../../../../../components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../../../../components/ui/Select";
import { fetchEducationLevels } from "../../../../../redux/Employee/Education/educationLevelSince";
import { fetchEducationStates } from "../../../../../redux/Employee/Education/educationStateSince";
import { RiBuilding2Line } from "react-icons/ri";
import { MdOutlineSubtitles } from "react-icons/md";

const LEVEL_REQUIRED = "Se requiere el nivel de educación.";
const INSTITUTION_REQUIRED = "Se requiere el nombre de la institución.";
const TITLE_REQUIRED = "Se requiere un título.";
const STATE_REQUIRED = "Se requiere el estado de la educación.";

const EducationForm = ({
    education,
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
    const educationLevelsState = useSelector((state) => state.educationLevel);
    const educationStatesState = useSelector((state) => state.educationState);

    const educationLevels = educationLevelsState?.educationLevels || [];
    const educationStates = educationStatesState?.educationStates || [];

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    // Estados locales para manejar los errores y los datos del formulario
    const [formData, setFormData] = useState({
        selectEducationLevel: null,
        institution: "",
        title: "",
        selectEducationState: null,
    });
    const [errors, setErrors] = useState({
        level_id: "",
        institution: "",
        title: "",
        state_id: "",
    });

    // Desestructurar los datos del formulario
    const { selectEducationLevel, institution, title, selectEducationState } = formData;

    // Efecto para actualizar los errores del formulario
    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    // Efecto para cargar los niveles de educación y estados
    useEffect(() => {
        dispatch(fetchEducationLevels());
        dispatch(fetchEducationStates());
    }, [dispatch]);

    // Efecto para cargar los datos de la educación a editar
    useEffect(() => {
        if (isEditing && education && educationLevels.length > 0 && educationStates.length > 0) {
            const educationLevel = educationLevels.find((level) => level.id === education?.level?.id);
            const educationState = educationStates.find((state) => state.id === education?.state?.id);

            const institutionError = !education.institution ? INSTITUTION_REQUIRED : "";
            const titleError = !education.title ? TITLE_REQUIRED : "";

            setFormData({
                selectEducationLevel: educationLevel ? { value: educationLevel.id, label: educationLevel.name } : null,
                institution: education.institution,
                title: education.title,
                selectEducationState: educationState ? { value: educationState.id, label: educationState.name } : null,
            });
            setErrors({
                level_id: "",
                institution: institutionError,
                title: titleError,
                state_id: "",
            });
        }
    }, [education, isEditing, educationLevels, educationStates]);

    // Función para manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "institution") {
            const institucionError = !value ? INSTITUTION_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, institution: institucionError }));
        } else if (name === "title") {
            const titleError = !value ? TITLE_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, title: titleError }));
        }

        setFormData({ ...formData, [name]: value });
    };

    // Función para manejar el cambio en el campo de nivel de educación
    const handletEducationLevelChange = (option) => {
        setFormData({ ...formData, selectEducationLevel: option });
        setErrors((prevErrors) => ({
            ...prevErrors,
            level_id: option ? '' : LEVEL_REQUIRED
        }));
    };

    // Función para manejar el cambio en el campo de estado de educación
    const handleEducationStateChange = (option) => {
        setFormData({ ...formData, selectEducationState: option });
        setErrors((prevErrors) => ({
            ...prevErrors,
            state_id: option ? '' : STATE_REQUIRED
        }));
    };

    // Efecto para deshabilitar el botón de envío si hay errores en el formulario
    useEffect(() => {
        const hasErrors = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(hasErrors);
    }, [errors]);

    // Funcion para el manejar el envio del formulario 
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            level_id: !selectEducationLevel ? LEVEL_REQUIRED : "",
            institution: !institution ? INSTITUTION_REQUIRED : "",
            title: !title ? TITLE_REQUIRED : "",
            state_id: !selectEducationState ? STATE_REQUIRED : "",
        };

        setErrors(newErrors);

        // Verificar si hay errores
        const hasErrors = Object.values(newErrors).some((error) => error !== "");

        if (!hasErrors) {
            const levelId = selectEducationLevel ? selectEducationLevel.value.id : null;
            const stateId = selectEducationState ? selectEducationState.value.id : null;

            // Crear un objeto con los datos actualizados
            const updatedEducationData = {
                level_id: levelId,
                institution,
                title,
                state_id: stateId,
            };

            // Enviar los datos al componente padre
            onSubmit(updatedEducationData);
        }
    }

    return (
        <div className="max-w-1xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <CustomSelect
                        label="Nivel de educación"
                        options={educationLevels}
                        value={selectEducationLevel}
                        onChange={handletEducationLevelChange}
                        placeholder="Selecciona un nivel de educación"
                        error={errors.level_id}
                        isSearchable={true}
                        labelKey="name"
                    />
                    <Input
                        label="Institución"
                        name="institution"
                        placeholder={"Ej. Universidad de los Andes"}
                        value={institution}
                        icon={RiBuilding2Line}
                        onChange={handleChange}
                        error={errors.institution}
                    />
                    <Input
                        label="Titulo"
                        name="title"
                        placeholder={"Ej. Ingeniero de sistemas"}
                        value={title}
                        icon={MdOutlineSubtitles}
                        onChange={handleChange}
                        error={errors.title}
                    />
                    <CustomSelect
                        label="Estado de la educación"
                        options={educationStates}
                        value={selectEducationState}
                        onChange={handleEducationStateChange}
                        placeholder="Selecciona un estado de educación"
                        error={errors.state_id}
                        isSearchable={true}
                        labelKey="name"
                    />
                </div>
                <div className="flex items-center gap-x-2">
                    <button
                        type="submit"
                        className={`p-2 px-1 rounded-xl text-white w-full outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitDisabled
                            ? `${confirmButtonColor} opacity-70 cursor-not-allowed` 
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

export default EducationForm;
