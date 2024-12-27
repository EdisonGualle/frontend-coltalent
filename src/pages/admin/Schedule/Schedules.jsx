import React, { useState } from "react";
import { CardHeader, Typography } from "@material-tailwind/react";
import { FaClock, FaUserClock, FaUser } from "react-icons/fa";
import ScheduleDefinition from "./Definition/ScheduleDefinition";
import ScheduleAssignment from "./Assignment/ScheduleAssignment";

const Schedules = () => {
    const [activeTab, setActiveTab] = useState(0);

    const allTabs = [
        {
            label: "Definición de Horarios",
            icon: <FaClock />,
            component: <ScheduleDefinition />,
        },
        {
            label: "Asignación de Horarios",
            icon: <FaUserClock />,
            component: <ScheduleAssignment />,
        },
        // {
        //     label: "Mi Horario",
        //     icon: <FaUser />,
        //     component: <EmployeeSchedule />,
        // },
    ];

    return (
        <div className="bg-gray-100">
            {/* Card Header */}
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
                <div className="mb-2">
                    <Typography variant="h5" color="blue-gray" className="font-semibold">
                        Gestión de Horarios
                    </Typography>
                    <Typography color="gray" className="mt-1">
                        Administra, consulta los horarios y asignaciones.
                    </Typography>
                </div>
            </CardHeader>

            {/* Tabs */}
            <div className="flex border-b">
                {allTabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex items-center py-3 px-5 text-sm font-medium rounded-t-md ${
                            activeTab === index
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
                {allTabs[activeTab]?.component}
            </div>
        </div>
    );
};

export default Schedules;
