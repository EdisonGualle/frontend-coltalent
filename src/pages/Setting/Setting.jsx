import React, { useState, useEffect, useCallback, useContext } from "react";
import { RiEdit2Line, RiLockLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import { CardHeader, Typography, Card, Input, Button } from "@material-tailwind/react";
import { useAuth } from "../../hooks/useAuth";
import { getUserConfiguration, uploadUserPhoto, changePassword } from "../../services/User/UserService";
import AxiosInstance from "../../services/axiosInstance";
import { AlertContext } from "../../contexts/AlertContext";

const Settings = () => {
    const { user, setUser } = useAuth();
    const { showAlert } = useContext(AlertContext); // Obtener el contexto de alerta
    const [userConfiguration, setUserConfiguration] = useState({});
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [editModePassword, setEditModePassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const storageUrl = import.meta.env.VITE_STORAGE_URL || '';

    const fetchUserConfiguration = useCallback(async () => {
        if (user && user.id) {
            try {
                setIsLoading(true);
                const configuration = await getUserConfiguration(user.id);
                setUserConfiguration(configuration || {});
            } catch (error) {
                console.error('Error al obtener la configuración de usuario:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchUserConfiguration();
    }, [fetchUserConfiguration]);

    useEffect(() => {
        if (newPassword || confirmPassword) {
            validatePasswordMatch();
        }
    }, [newPassword, confirmPassword]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
        } else {
            setFile(null);
            setPreview(null);
            alert('Formato de archivo no permitido. Solo se permiten archivos PNG, JPG y JPEG.');
        }
    };

    const uploadImage = async () => {
        if (!file || !user || !user.id) return;
        setIsUploading(true);
        try {
            await uploadUserPhoto(user.id, file);
            const response = await AxiosInstance.get('user-auth');
            setUser(response.data.data);
            setFile(null);
            setPreview(`${storageUrl}/${response.data.data.photo}?${new Date().getTime()}`);
            setUserConfiguration(prev => ({ ...prev, photo: response.data.data.photo }));
        } catch (error) {
            console.error('Error al subir la imagen:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const validatePasswordMatch = () => {
        if (newPassword !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
        } else {
            setErrors(prev => ({ ...prev, confirmPassword: null }));
        }
    };

    const validatePassword = () => {
        let newErrors = {};
        if (currentPassword.trim() === "") {
            newErrors.currentPassword = "La contraseña actual es requerida";
        }
        if (newPassword.length < 8) {
            newErrors.newPassword = "La nueva contraseña debe tener al menos 8 caracteres";
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSavePassword = async () => {
        if (validatePassword()) {
            try {
                await changePassword(currentPassword, newPassword, confirmPassword);
                showAlert("Contraseña actualizada correctamente.", "success"); // Usar alerta de éxito
                setEditModePassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setErrors({});
            } catch (error) {
                console.error('Error al cambiar la contraseña:', error);
                showAlert("Error al cambiar la contraseña. Intente nuevamente.", "error"); // Usar alerta de error
            }
        }
    };

    const handleCancelPassword = () => {
        setEditModePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="">
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0">
                <div className="mb-2 flex items-center justify-between gap-8">
                    <Typography variant="h5" color="blue-gray" className="font-semibold">
                        Configuración
                    </Typography>
                </div>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Typography variant="h6" color="blue-gray" className="text-center mb-4 font-semibold">
                        Avatar
                    </Typography>
                    <div className="flex flex-col items-center">
                        <div className="relative mb-8 group">
                            <img
                                src={preview || (userConfiguration.photo ? `${storageUrl}/${userConfiguration.photo}` : '/path/to/default/image.jpg')}
                                className="w-40 h-40 object-cover rounded-full border-4 border-yellow-500 shadow-lg group-hover:shadow-xl transition-all duration-300"
                                alt="Avatar"
                            />
                            <label
                                htmlFor="avatar"
                                className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer shadow-md group-hover:shadow-lg"
                            >
                                <RiEdit2Line className="text-white text-xl" />
                            </label>
                            <input
                                type="file"
                                id="avatar"
                                accept="image/png, image/jpg, image/jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <Typography color="gray" className="text-sm mb-4">
                            Tipos de archivos permitidos: png, jpg, jpeg.
                        </Typography>
                        <Button
                            onClick={uploadImage}
                            className={`mt-2 px-8 py-3 rounded-full shadow-md transition-all duration-300 text-white font-semibold ${
                                !file || isUploading 
                                ? 'bg-yellow-300 cursor-not-allowed opacity-80' 
                                : 'bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg'
                            }`}
                            disabled={!file || isUploading}
                        >
                            {isUploading ? 'Subiendo...' : 'Subir imagen'}
                        </Button>
                    </div>
                </Card>

                <Card className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Typography variant="h6" color="blue-gray" className="text-center mb-4 font-semibold">
                        Contraseña
                    </Typography>
                    <div className="space-y-4">
                        <div>
                            <Typography variant="paragraph" color="blue-gray" className="mb-2 font-medium">
                                Contraseña actual
                            </Typography>
                            <div className="relative">
                                <RiLockLine className="absolute top-3 left-3 text-gray-400" />
                                <Input
                                    type="password"
                                    size="lg"
                                    placeholder="********"
                                    className="pl-10 !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                                    labelProps={{
                                        className: "hidden",
                                    }}
                                    containerProps={{ className: "min-w-[100px]" }}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    error={errors.currentPassword}
                                    disabled={!editModePassword}
                                />
                            </div>
                            {errors.currentPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                            )}
                        </div>
                        <div>
                            <Typography variant="paragraph" color="blue-gray" className="mb-2 font-medium">
                                Nueva contraseña
                            </Typography>
                            <div className="relative">
                                <RiLockLine className="absolute top-3 left-3 text-gray-400" />
                                <Input
                                    type="password"
                                    size="lg"
                                    placeholder="********"
                                    className="pl-10 !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                                    labelProps={{
                                        className: "hidden",
                                    }}
                                    containerProps={{ className: "min-w-[100px]" }}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    error={errors.newPassword}
                                    disabled={!editModePassword}
                                />
                            </div>
                            {errors.newPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                            )}
                        </div>
                        <div>
                            <Typography variant="paragraph" color="blue-gray" className="mb-2 font-medium">
                                Confirmar nueva contraseña
                            </Typography>
                            <div className="relative">
                                <RiLockLine className="absolute top-3 left-3 text-gray-400" />
                                <Input
                                    type="password"
                                    size="lg"
                                    placeholder="********"
                                    className="pl-10 !border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                                    labelProps={{
                                        className: "hidden",
                                    }}
                                    containerProps={{ className: "min-w-[100px]" }}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    error={errors.confirmPassword}
                                    disabled={!editModePassword}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                        <div className="flex justify-center mt-8">
                            {!editModePassword ? (
                                <Button
                                    onClick={() => setEditModePassword(true)}
                                    className="px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white font-semibold bg-blue-500 hover:bg-blue-600"
                                >
                                    Cambiar contraseña
                                </Button>
                            ) : (
                                <div className="flex space-x-4">
                                    <Button
                                        onClick={handleSavePassword}
                                        className="px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white font-semibold flex items-center bg-yellow-500 hover:bg-yellow-600"
                                    >
                                        <RiCheckLine className="mr-2" /> Guardar
                                    </Button>
                                    <Button
                                        onClick={handleCancelPassword}
                                        className="px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white font-semibold flex items-center bg-blue-500 hover:bg-blue-600"
                                    >
                                        <RiCloseLine className="mr-2" /> Cancelar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
