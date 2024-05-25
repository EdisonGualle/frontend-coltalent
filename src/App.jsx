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

// Pruebas
import CreateDepartmentForm from "./pages/admin/Organization/Departament/pruebba";
import Department from "./components/prueba";


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
                <Route index element={<Home />} />
                <Route path="empleados" element={<EmployeeIndex />} />
                <Route path="/perfil/configuracion" element={<Setting />} />
                {/* User */}
                <Route path="/usuarios" element={<UserIndex />} />
                {/* Employee */}


                {/* Organization */}
                <Route path="/direcciones" element={<DepartmentIndex />} />
                <Route path="/unidades" element={<UnitIndex />} />
                <Route path="/cargos" element={<PositionIndex />} />
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
