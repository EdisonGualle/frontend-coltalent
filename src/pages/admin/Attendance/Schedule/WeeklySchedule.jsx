import React from 'react';
import DayCard from './DayCard';
import { RiEditLine } from 'react-icons/ri';
import { Button } from "@material-tailwind/react";
import { CardHeader, Typography } from "@material-tailwind/react";

const WeeklySchedule = ({ schedule, onEdit }) => {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    return (
        <div className="container mx-auto p-4">
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
                <div className="mb-2 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray" className="font-semibold">
                            Horario Semanal
                        </Typography>
                    </div>
                </div>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {daysOfWeek.map(day => (
                    <DayCard key={day} day={day} schedule={schedule[day]} />
                ))}
            </div>
        </div>
    );
};

export default WeeklySchedule;
