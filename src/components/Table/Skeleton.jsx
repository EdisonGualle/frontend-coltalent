import React from "react";

const Skeleton = () => {
  return (
    <>
      <div className="sm:flex sm:gap-x-2 animate-pulse">
        <div className="mt-2 h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="mt-2 h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-[50vh] mt-4 flex flex-col overflow-y-scroll animate-pulse">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </th>
                    <th
                      scope="col"
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1 pb-2 animate-pulse">
        <div className="flex-1 flex justify-between sm:hidden">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-gray-700">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </span>
            <label>
              <span className="sr-only">Items Per page</span>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </label>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <div className="rounded-l-md p-1 h-6 bg-gray-200 rounded w-8"></div>
              <div className="p-1 h-6 bg-gray-200 rounded w-8"></div>
              <div className="p-1 h-6 bg-gray-200 rounded w-8"></div>
              <div className="rounded-r-md p-1 h-6 bg-gray-200 rounded w-8"></div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Skeleton;