import React, { useState } from "react";
import { CardHeader, Typography } from "@material-tailwind/react";
import { FaTasks, FaUserTie, FaHistory } from "react-icons/fa";
import AssignedDelegations from "./Assigned/AssignedDelegations";
import DelegatedDelegations from "./Delegated/DelegatedDelegations";
import AllDelegations from "./All/AllDelegations";
import { useAuth } from "../../../hooks/useAuth";
import MotionWrapper from "../../../components/ui/MotionWrapper";

const Delegations = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(0);

    const allTabs = [
        {
            label: "Asignadas",
            icon: <FaTasks />,
            component: <AssignedDelegations />,
        },
        {
            label: "Delegadas",
            icon: <FaUserTie />,
            component: <DelegatedDelegations />,
        },
        {
            label: "Todas",
            icon: <FaHistory />,
            component: <AllDelegations />,
        },
    ];

    // Filtrar pestañas basado en el rol del usuario
    let filteredTabs = [];
    if (user.role === "Empleado") {
        filteredTabs = allTabs.filter((tab) => tab.label === "Asignadas");
    } else if (user.role !== "Administrador" && user.role !== "Empleado") {
        filteredTabs = allTabs.filter((tab) => tab.label !== "Todas");
    } else {
        filteredTabs = allTabs; // Mostrar todas las pestañas para roles no restringidos
    }

    return (
        <div className="bg-gray-100">
            {/* Card Header */}
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
                <div className="mb-2">
                    <Typography variant="h5" color="blue-gray" className="font-semibold">
                        Lista de Subrogaciones
                    </Typography>
                    <Typography color="gray" className="mt-1">
                        Consulta la información sobre las subrogaciones disponibles.
                    </Typography>
                </div>
            </CardHeader>

            {/* Tabs */}
            <div className="flex border-gray-200">
                {filteredTabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex items-center py-3 px-5 text-sm transition-all duration-300 rounded-t-lg ${activeTab === index
                                ? "bg-blue-100 text-blue-700 border-t-2 border-x-2 border-blue-200 font-semibold"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <span className="mr-2 text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <MotionWrapper keyProp={activeTab}>
                {filteredTabs[activeTab]?.component}
            </MotionWrapper>

        </div>
    );
};

export default Delegations;
