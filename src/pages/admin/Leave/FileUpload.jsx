import React, { useRef } from "react";

const FileUpload = ({
    attachment,
    setAttachment,
    attachmentError,
    handleAttachmentChange,
    handleRemoveAttachment,
}) => {
    const fileInputRef = useRef(null); // Referencia para reiniciar el input de archivo

    const handleRemove = (e) => {
        e.preventDefault();
        setAttachment(null); // Limpia el archivo seleccionado
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Resetea el valor del input
        }
        handleRemoveAttachment(); // Llama a la función para manejar la lógica desde el componente principal
    };

    return (
        <div className="mb-3">
            <label className="block text-base font-semibold text-gray-700 mb-1">
                Adjuntar Documento
            </label>
            <div
                className={`flex justify-center items-center w-full h-16 px-2 transition bg-white border-2 ${attachmentError ? "border-red-500" : "border-gray-300"
                    } border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}
            >
                <input
                    type="file"
                    name="file_upload"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    id="attachment"
                    onChange={handleAttachmentChange}
                    ref={fileInputRef} // Referencia al input
                />
                <label
                    htmlFor="attachment"
                    className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                >
                    {!attachment ? (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <span className="font-medium text-gray-600">
                                Arrastra un documento para adjuntar, o{" "}
                                <span className="text-blue-600 underline">examinar</span>
                            </span>
                        </>
                    ) : (
                        <div className="flex items-center">
                            <span className="text-sm text-gray-700">{attachment.name}</span>
                            <button
                                type="button"
                                onClick={handleRemove} // Maneja la eliminación del archivo
                                className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </label>
            </div>
            {attachmentError && (
                <p className="mt-1 text-xs text-red-500">{attachmentError}</p>
            )}
        </div>
    );
};

export default FileUpload;
