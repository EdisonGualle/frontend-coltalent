import React, { useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onCancel}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-background/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="border border-gray-200 w-full max-w-xs transform overflow-hidden rounded-2xl bg-slate-100 p-4 text-left align-middle shadow-xl transition-all">
                                <div className="text-center mt-2">
                                    <p className="text-gray-700 mb-4">
                                        ¿Estás seguro de que deseas solicitar este permiso? Una vez solicitado, no podrás deshacer esta acción.
                                    </p>
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={onConfirm}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                                            tabIndex="0"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={onCancel}
                                            className="flex-1 bg-white border-dashed border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                                            tabIndex="0"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ConfirmationModal;
