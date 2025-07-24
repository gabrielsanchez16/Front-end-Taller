import { Routes, Route } from 'react-router';
import Login from './Views/Login/Login';
import Register from './Views/Register/Register';
import Dashboard from './Views/Dashboard/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        {/* Agrega más rutas privadas aquí si necesitas */}
      </Route>
    </Routes>
  );
};

export default App;
