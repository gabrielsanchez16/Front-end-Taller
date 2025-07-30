import { Routes, Route } from 'react-router';
import Login from './Views/Login/Login';
import Register from './Views/Register/Register';
import Dashboard from './Views/Dashboard/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Layout from './Components/Layout/Layout';
import NotSubscribed from './Views/NotSubscribed/NotSubscribed';
import Mechanics from './Views/Mechanics/Mechanics';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas con layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path='/Mechanics' element={<Mechanics/>} />
          {/* Agrega más rutas aquí */}
        </Route>
      </Route>
      <Route path='/not-subscribed' element={<NotSubscribed />} />
    </Routes>
  );
};

export default App;
