import React from 'react';
import Textarea from '../../../../components/ui/Textarea';
const CreateDepartmentForm = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Nuevo Departamento</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                            Nombre del Departamento
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Ej. Ventas"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="function" className="block text-gray-700 font-bold mb-2">
                            Función
                        </label>
                        <textarea
                            id="function"
                            rows="3"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Describe la función del departamento"
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="manager" className="block text-gray-700 font-bold mb-2">
                            Jefe de Departamento
                        </label>
                        <input
                            type="text"
                            id="manager"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                        >
                            Crear Departamento
                        </button>
                    </div>
                    <Textarea
                        label="Descripción"
                        id="description"
                        placeholder="Ingresa una descripción"
                        rows={2}
                    />
                </form>
            </div>
        </div>
    );
};

export default CreateDepartmentForm;