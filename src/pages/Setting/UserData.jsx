import React, { useState, useEffect } from "react";
import { RiShieldCheckLine } from "react-icons/ri";
import { Typography, Card, Input } from "@material-tailwind/react";
import { useAuth } from "../../hooks/useAuth";
import { getUserConfiguration } from "../../services/User/UserService";
import { validatePassword } from "../../Utils/validations";

const UserData = () => {
    const { user } = useAuth();
    const [userConfiguration, setUserConfiguration] = useState(null);
    const [showErrors, setShowErrors] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(true);
    const [editModePassword, setEditModePassword] = useState(false);


    useEffect(() => {
        const fetchUserConfiguration = async () => {
            try {
                const configuration = await getUserConfiguration(user.id);
                setUserConfiguration(configuration);
            } catch (error) {
                console.error('Error al obtener la configuración de usuario:', error);
            }
        };
        fetchUserConfiguration();
    }, [user.id]);

    const handleEditPasswordClick = () => {
        setShowErrors(false);
        setCanceled(false);
        setEditModePassword(true);
    };

    const handleCancelPasswordClick = () => {
        setShowErrors(false);
        setCanceled(true);
        setPassword("*******");
        setEditModePassword(false);
    };

    const handleSavePasswordClick = () => {
        setShowErrors(true);
        if (password.trim() !== "" && passwordValid) {
            setEditModePassword(false);
        }
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
        setPasswordValid(validatePassword(password));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    if (!userConfiguration) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            {/* User - Correo */}
            <div>
                <Card color="transparent" shadow={false} className="">
                    <form className="mt-2 mb-2 pb-2 shadow-xl" onSubmit={handleSubmit}>
                        <div className="mb-1 flex flex-col">
                            <Typography variant="h5" color="blue-gray">
                                Datos de usuario
                            </Typography>
                            <hr className="border-gray-500/30" />
                            <Typography variant="h6" color="blue-gray" className="mt-3">
                                Nombre de usuario
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="Edison Gualle"
                                className="w-full py-2 px-4 outline-none rounded-lg bg-gray-200 border border-gray-300 tex-black"
                                value={userConfiguration.name}
                                disabled
                            />
                            {/* Correo personal */}
                            <Typography variant="h6" color="blue-gray" className="mt-1">
                                Correo institucional
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="name@mail.com"
                                className="w-full py-2 px-4 outline-none rounded-lg bg-gray-200 border border-gray-300 tex-black"
                                value={userConfiguration.email}
                                disabled
                            />
                            {/* contrasena */}
                            <Typography variant="h6" color="blue-gray" className="mt-1">
                                Contraseña
                            </Typography>
                            <Input
                                type="password"
                                size="lg"
                                placeholder="********"
                                className={`w-full py-2 px-4 outline-none rounded-lg border ${editModePassword && showErrors && !passwordValid
                                        ? "border-red-500"
                                        : "border-gray-400"
                                    } ${editModePassword ? "bg-white" : "bg-gray-200 border-gray-300"}`}
                                onChange={handlePasswordChange}
                                disabled={!editModePassword}
                            />
                        </div>
                        {editModePassword &&
                            showErrors &&
                            (password.trim() === "" || !passwordValid) && (
                                <p className="text-red-500 text-sm">
                                    {password.trim() === ""
                                        ? "Por favor, ingresa una contraseña."
                                        : "La contraseña debe tener minimo 8 caracteres."}
                                </p>
                            )}
                        {/* Botón */}
                        <div className="flex justify-end">
                            {editModePassword ? (
                                <>
                                    <button
                                        className="bg-primary/50 py-2 px-4 rounded-lg hover:bg-primary transition-colors"
                                        onClick={handleSavePasswordClick}
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        className="bg-red-300 py-2 px-4 rounded-lg ml-4 hover:bg-red-400 transition-colors"
                                        onClick={handleCancelPasswordClick}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="bg-primary/50 py-2 px-4 rounded-lg hover:bg-primary transition-colors"
                                    onClick={handleEditPasswordClick}
                                >
                                    Cambiar contraseña
                                </button>
                            )}
                        </div>
                        <div className="my-6 grid grid-cols-1 md:grid-cols-8 items-center gap-y-4 bg-primary/10 p-4 rounded-lg border border-dashed border-primary">
                            <div className="flex justify-center">
                                <RiShieldCheckLine className="text-5xl text-green-600" />
                            </div>
                            <div className="md:col-span-7">
                                <Typography variant="h6" color="blue-gray" className="mt-1">
                                    Contraseña segura
                                </Typography>
                                <p className="text-gray-500 text-sm">
                                    La contraseña debe tener al menos 8 caracteres y se recomienda
                                    incluir una combinación de letras mayúsculas, minúsculas, números
                                    y caracteres especiales para mejorar la seguridad.
                                </p>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
};

export default UserData;