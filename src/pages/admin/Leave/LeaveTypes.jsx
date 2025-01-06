import React from "react";
import {
    FaHouseDamage, FaUmbrellaBeach,
    FaBriefcaseMedical, FaHome, FaUserMd,
    FaUniversity, FaPlus, FaPlane, FaHospital,
    FaChild, FaGraduationCap, FaSuitcase,
    FaRegClock, FaInfoCircle
} from 'react-icons/fa';

import { FaHandshakeAngle } from "react-icons/fa6";


// Iconos disponibles
const iconMap = {
    FaHouseDamage: FaHouseDamage,
    FaUmbrellaBeach: FaUmbrellaBeach,
    FaBriefcaseMedical: FaBriefcaseMedical,
    FaHome: FaHome,
    FaUserMd: FaUserMd,
    FaUniversity: FaUniversity,
    FaPlus: FaPlus,
    FaPlane: FaPlane,
    FaHospital: FaHospital,
    FaChild: FaChild,
    FaGraduationCap: FaGraduationCap,
    FaSuitcase: FaSuitcase,
    FaRegClock: FaRegClock,
    FaHandshakeAngle: FaHandshakeAngle,
};

const LeaveTypes = ({ leaveTypes, selectedLeave, handleLeaveTypeChange, togglePanel }) => {
    return (
        <div className="flex justify-center items-center flex-wrap mb-4">
            {leaveTypes.map((leave, idx) => (
                <div
                    key={idx}
                    className={`relative bg-white  p-4 rounded-lg shadow-lg m-2 flex flex-col items-center w-40 cursor-pointer transition-all transform hover:scale-105 ${
                        selectedLeave === leave
                            ? "border-2 border-blue-400 text-blue-700 shadow-md"
                            : "border border-gray-300 text-gray-800 hover:shadow-md"
                    }`}
                    
                    
                    onClick={() => handleLeaveTypeChange(leave)} // Llama a la función correctamente
                >
                    <FaInfoCircle
                        className="absolute top-0 right-0 m-2 cursor-pointer text-gray-500 hover:text-blue-500"
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePanel(leave);
                        }}
                    />
                    {React.createElement(iconMap[leave.icon] || FaRegClock, { className: "text-3xl mb-2" })}
                    <span className="text-center text-sm font-semibold">{leave.name.toUpperCase()}</span>
                </div>
            ))}
        </div>
    );
};


export default LeaveTypes;
