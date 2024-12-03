import React from 'react';
import { RiCalendarLine, RiTimeLine } from 'react-icons/ri';

export const formatRequestedPeriod = (requested_period, duration, permissionTypeColor) => {
    if (requested_period.date && requested_period.start_time && requested_period.end_time) {
        // Caso 3: Fecha y rango horario
        return (
            <div className={`flex flex-col ps-3 space-y-1 mt-1`}>
                <div className="flex items-center space-x-2">
                    <RiCalendarLine className='text-gray-700' />
                    <span className="text-sm text-gray-600">Fecha:</span>
                    <span className="text-sm font-semibold">{requested_period.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <RiTimeLine className='text-gray-700' />
                    <span className="text-sm text-gray-600">Lapso:</span>
                    <span className="text-sm font-semibold">{requested_period.start_time} - {requested_period.end_time}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Duración:</span>
                    <span className="text-sm text-gray-600 ps-1">{duration}</span>
                </div>
            </div>
        );
    }

    if (requested_period.start && requested_period.end && requested_period.start !== requested_period.end) {
        // Caso 2: Multi-día
        return (
            <div className={`flex flex-col ps-3 space-y-1 mt-1`}>
                <div className="flex items-center space-x-2">
                    <RiCalendarLine className='text-gray-700' />
                    <span className="text-sm text-gray-600">Desde:</span>
                    <span className="text-sm font-semibold">{requested_period.start}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <RiCalendarLine className='text-gray-700' />
                    <span className="text-sm text-gray-600">Hasta:</span>
                    <span className="text-sm font-semibold">{requested_period.end}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Duración:</span>
                    <span className="text-sm text-gray-600 ps-1">{duration}</span>
                </div>
            </div>
        );
    }

    if (requested_period.start === requested_period.end) {
        // Caso 1: Fecha única
        return (
            <div className={`flex flex-col ps-3 space-y-1 mt-1`}>
                <div className="flex items-center space-x-2">
                    <RiCalendarLine className='text-gray-700' />
                    <span className="text-sm text-gray-600">Fecha:</span>
                    <span className="text-sm font-semibold">{requested_period.start}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className=" text-sm text-gray-600">Duración:</span>
                    <span className="text-sm text-gray-600 ps-1">{duration}</span>
                </div>
            </div>
        );
    }

    return <p className="text-gray-400 italic">No definido</p>;
};