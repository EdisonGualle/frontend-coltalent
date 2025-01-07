import React, { useState, useEffect, Fragment, useContext } from 'react';
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
import DelegationForm from './DelegationForm';
import { getSubrogationCandidates } from '../../../../../services/Leave/subrogationService';


const ActionModal = ({ action, data, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [comment, setComment] = useState('');
    const [showError, setShowError] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);
    const [showReasonError, setShowReasonError] = useState(false);
    // Nuevos estados para la delegación
    const [enableDelegation, setEnableDelegation] = useState(false);
    const [reason, setReason] = useState('');
    const [selectedResponsibilities, setSelectedResponsibilities] = useState([]);
    const [subrogationCandidates, setSubrogationCandidates] = useState([]);

    const [selectedDelegate, setSelectedDelegate] = useState(null);

    const [showDelegateError, setShowDelegateError] = useState(false);
    const [showResponsibilitiesError, setShowResponsibilitiesError] = useState(false);
    const [showDelegationReasonError, setShowDelegationReasonError] = useState(false);

    const isFirstApproval = data.approval_steps[0]?.approver?.id === user.employee_id;

    const { showAlert } = useContext(AlertContext);

    const dispatch = useDispatch();
    const { rejectionReasons, hasFetchedOnce } = useSelector(state => state.rejectionReason);

    useEffect(() => {
        if (action === 'Rechazar' && !hasFetchedOnce) {
            dispatch(fetchRejectionReasons());
        }
    }, [dispatch, action, hasFetchedOnce]);

    const leaveTypeId = data.leave_type?.id; // Obtén el ID del tipo de permiso solicitado

    // Filtrar los motivos de rechazo asociados al tipo de permiso solicitado
    const filteredRejectionReasons = rejectionReasons.filter((reason) =>
        reason.leave_types.some((type) => type.id === leaveTypeId)
    );

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

        let hasErrors = false;

        // Validación del comentario en caso de acción "Corregir"
        if (action === 'Corregir' && comment.trim() === '') {
            setShowError(true);
            hasErrors = true;
        }

        // Validación del motivo de rechazo
        if (action === 'Rechazar' && !selectedReason) {
            setShowReasonError(true);
            hasErrors = true;
        }

        // Validaciones de delegación
        if (enableDelegation) {
            if (!selectedDelegate) {
                setShowDelegateError(true);
                hasErrors = true;
            }

            if (!selectedResponsibilities.length) {
                setShowResponsibilitiesError(true);
                hasErrors = true;
            }

            if (reason.trim() === '') {
                setShowDelegationReasonError(true);
                hasErrors = true;
            }
        }

        // Si no hay errores, mostrar la confirmación
        if (!hasErrors) {
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
        setSelectedReason(selectedOption);
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

        // Verificar si el permiso permite delegación y si está habilitada
        const canDelegate = data.requires_subrogation;

        // Agregar datos de delegación si aplica
        if (isFirstApproval && enableDelegation && canDelegate) {
            updatePayload.is_first_approval = true; // Indica si es la primera aprobación

            // Validar y asignar el ID del delegado
            updatePayload.delegate_id = selectedDelegate?.value?.id || null;

            // Validar y asignar el motivo de delegación
            updatePayload.delegate_reason = reason.trim() || null;

            // Directamente asignar las responsabilidades si ya son IDs válidos
            updatePayload.responsibilities = selectedResponsibilities;
        }


        if (action === 'Rechazar') {
            updatePayload.rejection_reason_id = selectedReason ? selectedReason.value.id : null;
        }

        // Obtener el ID del comentario correcto basado en el empleado autenticado
        const commentId = data.approval_steps.find(
            (step) => step.approver.id === user.employee_id
        )?.id;


        if (!commentId) {
            showAlert('No se encontró el comentario para este aprobador.', 'error', 3000);
            onClose();
            return;
        }
        try {
            await dispatch(updateOneCommentAction({
                employeeId: user.employee_id,
                commentId,
                comment: updatePayload,
            })).unwrap();

            showAlert(`Permiso ${action.toLowerCase()} correctamente`, 'success');
            onSuccess();
            onClose();
        } catch (error) {
            const errorMessage = error.message ? JSON.parse(error.message).msg : 'Error al realizar la acción';
            showAlert(errorMessage, 'error', 3000);
            onClose();
        }
    };

    const getButtonColors = () => {
        switch (action) {
            case 'Aprobar': return { confirm: 'bg-green-500 hover:bg-green-600', cancel: 'border-green-500 text-green-500 hover:bg-green-50' };
            case 'Rechazar': return { confirm: 'bg-red-500 hover:bg-red-600', cancel: 'border-red-500 text-red-500 hover:bg-red-50' };
            case 'Corregir': return { confirm: 'bg-orange-500 hover:bg-orange-600', cancel: 'border-orange-500 text-amber-500 hover:bg-orange-50' };
            default: return { confirm: 'bg-blue-500 hover:bg-blue-600', cancel: 'border-blue-500 text-blue-500 hover:bg-blue-50' };
        }
    };

    const { confirm, cancel } = getButtonColors();

    const responsibilities = data?.responsibilities ?? [];

    // Mostrar el formulario de delegación si el permiso requiere subrogación y el usuario actual es un aprobador
    const showDelegationForm = isFirstApproval && enableDelegation;

    // Obtener los candidatos para la subrogación
    const handleEnableDelegationChange = async (isChecked) => {
        setEnableDelegation(isChecked);

        if (isChecked && subrogationCandidates.length === 0) {
            try {
                const response = await getSubrogationCandidates(data.id);
                setSubrogationCandidates(response.data);
            } catch (error) {
                showAlert("Error al obtener candidatos para la delegación.", "error");
            }
        }
    };

    const handleResponsibilitiesChange = (selectedValues) => {
        setSelectedResponsibilities(selectedValues);
        setShowResponsibilitiesError(false);
    };

    const handleDelegateChange = (selectedOption) => {
        setSelectedDelegate(selectedOption);
        setShowDelegateError(false);
    };

    const handleDelegationReasonChange = (e) => {
        setReason(e.target.value);
        setShowDelegationReasonError(false);
    };

    return (
        <>
            <Transition appear show={true} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => { }}>
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
                            <Dialog.Panel className="bg-white rounded-lg shadow-xl w-1/2 max-w-md transform transition-all">
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
                                                    options={filteredRejectionReasons}
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
                                                placeholder="Escriba un comentario..."
                                                value={comment}
                                                onChange={handleCommentChange}
                                                error={showError ? 'El comentario es obligatorio' : ''}
                                                rows={3}
                                            />
                                        </div>

                                        {/* Checkbox para habilitar delegación */}
                                        {action === 'Aprobar' && isFirstApproval && data.requires_subrogation && (
                                            <div className="mb-4 flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="enableDelegation"
                                                    checked={enableDelegation}
                                                    onChange={(e) => handleEnableDelegationChange(e.target.checked)}
                                                    className="cursor-pointer"
                                                />
                                                <label htmlFor="enableDelegation" className="text-sm text-gray-700 cursor-pointer">
                                                    Delegar responsabilidades
                                                </label>
                                            </div>
                                        )}


                                        {/* Formulario de delegación condicional */}
                                        {action === 'Aprobar' && showDelegationForm && (
                                            <DelegationForm
                                                responsibilities={responsibilities}
                                                selectedResponsibilities={selectedResponsibilities}
                                                setSelectedResponsibilities={handleResponsibilitiesChange}
                                                reason={reason}
                                                setReason={handleDelegationReasonChange}
                                                candidates={subrogationCandidates}
                                                selectedDelegate={selectedDelegate}
                                                setSelectedDelegate={handleDelegateChange}
                                                responsibilitiesError={showResponsibilitiesError}
                                                delegateError={showDelegateError}
                                                delegationReasonError={showDelegationReasonError}
                                            />
                                        )}

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