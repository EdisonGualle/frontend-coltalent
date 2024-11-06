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
import ProtectedRoute from "./components/common/routing/ProtectedRoute";



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
import LeaveType from "./pages/admin/Leave/LeaveType/LeaveType";
import AssignedLeaves from "./pages/admin/Leave/Authorization/AssignedLeaves";

//Configuracion
import Configurations from "./pages/Configurations";
import AnotherComponent from "./pages/admin/Employee/AnotherComponent";



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
              <Route path="/" element={<ProtectedRoute allowedRoles={['Administrador', 'Empleado', 'Jefe Dirección', 'Jefe General', 'Jefe Unidad']} />}>
                <Route path="/" element={<LayoutAdmin />}>
                  <Route index element={<Home />} />

                  {/* User */}
                  <Route path="/usuarios" element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route path="" element={<UserIndex />} />
                  </Route>

                  {/* Employee */}
                  <Route path="/empleados" element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route path="" element={<EmployeeIndex />} />
                  </Route>



                  {/* Perfil */}
                  <Route path="/perfil/:id/*" element={<Perfil />} />

                  {/* Permisos */}
                  <Route path="/permisos/:id/*" element={<LeaveIndex />} />

                  <Route path="/permisos/motivos-rechazo" element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route path="" element={<RejectionReason />} />
                  </Route>

                  <Route path="/permisos/tipos" element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route path="" element={<LeaveType />} />
                  </Route>

                  <Route path="/permisos/autorizaciones" element={<ProtectedRoute allowedRoles={['Administrador', 'Jefe Dirección', 'Jefe General', 'Jefe Unidad']} />}>
                    <Route path="" element={<AssignedLeaves />} />
                  </Route>

                  {/* Configuraciones perfil */}
                  <Route path="/perfil/configuracion" element={<Setting />} />


                  {/* Organization */}
                  <Route path="/direcciones" element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route path="" element={<DepartmentIndex />} />
                  </Route>

                  <Route path="/unidades" element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route path="" element={<UnitIndex />} />
                  </Route>

                  <Route path="/cargos" element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route path="" element={<PositionIndex />} />
                  </Route>

                  {/* Configuraciones */}
                  <Route path="/configuraciones" element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route path="" element={<Configurations />} />
                  </Route>

                  {/* Otro componente  */}
                  <Route path="/prueba-calendario" element={<AnotherComponent />} />

                  {/* Asistencia */}


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
