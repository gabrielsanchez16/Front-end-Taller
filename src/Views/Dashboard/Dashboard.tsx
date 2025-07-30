import { useState } from "react";
import {
  Wrench,
  Users,
  Bike,
  ListChecks,
  FileText,
  Gauge,
  PackageSearch,
} from "lucide-react";


const Dashboard = () => {

  const [option, setOption] = useState<number>(1);
  const menu = [
    { id: 1, label: "Mecánicos", icon: <Wrench size={24} /> },
    { id: 2, label: "Clientes", icon: <Users size={24} /> },
    { id: 3, label: "Motocicletas", icon: <Bike size={24} /> },
    { id: 4, label: "Servicios", icon: <ListChecks size={24} /> },
    { id: 5, label: "Órdenes", icon: <FileText size={24} /> },
    { id: 6, label: "Dashboard", icon: <Gauge size={24} /> },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        Bienvenido al sistema de gestión para tu taller
      </h1>

      <section className="p-6 max-w-7xl mx-auto mb-7">
        <header className="mb-6 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Central de Finanzas del Taller
          </h1>
          <p className="mt-2 text-gray-500 text-sm md:text-base">
            Acá verás los servicios vendidos del taller, mano de obra y repuestos.
          </p>
        </header>

        {/* Mano de obra */}
        <div className="mb-10">
          <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            <Wrench className="text-indigo-600 w-5 h-5" />
            Mano de Obra
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="px-4 py-2 text-left">Servicio</th>
                  <th className="px-4 py-2 text-center">Cantidad</th>
                  <th className="px-4 py-2 text-center">Precio Unitario</th>
                  <th className="px-4 py-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2">Cambio de aceite</td>
                  <td className="px-4 py-2 text-center">1</td>
                  <td className="px-4 py-2 text-center">$50.000</td>
                  <td className="px-4 py-2 text-center font-medium text-green-600">
                    $50.000
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2">Revisión general</td>
                  <td className="px-4 py-2 text-center">1</td>
                  <td className="px-4 py-2 text-center">$100.000</td>
                  <td className="px-4 py-2 text-center font-medium text-green-600">
                    $100.000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Repuestos */}
        <div>
          <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            <PackageSearch className="text-yellow-600 w-5 h-5" />
            Repuestos
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
              <thead className="bg-yellow-100 text-yellow-800">
                <tr>
                  <th className="px-4 py-2 text-left">Repuesto</th>
                  <th className="px-4 py-2 text-center">Cantidad</th>
                  <th className="px-4 py-2 text-center">Precio Unitario</th>
                  <th className="px-4 py-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2">Filtro de aceite</td>
                  <td className="px-4 py-2 text-center">2</td>
                  <td className="px-4 py-2 text-center">$20.000</td>
                  <td className="px-4 py-2 text-center font-medium text-green-600">
                    $40.000
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2">Bujía</td>
                  <td className="px-4 py-2 text-center">4</td>
                  <td className="px-4 py-2 text-center">$15.000</td>
                  <td className="px-4 py-2 text-center font-medium text-green-600">
                    $60.000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>


      <section className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Tutorial de uso 🚀
        </h3>
        <p className="text-gray-600 mb-6">
          Aquí verás el flujo correcto para manejar tu sistema de la mejor
          manera.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {menu.map((item) => (
            <li
              key={item.id}
              onClick={() => setOption(item.id)}
              className={`flex items-center gap-3 p-4 bg-gray-100 hover:bg-blue-100 text-gray-800 rounded-lg shadow-sm cursor-pointer transition-all duration-300 ${option === item.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        {option === 1 && (
          <div className="bg-blue-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-blue-700">
              👨‍🔧 Mecánicos
            </h2>
            <p className="text-gray-700">
              Aquí podrás ver todos los mecánicos registrados, así como crear
              nuevos, editar o eliminar los existentes.
            </p>
          </div>
        )}
        {option === 2 && (
          <div className="bg-green-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-green-700">
              👥 Clientes
            </h2>
            <p className="text-gray-700">Aquí puedes gestionar todos tus clientes.</p>
          </div>
        )}
        {option === 3 && (
          <div className="bg-yellow-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-yellow-700">
              🏍️ Motocicletas
            </h2>
            <p className="text-gray-700">Visualiza y administra todas las motocicletas.</p>
          </div>
        )}
        {option === 4 && (
          <div className="bg-purple-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-purple-700">
              🛠️ Servicios
            </h2>
            <p className="text-gray-700">Administra los servicios que ofrece tu taller.</p>
          </div>
        )}
        {option === 5 && (
          <div className="bg-red-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-red-700">
              📄 Órdenes
            </h2>
            <p className="text-gray-700">
              Crea y gestiona órdenes de trabajo para tus clientes.
            </p>
          </div>
        )}
        {option === 6 && (
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-indigo-700">
              📊 Dashboard
            </h2>
            <p className="text-gray-700">
              Revisa estadísticas clave y el rendimiento de tu taller.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
