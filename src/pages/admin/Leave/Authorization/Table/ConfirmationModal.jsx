import React, { useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const ConfirmationModal = ({ action, onConfirm, onCancel }) => {
  const getButtonColors = () => {
    switch(action) {
      case 'Aprobar': return { confirm: 'bg-green-500 hover:bg-green-600', cancel: 'border-green-500 text-green-500 hover:bg-green-50' };
      case 'Rechazar': return { confirm: 'bg-red-500 hover:bg-red-600', cancel: 'border-red-500 text-red-500 hover:bg-red-50' };
      case 'Corregir': return { confirm: 'bg-orange-500 hover:bg-orange-600', cancel: 'border-orange-500 text-amber-500 hover:bg-orange-50' };
      default: return { confirm: 'bg-blue-500 hover:bg-blue-600', cancel: 'border-blue-500 text-blue-500 hover:bg-blue-50' };
    }
  };

  const { confirm, cancel } = getButtonColors();

  const getMessage = () => {
    switch(action) {
      case 'Aprobar': return '¿Estás seguro de que deseas aprobar esta solicitud? Una vez aprobada, no podrás deshacer esta acción.';
      case 'Rechazar': return '¿Estás seguro de que deseas rechazar esta solicitud? Una vez rechazada, no podrás deshacer esta acción.';
      case 'Corregir': return '¿Estás seguro de que deseas marcar esta solicitud como incompleta? Una vez marcada, no podrás deshacer esta acción.';
      default: return '¿Estás seguro de que deseas realizar esta acción? Esta acción no se puede revertir.';
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
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
                    {getMessage()}
                  </p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={onConfirm}
                      className={`flex-1 ${confirm} text-white font-bold py-2 px-4 rounded-md transition-colors duration-200`}
                      tabIndex="0" // Asegúrate de que el botón es enfocables
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={onCancel}
                      className={`flex-1 bg-white border-dashed border ${cancel} font-semibold py-2 px-4 rounded-md transition-colors duration-200`}
                      tabIndex="0" // Asegúrate de que el botón es enfocables
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
