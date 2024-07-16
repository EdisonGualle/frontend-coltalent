import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTable, useFilters, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import GlobalFilter from '../../../../../components/Table/GlobalFilter';
import { Button, PageButton } from '../../../../../assets/Button';
import { SortIcon, SortUpIcon, SortDownIcon } from '../../../../../assets/Icons';
import { RiArrowLeftDoubleLine, RiArrowLeftSLine, RiArrowRightSLine, RiArrowRightDoubleLine } from "react-icons/ri";
import OptionsColumn from '../Table/OptionsColumn';
import { DepartamentColumns } from './DepartamentColumns';
import { fetchAllDepartmentsIncludingDeleted } from '../../../../../redux/Organization/DepartamentSlice';
import Skeleton from '../../../../../components/Table/Skeleton';


function DepartamentTable() {
  const dispatch = useDispatch();
  const allDepartments = useSelector(state => state.departament.allDepartments);
  const status = useSelector(state => state.departament.status);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchAllDepartmentsIncludingDeleted()).unwrap();
      } catch (error) {
        console.error('Error fetching positions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'idle') {
      fetchData();
    }
  }, [dispatch, status]);

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
      columns: DepartamentColumns,
      data: allDepartments,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const fetchDepartmentsAction = () => {
    dispatch(fetchAllDepartmentsIncludingDeleted());
  };

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='sticky top-0 bg-white z-10'>
        <div className="flex flex-wrap items-center space-x-4">
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
      <div className="flex-1 overflow-y-auto">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-200">
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                      >
                        Opciones
                      </th>
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-3 text-sm whitespace-normal break-words"
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
                        <td className='px-6 py-3 flex justify-center'>
                          <OptionsColumn departament={row.original} fetchDepartments={fetchDepartmentsAction} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between  pt-2  border-t-2">
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
                className="text-sm   block rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
  )
}

export default DepartamentTable;
