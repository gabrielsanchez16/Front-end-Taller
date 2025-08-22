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
import { AnimatePresence, motion } from 'framer-motion';


const Dashboard = () => {

  const [option, setOption] = useState<number>(1);
  const [services, setServices] = useState<ServiceByWork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user } = useAuth();
  // 🔹 Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Cantidad de filas por página

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

  // 🔹 Lógica de paginación
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = services.slice(startIndex, startIndex + itemsPerPage);


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
                {paginatedServices.length > 0 ? (
                  paginatedServices.map((service) => (
                    <tr key={service.id}>
                      <td className="px-4 py-2">{service.name_service}</td>
                      <td className="px-4 py-2 text-center">{service.quantity_order}</td>
                      <td className="px-4 py-2 text-center">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(Number(service.price_unit))}
                      </td>
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
                    <td colSpan={4} className="px-4 py-2 text-center text-gray-500 italic">
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
          {/* 🔹 Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-gray-600 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
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
            <motion.div
              className="min-w-[140px] cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage("/tutorial/mecanicos.png")}
            >
              <img
                src="/tutorial/mecanicos.png"
                alt={`foto-mecanica`}
                className="rounded-xl  w-full object-cover shadow-md"
              />
            </motion.div>
          </div>
        )}
        {option === 2 && (
          <div className="bg-green-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-green-700">
              👥 Clientes
            </h2>
            <p className="text-gray-700">Aquí puedes gestionar todos tus clientes.</p>
            <motion.div
              className="min-w-[140px] cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage("/tutorial/Cliente.png")}
            >
              <img
                src="/tutorial/Cliente.png"
                alt={`foto-clientes`}
                className="rounded-xl  w-full object-cover shadow-md"
              />
            </motion.div>
            
          </div>
        )}
        {option === 3 && (
          <div className="bg-yellow-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-yellow-700">
              🏍️ Motocicletas
            </h2>
            <p className="text-gray-700">Visualiza y administra todas las motocicletas.</p>
            <motion.div
              className="min-w-[140px] cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage("/tutorial/motos.png")}
            >
              <img
                src="/tutorial/motos.png"
                alt={`foto-motos`}
                className="rounded-xl  w-full object-cover shadow-md"
              />
            </motion.div>
          </div>
        )}
        {option === 4 && (
          <div className="bg-purple-50 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2 text-purple-700">
              🛠️ Servicios
            </h2>
            <p className="text-gray-700">Administra los servicios que ofrece tu taller.</p>
            <motion.div
              className="min-w-[140px] cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage("/tutorial/servicios.png")}
            >
              <img
                src="/tutorial/servicios.png"
                alt={`foto-servicios`}
                className="rounded-xl  w-full object-cover shadow-md"
              />
            </motion.div>
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
            <motion.div
              className="min-w-[140px] cursor-pointer mb-4"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage("/tutorial/orden.png")}
            >
              <img
                src="/tutorial/orden.png"
                alt={`foto-orden`}
                className="rounded-xl  w-full object-cover shadow-md"
              />
            </motion.div>
            <motion.div
              className="min-w-[140px] cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage("/tutorial/orden2.png")}
            >
              <img
                src="/tutorial/orden2.png"
                alt={`foto-orden2`}
                className="rounded-xl  w-full object-cover shadow-md"
              />
            </motion.div>
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
            <motion.div
              className="min-w-[140px] cursor-pointer mb-4"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage("/tutorial/finanzas.png")}
            >
              <img
                src="/tutorial/finanzas.png"
                alt={`foto-finanzas`}
                className="rounded-xl  w-full object-cover shadow-md"
              />
            </motion.div>
            <motion.div
              className="min-w-[140px] cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage("/tutorial/tutorial.png")}
            >
              <img
                src="/tutorial/tutorial.png"
                alt={`foto-tutorial`}
                className="rounded-xl  w-full object-cover shadow-md"
              />
            </motion.div>

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
      {/* Modal grande */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedImage(null)}
                >
                  <motion.img
                    key={selectedImage}
                    src={selectedImage}
                    alt="Vista ampliada"
                    className="max-h-[90%] max-w-[90%] rounded-2xl shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al dar click en la imagen
                  />
      
                  {/* Botón cerrar */}
                  <button
                    className="absolute top-6 right-6 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 shadow-lg"
                    onClick={() => setSelectedImage(null)}
                  >
                    ✖
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
      {
        loading && (
          <Loading />
        )
      }
    </div>
  );
};

export default Dashboard;
