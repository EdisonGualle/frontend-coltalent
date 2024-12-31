import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { fetchAllContractAssignments } from "../../../../redux/Contracts/contractAssignmentSlince";
import ContractTable from "../Table/ContractTable";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import {
  contractAssignmentFixedColumns,
  contractAssignmentVisibleColumns,
  contractAssignmentGeneralColumns,
  dynamicFilterColumns
} from "./Table/contractAssignmentColumns";
import { getAllCellStyle } from "./Table/contractAssignmentColumnsStyles";
import renderContractAssignmentActions from "./Table/renderContractAssignmentActions";
import { AlertContext } from "../../../../contexts/AlertContext";
import ModalForm from "../../../../components/ui/ModalForm";
import Dialog2 from "../../../../components/ui/Dialog2";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import { LiaFileContractSolid } from "react-icons/lia";

const ContractAssignment = () => {
  const dispatch = useDispatch();
  const { contractAssignments, fetchStatus, error, hasFetchedAll } = useSelector(
    (state) => state.contractAssignments
  );

  const { showAlert } = useContext(AlertContext);

  // Estados


  // Obtener todos los contratos asignados
  useEffect(() => {
    if (!hasFetchedAll) {
      dispatch(fetchAllContractAssignments());
    }
  }, [dispatch, hasFetchedAll]);

  return (
    <div>
      {fetchStatus === "loading" && <LoadingIndicator />}
      {fetchStatus === "failed" && showAlert("Error al cargar los tipos de contrato", "error")}
      {/* Solo Mostramos la tabla si hay datos*/}
      {fetchStatus === "succeeded" && contractAssignments.length > 0 && (
        <ContractTable
          allColumns={contractAssignmentGeneralColumns}
          fixedColumns={contractAssignmentFixedColumns}
          columns={[...contractAssignmentFixedColumns, ...contractAssignmentVisibleColumns]}
          data={contractAssignments}
          getCellStyle={getAllCellStyle}
          dynamicFilterColumns={dynamicFilterColumns}
          showActions={true}
          showAddNew={true}
          actions={(row) => renderContractAssignmentActions({
            row,
            onRenew: (row) => {
              console.log("Editando", row);
            },
            onTerminate: (row) => {
              console.log("Eliminando", row);
            },
          })
          }
        />
      )}

      {/* Si no hay datos disponibles, mostramos un mensaje */}

      {contractAssignments.length === 0 && fetchStatus !== "loading" && (
        <div className="py-10 text-gray-400 text-center">No hay contratos disponibles</div>
      )}
    </div>
  )
}

export default ContractAssignment