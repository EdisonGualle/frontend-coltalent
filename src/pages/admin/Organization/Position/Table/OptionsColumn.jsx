import React, { useState } from 'react';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';
import Dialog2 from '../../../../../components/common/Dialog';

const OptionsColumn = ({ positionId }) => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const handleConfirmEdit = () => {
    console.log(`Confirmar editar cargo con id: ${positionId}`);
    setIsOpenEdit(false);
  };

  const handleConfirmDelete = () => {
    console.log(`Confirmar eliminar cargo con id: ${positionId}`);
    setIsOpenDelete(false);
  };

  const handleCancel = () => {
    setIsOpenEdit(false);
    setIsOpenDelete(false);
  };

  const handleActionClick = (actionType) => {
    if (actionType === 'editar') {
      setIsOpenEdit(true);
    } else if (actionType === 'eliminar') {
      setIsOpenDelete(true);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg transition-colors hover:bg-green-200"
          onClick={() => handleActionClick('editar')}
        >
          <RiEdit2Line />
        </button>
        <button
          className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg transition-colors hover:bg-red-200"
          onClick={() => handleActionClick('eliminar')}
        >
          <RiDeleteBin6Line />
        </button>
      </div>

      {isOpenEdit && (
        <Dialog2
          isOpen={isOpenEdit}
          setIsOpen={setIsOpenEdit}
          title="¿Editar cargo?"
          description="¿Está seguro que desea editar este cargo?"
          confirmButtonText="Sí, editar cargo"
          cancelButtonText="Cancelar"
          onConfirm={handleConfirmEdit}
          onCancel={handleCancel}
          confirmButtonColor="bg-green-500"
          cancelButtonColor="border-gray-400"
          icon={
            <RiEdit2Line className="w-10 h-10 flex items-center justify-center rounded-full text-green-500" />
          }
        />
      )}

      {isOpenDelete && (
        <Dialog2
          isOpen={isOpenDelete}
          setIsOpen={setIsOpenDelete}
          title="¿Eliminar cargo?"
          description="¿Está seguro que desea eliminar este cargo? Esta acción no se podrá deshacer."
          confirmButtonText="Sí, eliminar cargo"
          cancelButtonText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancel}
          confirmButtonColor="bg-red-500"
          cancelButtonColor="border-gray-400"
          icon={
            <RiDeleteBin6Line className="w-10 h-10 flex items-center justify-center rounded-full text-red-500" />
          }
        />
      )}
    </>
  );
};

export default OptionsColumn;