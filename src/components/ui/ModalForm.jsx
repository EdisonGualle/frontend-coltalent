import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const ModalForm = ({
    isOpen,
    setIsOpen,
    title,
    icon,
    children,
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsOpen(false)}
            >
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-100 p-4 text-left align-middle shadow-xl transition-all">
                                {/* Encabezado */}
                                <div className="bg-gray-300 px-2 py-3 rounded-t-2xl flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="mr-4">{icon}</div>
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                                            {title}
                                        </Dialog.Title>
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className=' border-2  border-slate-300 rounded-b-2xl p-2'>
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ModalForm;