// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Dashboard from "./modules/dashboard";
import LoginForm from "./users/login";
import AuthRoutes from "./auth/AuthRoutes";
import routes from "./core/menuRoutes";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginForm />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <AuthRoutes>
              <Dashboard />
            </AuthRoutes>
          }
        >
]
          {/* Resto de subrutas, según tu menuRoutes */}
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
