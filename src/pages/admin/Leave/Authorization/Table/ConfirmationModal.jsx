import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { RiAlertFill } from "react-icons/ri";

const ConfirmationModal = ({ action, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const getButtonColors = () => {
    switch (action) {
      case 'Aprobar': return { confirm: 'bg-green-500 hover:bg-green-600', cancel: 'border-green-500 text-green-500 hover:bg-green-50' };
      case 'Rechazar': return { confirm: 'bg-red-500 hover:bg-red-600', cancel: 'border-red-500 text-red-500 hover:bg-red-50' };
      case 'Corregir': return { confirm: 'bg-orange-500 hover:bg-orange-600', cancel: 'border-orange-500 text-amber-500 hover:bg-orange-50' };
      default: return { confirm: 'bg-blue-500 hover:bg-blue-600', cancel: 'border-blue-500 text-blue-500 hover:bg-blue-50' };
    }
  };

  const { confirm, cancel } = getButtonColors();

  const getMessage = () => {
    switch (action) {
      case 'Aprobar': return '¿Estás seguro de que deseas aprobar esta solicitud? Una vez aprobada, no podrás deshacer esta acción.';
      case 'Rechazar': return '¿Estás seguro de que deseas rechazar esta solicitud? Una vez rechazada, no podrás deshacer esta acción.';
      case 'Corregir': return '¿Estás seguro de que deseas marcar esta solicitud como incompleta? Una vez marcada, no podrás deshacer esta acción.';
      default: return '¿Estás seguro de que deseas realizar esta acción? Esta acción no se puede revertir.';
    }
  };

  const handleConfirm = () => {
    setLoading(true);
    onConfirm().finally(() => {
      setLoading(false);
    });
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
              <Dialog.Panel className="relative border border-gray-200 w-full max-w-xs transform overflow-hidden rounded-2xl bg-slate-100 p-4 text-left align-middle shadow-xl transition-all">
                {/* <div className="flex justify-center">
                  <RiAlertFill className="w-12 h-12 text-red-600 mb-4" />
                </div> */}
                <div className={`text-center mt-2 ${loading ? 'opacity-20' : ''}`}>
                  <p className="text-gray-700 mb-4">
                    {getMessage()}
                  </p>
                  <div className="flex justify-center space-x-2 mt-4">
                    <button
                      onClick={handleConfirm}
                      className={`relative flex-1 ${confirm} text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
                      tabIndex="0"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={onCancel}
                      className={`relative flex-1 bg-white border-dashed border ${cancel} font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
                      tabIndex="0"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
                {loading && (
                  <div role="status" className="absolute inset-0 flex items-center justify-center">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;
