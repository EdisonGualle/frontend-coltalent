import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import { fetchEmployeeSchedule } from '../../../../redux/Calendar/weeklyScheduleSlince.js';

import { CardHeader, Typography } from "@material-tailwind/react";


const WeeklySchedule = () => {
  return (
    <div>WeeklySchedule</div>
  )
}

export default WeeklySchedule