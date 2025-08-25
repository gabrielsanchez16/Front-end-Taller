import { useForm } from "react-hook-form";
import type { WorkOrder } from "../../Interface/WorkOrder";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getAllMechanics } from "../../Utils/api";
import type { Mechanic } from "../../Interface/Mechanics";
import { getOrderById } from "../../Utils/apiWorkOrder";
import { toast } from "react-hot-toast";
import type { ServiceByWork } from '../../Interface/ServiceByWork';
import { ClipboardList, Wrench, Calendar, DollarSign, Hammer, Cog } from "lucide-react";
import { motion } from "framer-motion";
import FotosSection from "../../Components/PhotoSection/PhotosSection";

const OrdenView = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [selectedServices, setSelectedServices] = useState<
        (ServiceByWork)[]
    >([]);
    const id_order = searchParams.get('id');
    const user_id = searchParams.get('iduser');
    const icons = [Wrench, Hammer, Cog];

    const [order, setOrder] = useState<WorkOrder>()
    const [mechanics, setMechanics] = useState<Mechanic[]>([])
    // const [services, setServices] = useState<Service[]>([])
    const totalGeneral = selectedServices.reduce(
        (sum, s) => sum + s.price_unit * s.quantity_order,
        0
    );
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        setValue,
        reset,
        getValues,
    } = useForm<WorkOrder>();


    useEffect(() => {
        setValue("price", totalGeneral);
    }, [totalGeneral, setValue, order]);


    useEffect(() => {
        if (order && order.photos) {
          
            reset(order); // carga todos los valores en react-hook-form
            if (order.date) {
                setValue("date", new Date(order.date).toISOString().split("T")[0]);
            }
            setSelectedServices(order.service_by_workshops ?? []);
            setPreviewImages(order.photos.map(p => p.path).filter((p): p is string => Boolean(p)));
            
        }
    }, [order, reset, setValue]);



    const fetchMechanics = async (id: string) => {
        const responseMechanics = await getAllMechanics(id);
        setMechanics(responseMechanics)
    }

    const fetchOrder = async (id: string) => {
        setLoading(true)
        try {
            const responseOrder = await getOrderById(id);
            setOrder(responseOrder);
            setSelectedServices(responseOrder?.service_by_workshops || []);
            setPreviewImages(
                (responseOrder.photos as { path?: string }[])
                    .map((p: { path?: string }) => p.path)
                    .filter((p): p is string => Boolean(p))
            );

        } catch (error) {
            console.error("Error obteniendo la orden:", error);
            toast.error("Hubo un error al obtener la orden.");
        }finally{
            setLoading(false)
        }
    }



    useEffect(() => {
        console.log(user_id, id_order)
        if (user_id && id_order) {
            fetchMechanics(user_id)
            fetchOrder(id_order)
        }
    }, [])








    return (
        <>
            {/* Contenedor principal */}
            <motion.div
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
                className="relative bg-gradient-to-r min-h-screen from-[#111827] via-[#1f2937] to-[#374151] bg-[length:200%_200%] p-6 shadow-lg overflow-hidden"
            >
                {/* Glow overlay */}
                <div className="absolute inset-0">
                    <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(80)].map((_, i) => {
                        const Icon = icons[i % icons.length]; // rota entre herramientas
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 0, rotate: 0 }}
                                animate={{
                                    opacity: [0.2, 1, 0.2],
                                    y: [0, -30, 0],
                                    rotate: [0, 15, -15, 0]
                                }}
                                transition={{ duration: 6 + (i % 5), repeat: Infinity }}
                                className="absolute text-white/60"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    fontSize: `${Math.random() * 30 + 15}px`, // tamaños aleatorios
                                }}
                            >
                                <Icon className="w-7 h-7" />
                            </motion.div>
                        );
                    })}
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_70%)]"></div>

                <motion.div className=" max-w-4xl mx-auto space-y-6 ">
                    {/* Header */}


                    {/* Card principal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative rounded-2xl p-6 sm:p-8 space-y-6 bg-[#e6ffe6e7] z-10 border border-blue-500/30 shadow-lg shadow-blue-500/20"


                    >
                        {/* Descripción */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl flex items-center justify-center gap-2">
                                <ClipboardList className="w-8 h-8 text-blue-600" />
                                {getValues("title")}
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base mt-2">
                                🚀 Detalles completos de tu orden de servicio
                            </p>
                        </motion.div>
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
                                <ClipboardList className="w-5 h-5 text-blue-500" /> Descripción
                            </h2>
                            <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: getValues("description") || "" }} />
                        </section>

                        {/* Recomendaciones */}
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
                                <ClipboardList className="w-5 h-5 text-green-500" /> Recomendaciones
                            </h2>


                            <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: getValues("recommendations") || "" }} />
                        </section>

                        {/* Precio & Fecha */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Precio */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-blue-50 p-3 sm:p-4 rounded-xl text-center shadow-sm"
                            >
                                <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center gap-1">
                                    <DollarSign className="w-4 h-4 text-blue-600" /> Precio total
                                </p>
                                <p className="text-lg sm:text-xl font-bold text-blue-700">
                                    {new Intl.NumberFormat("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                        minimumFractionDigits: 0,
                                    }).format(totalGeneral)}
                                </p>
                            </motion.div>

                            {/* Fecha */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-green-50 p-3 sm:p-4 rounded-xl text-center shadow-sm"
                            >
                                <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center gap-1">
                                    <Calendar className="w-4 h-4 text-green-600" /> Fecha
                                </p>
                                <p className="text-lg sm:text-xl font-bold text-green-700">
                                    {getValues("date")}
                                </p>
                            </motion.div>
                        </section>


                        {/* Mecánicos */}
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                                <Wrench className="w-5 h-5 text-orange-500" /> Mecánicos
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {mechanics.map((m) => (
                                    <motion.span
                                        key={m.id}
                                        whileHover={{ scale: 1.1 }}
                                        className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full shadow-sm"
                                    >
                                        {m.name}
                                    </motion.span>
                                ))}
                            </div>
                        </section>

                        {/* Servicios */}
                        {selectedServices.length > 0 && (
                            <section>
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                                    <ClipboardList className="w-5 h-5 text-purple-500" /> Servicios incluidos
                                </h2>
                                <div className="overflow-scroll rounded-2xl border border-white/10 shadow-lg backdrop-blur-sm bg-white/5">
                                    <table className="w-full text-sm text-gray-300">
                                        <thead className="bg-gradient-to-r from-purple-700/60 to-indigo-700/60 text-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left">Servicio</th>
                                                <th className="px-4 py-3 text-center">Cantidad</th>
                                                <th className="px-4 py-3 text-right">Precio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedServices.map((s, i) => (
                                                <motion.tr
                                                    key={s.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="border-b bg-[#111827]/80 border-white/10 transition"
                                                >
                                                    <td className="px-4 py-3 font-medium text-white">{s.name_service}</td>
                                                    <td className="px-4 py-3 text-center">{s.quantity_order}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-green-400">
                                                        {new Intl.NumberFormat("es-CO", {
                                                            style: "currency",
                                                            currency: "COP",
                                                            minimumFractionDigits: 0,
                                                        }).format(s.price_total)}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* Fotos */}
                        {previewImages.length > 0 && (
                            <FotosSection previewImages={previewImages} />
                        )}
                    </motion.div>



                </motion.div>

            </motion.div>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-solid mb-4"></div>
                    <p className="text-white text-lg font-semibold">Cargando información...</p>
                </div>
            )}
        </>
    )
}

export default OrdenView