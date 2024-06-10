import React from 'react';
import DayCard from './DayCard';
import { RiEditLine } from 'react-icons/ri';
import { Button } from "@material-tailwind/react";

const WeeklySchedule = ({ schedule, onEdit }) => {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Horario Semanal</h1>
                <Button
                    onClick={onEdit}
                    className="flex items-center gap-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-xl py-2 px-5"
                >
                    <RiEditLine className="h-5 w-5" />
                    <span className="font-semibold">Editar Horario</span>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {daysOfWeek.map(day => (
                    <DayCard key={day} day={day} schedule={schedule[day]} />
                ))}
            </div>
        </div>
    );
};

export default WeeklySchedule;
