import React, { useState, useEffect } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { CardHeader, Typography, Card, Input } from "@material-tailwind/react";
import { useAuth } from "../../hooks/useAuth";

import { getUserConfiguration, uploadUserPhoto } from "../../services/User/UserService";

import { validateEmail, validatePhone } from "../../Utils/validations";



const PersonalData = () => {

    const { user } = useAuth();
    const [userConfiguration, setUserConfiguration] = useState(null);
    const [file, setFile] = useState(null);
    const [personalEmail, setPersonalEmail] = useState("");
    const [personalPhone, setPersonalPhone] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);
    const [showErrors, setShowErrors] = useState(false);
    const [canceled, setCanceled] = useState(false);


    useEffect(() => {
        const fetchUserConfiguration = async () => {
            try {
                const configuration = await getUserConfiguration(user.id);
                setUserConfiguration(configuration);
                setPersonalEmail(configuration.personal_email);
                setPersonalPhone(configuration.personal_phone);
            } catch (error) {
                console.error('Error al obtener la configuración de usuario:', error);
            }
        };
        fetchUserConfiguration();
    }, [user.id]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const uploadImage = async () => {
        try {
            const response = await uploadUserPhoto(user.id, file);
            console.log(response);
        } catch (error) {
            console.error('Error al subir la imagen:', error);
        }
    };

    const handleEditClick = () => {
        setShowErrors(false);
        setCanceled(false);
        setEditMode(true);
    };

    const handleCancelClick = () => {
        setShowErrors(false);
        setCanceled(true);
        setPersonalEmail(userConfiguration.personal_email);
        setPersonalPhone(userConfiguration.personal_phone);
        setEditMode(false);
    };

    const handleSaveClick = () => {
        setShowErrors(true);
        if (personalEmail.trim() !== "" && personalPhone.trim() !== "" && emailValid && phoneValid) {
            setEditMode(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handlePhoneChange = (e) => {
        const phone = e.target.value;
        setPersonalPhone(phone);
        setPhoneValid(validatePhone(phone));
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setPersonalEmail(email);
        setEmailValid(validateEmail(email));
    };

    if (!userConfiguration) {
        return <div>Cargando...</div>;
    }

    return (
        <>

            <div>
                <Card color="transparent" shadow={false} className="">
                    <form className="mt-2 mb-2 pb-2 shadow-xl" onSubmit={handleSubmit}>
                        <div className="mb-1 flex flex-col">
                            <Typography variant="h5" color="blue-gray">
                                Datos personales
                            </Typography>
                            <hr className="border-gray-500/30" />
                            {/* Imagen */}
                            <Typography variant="h6" color="blue-gray" className="mt-3">
                                Avatar
                            </Typography>
                            <div className="flex-1">
                                <div className="relative mb-2">
                                    <img
                                        src={`${import.meta.env.VITE_STORAGE_URL}/${userConfiguration.photo}`}
                                        className="w-28 h-28 object-cover rounded-lg"
                                        alt="Avatar"
                                    />
                                    <label
                                        htmlFor="avatar"
                                        className="absolute bg-secondary-100 p-2 rounded-full hover:cursor-pointer -top-2 left-24"
                                    >
                                        <RiEdit2Line />
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Tipos de archivos permitidos: png, jpg, jpeg.
                                </p>
                                <button onClick={uploadImage}>Subir imagen</button>
                            </div>
                            <Typography variant="h6" color="blue-gray" className="mt-3">
                                Nombre completo
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="Edison Gualle"
                                className="w-full py-2 px-4 outline-none rounded-lg bg-gray-200 border border-gray-300 tex-black"
                                value={userConfiguration.full_name}
                                disabled
                            />

                            {/* Correo personal */}
                            <Typography variant="h6" color="blue-gray" className="mt-1">
                                Correo personal
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="name@mail.com"
                                className={`w-full py-2 px-4 outline-none rounded-lg border ${editMode && showErrors && !emailValid
                                        ? "border-red-500"
                                        : "border-gray-400"
                                    } ${editMode ? "bg-white" : "bg-gray-200 border-gray-300"}`}
                                onChange={handleEmailChange}
                                value={personalEmail}
                                disabled={!editMode}
                            />
                            {editMode &&
                                showErrors &&
                                (personalEmail.trim() === "" || !emailValid) && (
                                    <p className="text-red-500 text-sm">
                                        {personalEmail.trim() === ""
                                            ? "Por favor, ingresa un correo electrónico."
                                            : "Por favor, ingresa un correo válido."}
                                    </p>
                                )}

                            {/* Contacto */}
                            <Typography variant="h6" color="blue-gray" className="mt-1">
                                Número de contacto
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="099948836"
                                className={`w-full py-2 px-4 outline-none rounded-lg border ${editMode && showErrors && !phoneValid
                                        ? "border-red-500"
                                        : "border-gray-400"
                                    } ${editMode ? "bg-white" : "bg-gray-200 border-gray-300"}`}
                                onChange={handlePhoneChange}
                                value={personalPhone}
                                disabled={!editMode}
                            />
                            {editMode &&
                                showErrors &&
                                (personalPhone.trim() === "" || !phoneValid) && (
                                    <p className="text-red-500 text-sm">
                                        {personalPhone.trim() === ""
                                            ? "Por favor, ingresa un telefono."
                                            : "Por favor, ingresa un telefono válido."}
                                    </p>
                                )}
                        </div>

                        {/* Botón */}
                        <div className="flex justify-end">
                            {editMode ? (
                                <>
                                    <button
                                        className="bg-primary/50 py-2 px-4 rounded-lg hover:bg-primary transition-colors"
                                        onClick={handleSaveClick}
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        className="bg-red-300 py-2 px-4 rounded-lg ml-4 hover:bg-red-400 transition-colors"
                                        onClick={handleCancelClick}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="bg-primary/50 py-2 px-4 rounded-lg hover:bg-primary transition-colors"
                                    onClick={handleEditClick}
                                >
                                    Editar
                                </button>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
};

export default PersonalData;