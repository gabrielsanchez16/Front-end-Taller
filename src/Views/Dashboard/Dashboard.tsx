import { useState, useEffect } from 'react';
import {
  Wrench,
  Users,
  Bike,
  ListChecks,
  FileText,
  Gauge,
  Mail, MessageCircleHeart
} from "lucide-react";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/16/solid";

import toast from "react-hot-toast";
import Loading from "../../Components/Loading/Loading";
import { useAuth } from '../../hooks/useAuth';
import { getServicesByWorkshop } from '../../Utils/apiServiceByWork';
import type { ServiceByWork } from '../../Interface/ServiceByWork';


const Dashboard = () => {

  const [option, setOption] = useState<number>(1);
  const [services, setServices] = useState<ServiceByWork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const menu = [
    { id: 1, label: "Mecánicos", icon: <Wrench size={24} /> },
    { id: 2, label: "Clientes", icon: <Users size={24} /> },
    { id: 3, label: "Motocicletas", icon: <Bike size={24} /> },
    { id: 4, label: "Servicios", icon: <ListChecks size={24} /> },
    { id: 5, label: "Órdenes", icon: <FileText size={24} /> },
    { id: 6, label: "Dashboard", icon: <Gauge size={24} /> },
    { id: 7, label: "Soporte tecnico", icon: <ChatBubbleOvalLeftEllipsisIcon height={24} width={24} /> },
  ];

  const fetchMotorcycles = async (id: string) => {
    setLoading(true);
    try {
      const responseServices = await getServicesByWorkshop(id);
      setServices(responseServices);
      console.log(responseServices)
    } catch (error) {
      console.error("Error obteniendo servicios:", error);
      toast.error("Hubo un error al obtener los servicios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMotorcycles(user.id);
    }
  }, [user])




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
            Servicios registrados
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
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-4 py-2">{service.name_service}</td>
                      <td className="px-4 py-2 text-center">{service.quantity_order}</td>

                      {/* Precio unitario */}
                      <td className="px-4 py-2 text-center">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(Number(service.price_unit))}
                      </td>

                      {/* Precio total */}
                      <td className="px-4 py-2 text-center font-medium text-green-600">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(Number(service.price_total))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-center text-gray-500 italic"
                    >
                      🚀 No hay datos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
              {services.length > 0 && (
                <tfoot className="bg-indigo-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-semibold text-indigo-900">
                      Total General:
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-green-700 text-lg">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(
                        services.reduce(
                          (acc, service) => acc + Number(service.price_total),
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tfoot>
              )}
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
            <img src="/tutorial/mecanicos.png" className="mt-4 rounded-lg shadow-md" alt="mecanicos" />
          </div>
        )}
        {option === 2 && (
          <div className="bg-green-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-green-700">
              👥 Clientes
            </h2>
            <p className="text-gray-700">Aquí puedes gestionar todos tus clientes.</p>
            <img src="/tutorial/Cliente.png" className="mt-4 rounded-lg shadow-md" alt="clientes" />
          </div>
        )}
        {option === 3 && (
          <div className="bg-yellow-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-yellow-700">
              🏍️ Motocicletas
            </h2>
            <p className="text-gray-700">Visualiza y administra todas las motocicletas.</p>
            <img src="/tutorial/motos.png" className="mt-4 rounded-lg shadow-md" alt="motos" />
          </div>
        )}
        {option === 4 && (
          <div className="bg-purple-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-purple-700">
              🛠️ Servicios
            </h2>
            <p className="text-gray-700">Administra los servicios que ofrece tu taller.</p>
            <img src="/tutorial/servicios.png" className="mt-4 rounded-lg shadow-md" alt="servicios" />
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

            <p className="text-gray-600 mt-4">
              En las imagenes funciona igual tanto para crear como para editar una orden
            </p>
            <img src="/tutorial/orden.png" className="mt-4 rounded-lg shadow-md" alt="orden" />
            <img src="/tutorial/orden2.png" className="mt-4 rounded-lg shadow-md" alt="orden2" />
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
            <img src="/tutorial/finanzas.png" className="mt-4 rounded-lg shadow-md" alt="finanzas" />
            <img src="/tutorial/tutorial.png" className="mt-4 rounded-lg shadow-md" alt="tutorial" />
          </div>
        )}
        {option === 7 && (
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-indigo-700">
              🛠️ Soporte Tecnico
            </h2>


            <p className="text-gray-700 flex flex-col gap-3">
              <span className="flex items-center gap-2">
                <MessageCircleHeart className="w-5 h-5 text-pink-500" />
                <span>Siempre estaremos aquí para ayudarte 💪</span>
              </span>

              <span className="text-sm text-gray-600">
                Estamos abiertos a sugerencias y mejoras, porque tu opinión nos importa ✨
              </span>

              <span className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <a
                  href="mailto:unprogramadormecanico@gmail.com"
                  className="text-blue-600 underline hover:text-blue-800 transition"
                >
                  unprogramadormecanico@gmail.com
                </a>
              </span>
            </p>
          </div>
        )}
      </section>
      {
        loading && (
          <Loading />
        )
      }
    </div>
  );
};

export default Dashboard;
