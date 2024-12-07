import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangeFilter = ({ onDateRangeChange }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const handleDateChange = (update) => {
        setDateRange(update);
        onDateRangeChange(update);
    };

    return (
        <div className="relative flex items-center justify-center max-w-md mx-auto h-6 group">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50 blur-lg group-hover:opacity-75 transition-all duration-300"></div>
        <div className="relative w-full bg-white bg-opacity-30 backdrop-blur-sm rounded-lg shadow-md     border border-white border-opacity-50 group-hover:shadow-lg transition-all duration-300">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            isClearable
            placeholderText="Filtrar rango de fechas"
            className="min-w-[230px] max-w-[400px] pl-4 pr-6 py-2 text-base text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0"
            calendarClassName="rounded-lg shadow-lg border border-gray-200" 
            dateFormat="dd/MM/yyyy"
            popperClassName="z-50" 
            portalId="root"
            popperContainer={({ children }) => <div className="z-50">{children}</div>}
          />
        </div>
      </div>
      
    );
};

export default DateRangeFilter;
