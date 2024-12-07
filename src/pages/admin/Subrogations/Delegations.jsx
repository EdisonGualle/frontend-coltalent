import React, { useState } from "react";
import { CardHeader, Typography } from "@material-tailwind/react";
import { FaTasks, FaUserTie, FaHistory } from "react-icons/fa";
import AssignedDelegations from "./Assigned/AssignedDelegations";
import DelegatedDelegations from "./Delegated/DelegatedDelegations";
import AllDelegations from "./All/AllDelegations"
const Delegations = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
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

    return (
        <div className="bg-gray-100">
            {/* Card Header */}
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
                <div className="mb-2">
                    <Typography variant="h5" color="blue-gray" className="font-semibold">
                        Lista de Delegaciones
                    </Typography>
                    <Typography color="gray" className="mt-1">
                        Consulta la información sobre las delegaciones disponibles.
                    </Typography>
                </div>
            </CardHeader>

            {/* Tabs */}
            <div className="flex border-b mt-4">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex items-center py-3 px-5 text-sm font-medium rounded-t-md ${activeTab === index
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                            }`}
                    >
                        <span className="mr-2 text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="">
                    {tabs[activeTab].component}
            </div>
        </div>
    );
};

export default Delegations;
