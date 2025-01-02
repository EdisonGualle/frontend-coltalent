import React, {useState} from "react";
import {CardHeader, Typography, Button} from "@material-tailwind/react";
import { FaUserTag, FaCalendarAlt } from "react-icons/fa";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import DaysManagement from "./Days/DaysManagement";
import AssignmentsManagement from "./Assignments/AssignmentsManagement";

const Holidays = () => {
    const [activeTab, setActiveTab] = useState(0);
    const allTabs = [
        {
            label: "Días Festivos",
            icon: <FaCalendarAlt />, // Ícono de calendario para Days
            component: (
                <DaysManagement /> // Componente para Días Festivos
            ),
        },
        {
            label: "Asignaciones",
            icon: <FaUserTag />, // Ícono para asignaciones
            component: (
                <AssignmentsManagement /> // Componente para Asignaciones
            ),
        },
    ];
  return (
    <div>
    {/* Card Header */}
    <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
        <div className="mb-2 flex items-center justify-between gap-8">
            <div>
                <Typography variant="h5" color="blue-gray" className="font-semibold">
                Gestión de Días Festivos
                </Typography>
                <Typography color="gray" className="mt-1">
                    Gestiona los días festivos y asignaciones.
                </Typography>
            </div>
        </div>
    </CardHeader>

    {/* Tabs */}
    <div className="flex border-gray-200">
        {allTabs.map((tab, index) => (
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
        {allTabs[activeTab]?.component}
    </MotionWrapper>
</div>
  )
}

export default Holidays