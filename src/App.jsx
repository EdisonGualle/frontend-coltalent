import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'regenerator-runtime/runtime';

// Layouts
import LayoutAdmin from "./layouts/LayoutAdmin";

// Pages auth
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";

// Pages admin
import Home from "./pages/admin/Home";
import Error404 from "./pages/Error404";
import Unauthorized from "./pages/Unauthorized";

import { AuthProvider } from "./contexts/AuthContext";

// Proteccion de rutas
import PrivateRoute from "./components/common/routing/PrivateRoute";
import PublicRoute from "./components/common/routing/PublicRoute";

// Employee
import EmployeeIndex from "./pages/admin/Employee/Index";
import Setting from "./pages/Setting/Setting";

// User
import UserIndex from "./pages/admin/User/Index";

// Organization
import DepartmentIndex from "./pages/admin/Organization/Departament/Index";
import UnitIndex from "./pages/admin/Organization/Units/Index";
import PositionIndex from "./pages/admin/Organization/Position/Index";
import { AlertProvider } from "./contexts/AlertContext";
import { Provider } from "react-redux";
import store from "./redux/store";

// Perfil
import Perfil from "./pages/admin/perfil/Index";

// Asistencia 
import Attendance from "./pages/admin/Attendance/Index";

// Permisos
import LeaveIndex from "./pages/admin/Leave/LeaveIndex";
import RejectionReason from "./pages/admin/Leave/RejectionReason/RejectionReason";


//Configuracion
import Configurations from "./pages/Configurations";


function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
        <AuthProvider>
          <AlertProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
            </Route>
            {/* Rutas protegidas que requieren autenticación */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<LayoutAdmin />}>
                <Route  index element={<Home />} />

                {/* User */}
                <Route path="/usuarios" element={<UserIndex />} />

                {/* Employee */}
                <Route path="empleados" element={<EmployeeIndex />} />

                {/* Perfil */}
                <Route path="/perfil/:id/*" element={<Perfil />} />

                {/* Permisos */}
                <Route path="/permisos/*" element={<LeaveIndex />} />
                <Route path="/permisos/motivos-rechazo" element={<RejectionReason />} />
                
                {/* Configuraciones perfil */}
                <Route path="/perfil/configuracion" element={<Setting />} />


                {/* Organization */}
                <Route path="/direcciones" element={<DepartmentIndex />} />
                <Route path="/unidades" element={<UnitIndex />} />
                <Route path="/cargos" element={<PositionIndex />} />
              

                {/* Configuraciones */}
                <Route path="/configuraciones" element={<Configurations />} />              
              
              </Route>
            </Route>
            {/* Ruta para manejar acceso no autorizado */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* Ruta para manejar cualquier otra URL */}
            <Route path="*" element={<Error404 />} />
          </Routes>
          </AlertProvider>
        </AuthProvider>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
