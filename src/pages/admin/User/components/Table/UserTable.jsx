// En UserTable.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTable, useFilters, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import GlobalFilter from '../../../../../components/Table/GlobalFilter';
import { Button, PageButton } from '../../../../../assets/Button';
import { SortIcon, SortUpIcon, SortDownIcon } from '../../../../../assets/Icons';
import { RiArrowLeftDoubleLine, RiArrowLeftSLine, RiArrowRightSLine, RiArrowRightDoubleLine } from "react-icons/ri";
import { UserColumns } from './UserColumns';
import OptionsColumn from './OptionsColumn';
import { fetchUsers, selectUsers } from '../../../../../redux/User/userSlice';

// Componente para la tabla de usuarios
function UserTable({ }) {
  // Usamos los hooks de Redux para despachar acciones y obtener el estado global
  const dispatch = useDispatch();
  // Obtener la lista de usuarios del estado global
  const users = useSelector(selectUsers);

  // Estado local para manejar el estado de la tabla
  const [tableState, setTableState] = useState({
    pageIndex: 0, // Página actual
    pageSize: 5,  // Cantidad de elementos por página
  });


  // Función para actualizar la lista de usuarios
  const memoizedUsers = useMemo(() => users, [users]);

  // Función para obtener la lista de usuarios
  const memoizedFetchUsers = useCallback(() => {
    dispatch(fetchUsers()); // Despachar la acción para cargar los usuarios
  }, [dispatch]);

  // Configuración de la tabla
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns: UserColumns,    // Columnas de la tabla
      data: memoizedUsers,     // Datos de la tabla
      initialState: { pageIndex: 0, pageSize: 10 },// Estado inicial de la tabla
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Efecto para cargar la lista de usuarios
  useEffect(() => {
    memoizedFetchUsers();
  }, [memoizedFetchUsers]);

  // Efecto para actualizar el estado de la tabla
  useEffect(() => {
    setTableState(state);
  }, [state]);

  // Función para actualizar la lista de usuarios
  const updateUsers = useCallback(() => {
    memoizedFetchUsers();
  }, [memoizedFetchUsers]);

  // Renderizar la tabla
  return (
    <>
      <div className='shadow-sm'>
        {/* Filtros */}
        <div className="flex flex-col h-full">
          <div className="flex flex-wrap clas items-center space-x-4 bg-white px-2 py-3 rounded-t-lg">
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            {headerGroups.map((headerGroup) =>
              headerGroup.headers.map((column) =>
                column.Filter ? (
                  <div className="mt-2 sm:mt-0" key={column.id}>
                    {column.render("Filter")}
                  </div>
                ) : null
              )
            )}
          </div>
        </div>
        {/* table */}
        <div className=" flex-1">
          <div className="overflow-x-auto">
            <table {...getTableProps()} className="min-w-full table-fixed">
              <thead className="bg-gray-100">
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th
                        scope="col"
                        className="group px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                      >
                        <div className="flex items-center justify-between">
                          {column.render('Header')}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? <SortDownIcon className="w-4 h-4 text-gray-400" />
                                : <SortUpIcon className="w-4 h-4 text-gray-400" />
                              : (
                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                              )}
                          </span>
                        </div>
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider text-center"
                      >
                      Opciones
                    </th>
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="bg-white text-gray-700">
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}
                    className='hover:bg-gray-100 group transition duration-200 ease-in-out'
                    >
                      {row.cells.map(cell => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="px-6 py-3 text-sm whitespace-normal break-words group-hover:bg-gray-100 transition duration-200 ease-in-out"
                            role="cell"
                          >
                            {cell.column.Cell.name === "defaultRenderer"
                              ? <div className="text-sm text-gray-500">{cell.render('Cell')}</div>
                              : cell.render('Cell')
                            }
                          </td>
                        )
                      })}
                      {/* Columna de opciones */}
                      <td className='px-6 py-3 flex justify-center group-hover:bg-gray-100  transition duration-200 ease-in-out'>
                      <OptionsColumn user={row.original} updateUsers={updateUsers} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination */}
        <div className="bg-white p-2 pt-2 flex flex-col sm:flex-row items-center justify-between rounded-b-lg">
        <div className="flex-1 flex justify-between sm:hidden mb-4 sm:mb-0">
            <Button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-3 py-1 text-xs">
              Anterior
            </Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage} className="px-3 py-1 text-xs">
              Siguiente
            </Button>
          </div>
          <div className="w-full sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-x-4 items-baseline mb-4 sm:mb-0">
              <span className="text-sm text-gray-700">
                Página <span className="font-medium">{state.pageIndex + 1}</span> de <span className="font-medium">{pageOptions.length}</span>
              </span>
              <label className="flex items-center">
                <span className="mr-2 text-sm text-gray-700">Mostrar</span>
                <select
                className="text-sm   block rounded-lg shadow-sm border-2 border-gray-300"
                value={state.pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                >
                  {[10, 20, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
                <span className="ml-2 text-sm text-gray-700">por página</span>
              </label>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm" aria-label="Paginación">
                <PageButton
                  className="rounded-l-md px-2 py-1"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">Primera</span>
                  <RiArrowLeftDoubleLine className="h-3 w-3" aria-hidden="true" />
                </PageButton>
                <PageButton
                  className="px-2 py-1"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">Anterior</span>
                  <RiArrowLeftSLine className="h-3 w-3" aria-hidden="true" />
                </PageButton>
                <PageButton
                  className="px-2 py-1"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  <span className="sr-only">Siguiente</span>
                  <RiArrowRightSLine className="h-3 w-3" aria-hidden="true" />
                </PageButton>
                <PageButton
                  className="rounded-r-md px-2 py-1"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  <span className="sr-only">Última</span>
                  <RiArrowRightDoubleLine className="h-3 w-3" aria-hidden="true" />
                </PageButton>
              </nav>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default UserTable;