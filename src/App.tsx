import { Routes, Route } from 'react-router';
import Login from './Views/Login/Login';
import Register from './Views/Register/Register';
import Dashboard from './Views/Dashboard/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Layout from './Components/Layout/Layout';
import NotSubscribed from './Views/NotSubscribed/NotSubscribed';
import Mechanics from './Views/Mechanics/Mechanics';
import Clients from './Views/Clients/Clients';
import Motorcycles from './Views/Motorcycles/Motorcycles';
import WorkOrderCreate from './Views/WorkOrder/WorkOrderCreate';
import Services from './Views/Services/Services';
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <> 
    <Toaster position="top-right" toastOptions={{
      duration:5000
    }}/>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas con layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path='/Mechanics' element={<Mechanics/>} />
          <Route path='/Clients' element={<Clients/>} />
          <Route path='/Motorcycles' element={<Motorcycles/>} />
          <Route path='/Services' element={<Services/>} />
          <Route path='/Order/create' element={<WorkOrderCreate/>} />

          {/* Agrega más rutas aquí */}
        </Route>
      </Route>
      <Route path='/not-subscribed' element={<NotSubscribed />} />
    </Routes>
    </>
   
  );
};

export default App;
