import React, { useState, useEffect } from "react";
import { FaRegClock } from "react-icons/fa";

const AttendanceHeader = () => {
  const [totalTime, setTotalTime] = useState("0h 00m");
  const [weeklyTime, setWeeklyTime] = useState("0h 00m");
  const [delayedTime, setDelayedTime] = useState("0h 00m");
  const [referenceTime, setReferenceTime] = useState("0h 00m");

  useEffect(() => {
    // Simulating data fetching from backend
    const fetchData = async () => {
      // Simulated backend data
      const backendData = {
        totalTime: "48h 08m",
        weeklyTime: "40h 00m",
        delayedTime: "8h 08m",
        referenceTime: "42h 00m"  // Example reference time
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set state with fetched data
      setTotalTime(backendData.totalTime || "0h 00m");
      setWeeklyTime(backendData.weeklyTime || "0h 00m");
      setDelayedTime(backendData.delayedTime || "0h 00m");
      setReferenceTime(backendData.referenceTime || "0h 00m");
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center   shadow rounded-t-lg p-4">
      <FaRegClock className="text-2xl text-gray-500 mr-2" />
      <span className="text-gray-600 text-lg font-semibold">Resumen de Horas</span>
      <div className="flex ml-auto space-x-4">
        <div className="text-center">
          <span className="block text-xs text-gray-500"> Tiempo Total</span>
          <span className="block bg-gray-100 text-gray-600 text-lg font-semibold px-4 py-0.5 rounded-full">
            {totalTime}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-gray-500"> Tiempo Semanal</span>
          <span className="block bg-green-100 text-green-600 text-lg font-semibold px-4 py-0.5 rounded-full">
            {weeklyTime}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-gray-500"> Tiempo de Atraso</span>
          <span className="block bg-red-100 text-red-500 text-lg font-semibold px-4 py-0.5 rounded-full">
            {delayedTime}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-gray-500">Tiempo de Referencia</span>
          <span className="block bg-blue-100 text-blue-500 text-lg font-semibold px-4 py-0.5 rounded-full">
            {referenceTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeader;
