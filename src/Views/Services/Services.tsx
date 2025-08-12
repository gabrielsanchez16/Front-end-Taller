import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2, CardSim, ParkingMeter, Type as Type1, Coins } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { Service } from "../../Interface/Service";
import type { Type } from "../../Interface/Type";
import { NumberedListIcon } from "@heroicons/react/24/outline";
import { createService, deleteService, getAllServices } from "../../Utils/apiServices";
import { getAllTypes } from "../../Utils/apiType";

const Services = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [types, setTypes] = useState<Type[]>([]);

    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<Service>();

    const fetchTypes = async () => {
        try {
            const responseTypes = await getAllTypes();
            setTypes(responseTypes);
        } catch (error) {
            console.error("Error obteniendo tipos:", error);
            alert("Hubo un error al obtener los tipos.");
        }
    };


    const fetchServices = async (id: string) => {
        try {
            const responseServices = await getAllServices(id);
            setServices(responseServices);
        } catch (error) {
            console.error("Error obteniendo Servicios:", error);
            alert("Hubo un error al obtener los Servicios.");
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchServices(user.id);
            fetchTypes()
        }
    }, []); // Ejecuta una sola vez al montar el componente


    const onSubmit = async (data: Service) => {
        try {
            await createService(data);
            if (user?.id) {
                await fetchServices(user?.id);
            }
            alert("Servicio creada exitosamente")
            reset();
        } catch (error) {
            console.error("Error creando el Servicio:", error);
            alert(error);
        }
    };


    const handleDelete = async (id: string) => {
        try {
            const response = await deleteService(id);
            setServices((prev) => prev.filter((m) => m.id !== id));
            alert(response)
        } catch (error) {
            console.error("Error borrando el servicio:", error);
            alert("Hubo un error al borrar el servicio.");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Módulo Servicios
            </h1>
            <p className="text-gray-600 mb-6">
                Gestiona los servicios que ofreces en el taller como mano de obra o repuestos. Podrás crea o borra.
            </p>


            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-4 justify-between"
            >
                {/* Nombre */}
                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <ParkingMeter className="text-blue-600 min-w-[24px]" />
                    <input
                        type="text"
                        placeholder="Nombre del servicio"
                        {...register("name", { required: "El nombre del servicio es obligatorio" })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.name
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />

                    <input type="hidden" value={user?.id} {...register("id_workshop")} />
                </div>


                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <CardSim className="text-blue-600 min-w-[24px]" />
                    <input
                        type="text"
                        placeholder="Marca del servicio"
                        {...register("brand", { required: "La marca es obligatoria" })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.brand
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                </div>


                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <NumberedListIcon className="text-blue-600 min-w-[24px] w-5" />
                    <input
                        type="number"
                        placeholder="Cantidades del servicio"
                        {...register("quantity", { required: "cantidad requerida" })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.quantity
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <Type1 className="text-blue-600 w-[24px] " />
                    <select
                        {
                        ...register("id_type", {
                            required: "El tipo es obligatorio",
                        })
                        }
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.id_type
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    >
                        <option value="">Selecciona el tipo de servicio</option>
                        {
                            types?.map((type, key) => (
                                <option value={type.id} key={key}>{type.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <Coins className="text-blue-600 w-[24px] " />
                    <input
                        type="text"
                        placeholder="El precio del servicio"
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            const numericValue = Number(raw);
                            const formatted = new Intl.NumberFormat("es-CO").format(numericValue);
                            setValue("price", numericValue); // <-- ahora sí es number
                            e.target.value = `$ ${formatted}`; // valor con formato
                        }}
                        onBlur={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            const formatted = new Intl.NumberFormat("es-CO").format(Number(raw));
                            e.target.value = `$ ${formatted}`;
                        }}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.price
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />

                </div>
                {/* Botón */}
                <div className="w-full flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
                    >
                        Crear
                    </button>
                </div>
            </form>



            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Marca</th>
                            <th className="px-4 py-3">Cantidad</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services?.map((service) => (
                            <tr key={service.id} className="border-t">
                                <td className="px-4 py-3">{service.name}</td>
                                <td className="px-4 py-3">
                                    {new Intl.NumberFormat("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                        minimumFractionDigits: 0,
                                    }).format(service.price)}
                                </td>
                                <td className="px-4 py-3">{service.brand}</td>
                                <td className="px-4 py-3">{service.quantity}</td>
                                <td className="px-4 py-3 flex justify-center gap-4">

                                    <div className="relative group">
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="text-red-600 cursor-pointer hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                            Eliminar servicio
                                        </div>
                                    </div>
                                </td>

                            </tr>
                        ))}
                        {services?.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center px-4 py-5 text-gray-500">
                                    No hay servicios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Services