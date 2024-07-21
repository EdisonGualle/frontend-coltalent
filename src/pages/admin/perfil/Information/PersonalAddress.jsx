import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SimpleInput from "../../../../components/ui/SimpleInput";
import { RiEditLine } from 'react-icons/ri';
import { getEmployee } from "../../../../services/Employee/EmployeService1";
import { AlertContext } from "../../../../contexts/AlertContext";

import { useAuth } from "../../../../hooks/useAuth";

const PersonalAddress = () => {
    const { id } = useParams(); // Obtener el id de la URL
    const { showAlert } = useContext(AlertContext);
    const [addressData, setAddressData] = useState({
        sector: "",
        main_street: "",
        secondary_street: "",
        number: "",
        reference: "",
        parish: "",
        canton: "",
        province: ""
    });

    const { user } = useAuth();


    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await getEmployee(id);
                const data = response.data || {};
                setAddressData({
                    sector: data.address?.sector || "",
                    main_street: data.address?.main_street || "",
                    secondary_street: data.address?.secondary_street || "",
                    number: data.address?.number || "",
                    reference: data.address?.reference || "",
                    parish: data.address?.parish?.nombre || "",
                    canton: data.address?.parish?.canton?.name || "",
                    province: data.address?.parish?.canton?.province?.name || "",
                });
            } catch (error) {
                showAlert('Hubo un problema al cargar los datos de residencia del empleado. Por favor, intenta nuevamente.', 'error');
            }
        };

        fetchEmployeeData();
    }, [id]);

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SimpleInput
                    label="Provincia"
                    id="province"
                    value={addressData.province}
                    onChange={(e) => setAddressData({ ...addressData, province: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Cantón"
                    id="canton"
                    value={addressData.canton}
                    onChange={(e) => setAddressData({ ...addressData, canton: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Parroquia"
                    id="parish"
                    value={addressData.parish}
                    onChange={(e) => setAddressData({ ...addressData, parish: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Sector"
                    id="sector"
                    value={addressData.sector}
                    onChange={(e) => setAddressData({ ...addressData, sector: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Calle Principal"
                    id="main_street"
                    value={addressData.main_street}
                    onChange={(e) => setAddressData({ ...addressData, main_street: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Calle Secundaria"
                    id="secondary_street"
                    value={addressData.secondary_street}
                    onChange={(e) => setAddressData({ ...addressData, secondary_street: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Número"
                    id="number"
                    value={addressData.number}
                    onChange={(e) => setAddressData({ ...addressData, number: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Referencia"
                    id="reference"
                    value={addressData.reference}
                    onChange={(e) => setAddressData({ ...addressData, reference: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                {user.role === 'Administrador' && (
                    <div className="sm:col-span-2 flex justify-end mb-2">
                        <button
                            className="flex items-center gap-3 bg-gray-200 text-white hover:bg-gray-300 transition-colors rounded-xl py-2 px-5"
                            size="sm"
                        >
                            <RiEditLine className="h-5 w-5 text-gray-600" />
                            <span className="font-semibold text-gray-600">Editar Información</span>
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PersonalAddress;