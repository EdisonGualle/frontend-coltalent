import { configureStore } from '@reduxjs/toolkit';
import employeReducer from './Employee/employeSlice';
import userReducer from './User/userSlice';
import rolReducer from './User/rolSlice';
import userStateReducer from './User/userStateSlice';
import departamentReducer from './Organization/DepartamentSlice';
export default configureStore({
  reducer: {
    employee: employeReducer,
    user: userReducer,
    role: rolReducer,
    userState: userStateReducer,
    departament: departamentReducer,
  },
});