import React from 'react';
import { RiCheckLine, RiCloseLine, RiTimeLine } from 'react-icons/ri';
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineCloseCircle } from "react-icons/ai";

const StatusIcon = ({ status }) => {
    switch (status.toLowerCase()) {
        case 'aprobado':
            return <FaRegCheckCircle className="text-green-600 text-xl" />;
        case 'rechazado':
            return <AiOutlineCloseCircle className="text-red-600 text-xl" />;
        default:
            return <RiTimeLine className="text-yellow-600 text-xl" />;
    }
};

const ApprovalTimeline = ({ steps }) => {
    return (
        <div className="space-y-6">
            {steps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                    {/* Timeline Line */}
                    {index !== steps.length - 1 && (
                        <div className="absolute left-6 top-10 bottom-0 w-0.5" />
                    )}

                    {/* Approver Avatar */}
                    <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden ${step.approver.photo ? 'border-2 border-blue-200' : ''}`}>
                            {step.approver.photo ? (
                                <img
                                    src={`${import.meta.env.VITE_STORAGE_URL}/${step.approver.photo}`}
                                    alt={`${step.approver.full_name || 'Aprobador'}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-600 text-xl font-bold">
                                    {step.approver.short_name ? step.approver.short_name.charAt(0) : '?'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Approval Details */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                    {step.approver.full_name || 'Aprobador desconocido'}
                                </h4>
                                <p className="text-sm text-gray-600">{step.approver.position || 'Sin posición'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusIcon status={step.decision.action} />
                                <span className="text-sm text-gray-500">
                                    {step.interaction_date ? step.interaction_date : 'Pendiente'}
                                </span>
                            </div>
                        </div>

                        {/* Rejection Reason Section */}
                        {step.decision.rejection_reason && (
                            <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-300 flex items-center space-x-2">
                               <span className="text-sm text-red-600 font-semibold">Motivo de Rechazo:</span>
                               <span className="text-sm text-red-600">{step.decision.rejection_reason}</span>
                            </div>
                        )}

                        {/* Comment Section */}
                        {step.decision.comment && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">{step.decision.comment}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ApprovalTimeline;
