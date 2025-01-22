import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../../../components/ui/Input";
import CustomSelect from "../../../../../components/ui/Select";
import { fetchPublicationTypes } from "../../../../../redux/Employee/Backgrounds/publicationTypeSlince";
import { BsJournalText } from "react-icons/bs";
import { MdOutlineArticle } from "react-icons/md";
import { FaBarcode } from "react-icons/fa";
import { LiaPenNibSolid } from "react-icons/lia";

const PUBLICATION_TYPE_REQUIRED = "Se requiere el tipo de publicación.";
const TITLE_REQUIRED = "Se requiere un título.";
const PUBLISHER_REQUIRED = "Se requiere una editorial.";
const AUTHORSHIP_REQUIRED = "Se requiere la autoría.";
const ISBN_ISSN_REQUIRED = "Se requiere el ISBN/ISSN.";

const PublicationForm = ({
    publication,
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
    const publicationTypesState = useSelector((state) => state.publicationType);

    const publicationTypes = publicationTypesState?.publicationTypes || [];

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    // Estados locales para manejar los errores y los datos del formulario
    const [formData, setFormData] = useState({
        selectPublicationType: null,
        title: "",
        publisher: "",
        authorship: "",
        isbn_issn: "",
    });
    const [errors, setErrors] = useState({
        publication_type_id: "",
        title: "",
        publisher: "",
        authorship: "",
        isbn_issn: "",
    });

    // Desestructurar los datos del formulario
    const { selectPublicationType, title, publisher, authorship, isbn_issn } = formData;

    // Efecto para actualizar los errores del formulario
    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    // Efecto para cargar los tipos de publicación
    useEffect(() => {
        dispatch(fetchPublicationTypes());
    }, []);

    // Efecto para actualizar el estado de deshabilitación del botón cuando los errores cambian
    useEffect(() => {
        const isDisabled = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(isDisabled);
    }, [errors]);


    // Efecto para cargar los datos del formulario si se está editando
    useEffect(() => {
        if (isEditing && publication && publicationTypes.length > 0) {
            const publicationType = publicationTypes.find((publication_type) => publication_type.id === publication?.publication_type?.id);

            setFormData({
                selectPublicationType: publicationType ? { value: publicationType.id, label: publicationType.name } : null,
                title: publication.title,
                publisher: publication.publisher,
                authorship: publication.authorship,
                isbn_issn: publication.isbn_issn,
            });

            setErrors({
                publication_type_id: "",
                title: "",
                publisher: "",
                authorship: "",
                isbn_issn: "",
            });
        }
    }, [isEditing, publication, publicationTypes]);

    // Función para manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "title") {
            const titleError = !value ? TITLE_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, title: titleError }));
        } else if (name === "publisher") {
            const publisherError = !value ? PUBLISHER_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, publisher: publisherError }));
        } else if (name === "authorship") {
            const authorshipError = !value ? AUTHORSHIP_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, authorship: authorshipError }));
        } else if (name === "isbn_issn") {
            const isbnIssnError = !value ? ISBN_ISSN_REQUIRED : "";
            setErrors((prevErrors) => ({ ...prevErrors, isbn_issn: isbnIssnError }));
        }

        setFormData({ ...formData, [name]: value });

    };

    // Función para manejar el cambio en el campo de tipo de publicación
    const handlePublicationTypeChange = (option) => {
        setFormData({ ...formData, selectPublicationType: option });
        setErrors((prevErrors) => ({
            ...prevErrors,
            publication_type_id: option ? '' : PUBLICATION_TYPE_REQUIRED
        }));
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            publication_type_id: selectPublicationType ? "" : PUBLICATION_TYPE_REQUIRED,
            title: title ? "" : TITLE_REQUIRED,
            publisher: publisher ? "" : PUBLISHER_REQUIRED,
            authorship: authorship ? "" : AUTHORSHIP_REQUIRED,
            isbn_issn: isbn_issn ? "" : ISBN_ISSN_REQUIRED,
        };

        setErrors(newErrors);

        // Verificar si no hay errores
        const hasErrors = Object.values(newErrors).some((error) => error !== "");

        if (!hasErrors) {

            const publicationTypeId = selectPublicationType ? selectPublicationType.value.id : null;
            
            // Crear un objeto con los datos del formulario
            const updatePublicationData = {
                publication_type_id: publicationTypeId,
                title,
                publisher,
                authorship,
                isbn_issn,
            };
            // Enviar los datos al componente padre
            onSubmit(updatePublicationData);
        }

    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect
                        label="Tipo de publicación"
                        options={publicationTypes}
                        value={selectPublicationType}
                        onChange={handlePublicationTypeChange}
                        placeholder="Seleccionar"
                        error={errors.publication_type_id}
                        isSearchable={true}
                        labelKey="name"
                    />
                    <Input
                        label="Título de la publicación"
                        name="title"
                        placeholder={"Ej. 'La importancia de la educación en la sociedad'"}
                        value={title}
                        icon={BsJournalText}
                        onChange={handleChange}
                        error={errors.title}
                    />
                    <Input
                        label="Editorial"
                        name="publisher"
                        placeholder={"Ej. 'Editorial Santillana'"}
                        value={publisher}
                        icon={MdOutlineArticle}
                        onChange={handleChange}
                        error={errors.publisher}
                    />
                    <Input
                        label="ISBN/ISSN"
                        name="isbn_issn"
                        placeholder={"Ej. '978-3-16-148410-0'"}
                        value={isbn_issn}
                        icon={FaBarcode}
                        onChange={handleChange}
                        error={errors.isbn_issn}
                    />
                    <Input
                        label="Autoría"
                        name="authorship"
                        placeholder={"Ej. 'Si o No'"}
                        value={authorship}
                        icon={LiaPenNibSolid}
                        onChange={handleChange}
                        error={errors.authorship}
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

export default PublicationForm;
