import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useTable, useFilters, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import GlobalFilter from '../../../../../components/Table/GlobalFilter';
import { Button, PageButton } from '../../../../../assets/Button';
import { SortIcon, SortUpIcon, SortDownIcon } from '../../../../../assets/Icons';
import { RiArrowLeftDoubleLine, RiArrowLeftSLine, RiArrowRightSLine, RiArrowRightDoubleLine } from "react-icons/ri";
import { UserColumns } from './UserColumns';
import OptionsColumn from './OptionsColumn';
import { UserDataContext } from '../../Context/UserDataContext';

function UserTable({ }) {
  const { users, setUsers, updateUsers } = useContext(UserDataContext);
    const [tableState, setTableState] = useState({ // Estado para controlar la página y el tamaño de la tabla
    pageIndex: 0,
    pageSize: 5,
  });

  const memoizedUsers = useMemo(() => users, [users]);

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
      columns: UserColumns,
      data: memoizedUsers,
      initialState: tableState,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setTableState(state);
  }, [state]);

  return (
    <>
      <div className="sm:flex sm:gap-x-2">
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
      {/* table */}
      <div className=" h-[54vh] mt-4 flex flex-col overflow-y-scroll">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                              className="px-6 py-3 whitespace-nowrap"
                              role="cell"
                            >
                              {cell.column.Cell.name === "defaultRenderer"
                                ? <div className="text-sm text-gray-500">{cell.render('Cell')}</div>
                                : cell.render('Cell')
                              }
                            </td>
                          )
                        })}
                        <td className='px-6 py-3 flex justify-center'>
                          <OptionsColumn user={row.original} updateUsers={updateUsers} />                        
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
      <div className="flex items-center justify-between mt-1 pb-2">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-gray-700">
              Página <span className="font-medium">{state.pageIndex + 1}</span> de <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Por página</span>
              <select
                className=" text-sm block w-full rounded-lg "
                value={state.pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 6].map(pageSize => (
                  <option key={pageSize} value={pageSize} className='text-sm'>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <PageButton className="rounded-l-md p-1" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                <span className="sr-only">First</span>
                <RiArrowLeftDoubleLine className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton className="p-1" onClick={() => previousPage()} disabled={!canPreviousPage}>
                <span className="sr-only">Previous</span>
                <RiArrowLeftSLine className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton className="p-1" onClick={() => nextPage()} disabled={!canNextPage}>
                <span className="sr-only">Next</span>
                <RiArrowRightSLine className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton className="rounded-r-md p-1" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                <span className="sr-only">Last</span>
                <RiArrowRightDoubleLine className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserTable;