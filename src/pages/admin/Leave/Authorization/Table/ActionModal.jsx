import React, { useState, useEffect, Fragment, useContext} from 'react';
import { FaTimes } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import Textarea from '../../../../../components/ui/Textarea';
import ConfirmationModal from './ConfirmationModal';
import { fetchRejectionReasons } from '../../../../../redux/Leave/rejectionReasonSlince';
import CustomSelect from '../../../../../components/ui/Select';
import { updateOneCommentAction } from '../../../../../redux/Leave/leaveCommentSlince';
import { useAuth } from '../../../../../hooks/useAuth';
import { AlertContext } from '../../../../../contexts/AlertContext';


const ActionModal = ({ action, data, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [comment, setComment] = useState('');
    const [showError, setShowError] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);
    const [showReasonError, setShowReasonError] = useState(false);


    const { showAlert } = useContext(AlertContext);

    const dispatch = useDispatch();
    const { rejectionReasons, hasFetchedOnce } = useSelector(state => state.rejectionReason);

    useEffect(() => {
        if (action === 'Rechazar' && !hasFetchedOnce) {
            dispatch(fetchRejectionReasons());
        }
    }, [dispatch, action, hasFetchedOnce]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !showConfirmation) {
                onClose();
            } else if (event.key === 'Escape' && showConfirmation) {
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, showConfirmation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (action === 'Corregir' && comment.trim() === '') {
            setShowError(true);
        } else if (action === 'Rechazar' && !selectedReason) {
            setShowReasonError(true);
        } else {
            setShowConfirmation(true);
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
        if (e.target.value.trim() !== '') {
            setShowError(false);
        }
    };

    const handleReasonChange = (selectedOption) => {
        setSelectedReason(selectedOption.value.id);
        setShowReasonError(false);
    };

    const handleConfirm = async () => {
        const actionMapping = {
            Aprobar: 'Aprobado',
            Rechazar: 'Rechazado',
            Corregir: 'Corregir'
        };

        const updatePayload = {
            action: actionMapping[action],
            comment: comment.trim() || null,
        };

        if (action === 'Rechazar') {
            updatePayload.rejection_reason_id = selectedReason ? selectedReason : null;
        }

   // Obtener el ID del comentario correcto basado en el rol del usuario
    const commentId = user.role === 'Administrador' && data.comentario_2 
        ? data.comentario_2.id 
        : data.comentario_1 
            ? data.comentario_1.id 
            : null;

        try {
            await dispatch(updateOneCommentAction({
                employeeId: user.employee_id,
                commentId,
                comment: updatePayload,
            })).unwrap();
        
            showAlert(`Permiso ${action.toLowerCase()} correctamente`, 'success');
            onSuccess(); // Llama a la función onSuccess después de una acción exitosa
            onClose();
        } catch (error) {
            const errorMessage = error.message ? JSON.parse(error.message).msg : 'Error al realizar la acción';
            showAlert(errorMessage, 'error', 3000);
            onClose();
        }
    };

    const getButtonColors = () => {
        switch(action) {
            case 'Aprobar': return { confirm: 'bg-green-500 hover:bg-green-600', cancel: 'border-green-500 text-green-500 hover:bg-green-50' };
            case 'Rechazar': return { confirm: 'bg-red-500 hover:bg-red-600', cancel: 'border-red-500 text-red-500 hover:bg-red-50' };
            case 'Corregir': return { confirm: 'bg-orange-500 hover:bg-orange-600', cancel: 'border-orange-500 text-amber-500 hover:bg-orange-50' };
            default: return { confirm: 'bg-blue-500 hover:bg-blue-600', cancel: 'border-blue-500 text-blue-500 hover:bg-blue-50' };
        }
    };

    const { confirm, cancel } = getButtonColors();

    return (
        <>
            <Transition appear show={true} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => {}}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                            <Dialog.Panel className="bg-white rounded-lg shadow-xl w-96 max-w-md transform transition-all">
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h2 className="text-2xl font-bold text-gray-800">{action}</h2>
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <FaTimes size={24} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600"><strong>Cédula:</strong> {data.employee.identification}</p>
                                        <p className="text-sm text-gray-600"><strong>Solicitante:</strong> {data.employee.full_name}</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        {action === 'Rechazar' && (
                                            <div className="mb-4">
                                                <CustomSelect
                                                    label="Motivo de Rechazo"
                                                    options={rejectionReasons}
                                                    value={selectedReason}
                                                    onChange={handleReasonChange}
                                                    placeholder="Selecciona un motivo de rechazo"
                                                    isSearchable={true}
                                                    labelKey="reason"
                                                    error={showReasonError ? 'El motivo de rechazo es obligatorio' : ''}
                                                />
                                            </div>
                                        )}
                                        <div className="mb-4">
                                            <Textarea
                                                label="Comentario"
                                                id="comment"
                                                placeholder="Ingrese un comentario..."
                                                value={comment}
                                                onChange={handleCommentChange}
                                                error={showError ? 'El comentario es obligatorio' : ''}
                                                rows={3}
                                            />
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                className={`flex-1 ${confirm} text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 ${showError && action === 'Corregir' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={showError && action === 'Corregir'}
                                            >
                                                {action}
                                            </button>
                                            <button
                                                type="button"
                                                className={`flex-1 bg-white ${cancel} border-dashed border font-semibold py-2 px-4 rounded-md transition-colors duration-200`}
                                                onClick={onClose}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {showConfirmation && (
                <ConfirmationModal 
                    action={action} 
                    onConfirm={handleConfirm} 
                    onCancel={() => setShowConfirmation(false)} 
                />
            )}
        </>
    );
};

export default ActionModal;