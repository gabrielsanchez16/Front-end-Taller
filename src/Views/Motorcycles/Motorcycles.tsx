import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2, Pencil, Bike, CardSim, Calendar, PersonStandingIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { Motorcycle } from "../../Interface/Motorcycles";
import { createMotorcycle, deleteMotorcycle, editMotorcycle, getAllMotorcycles } from "../../Utils/apiMotorcycles";
import { HomeIcon } from "@heroicons/react/16/solid";
import { getAllClients } from "../../Utils/apiClients";
import type { Client } from "../../Interface/Clients";
import type { Brand } from "../../Interface/Brands";
import { getAllBrand } from "../../Utils/apiBrand";
import { Link } from "react-router";
import type { WorkOrder } from '../../Interface/WorkOrder';


const Motorcycles = () => {
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Motorcycle>();

    const fetchClients = async (id: string) => {
        try {
            const responseClients = await getAllClients(id);
            setClients(responseClients);
        } catch (error) {
            console.error("Error obteniendo clientes:", error);
            alert("Hubo un error al obtener los clientes.");
        }
    };

    const fetchBrands = async () => {
        try {
            const responseBrands = await getAllBrand();
            setBrands(responseBrands);
        } catch (error) {
            console.error("Error obteniendo marcas:", error);
            alert("Hubo un error al obtener las marcas.");
        }
    };

    const fetchMotorcycles = async (id: string) => {
        try {
            const responseMotorcycles = await getAllMotorcycles(id);
            setMotorcycles(responseMotorcycles);
        } catch (error) {
            console.error("Error obteniendo motocicletas:", error);
            alert("Hubo un error al obtener los motocicletas.");
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchMotorcycles(user.id);
            fetchClients(user.id)
            fetchBrands()
        }
    }, []); // Ejecuta una sola vez al montar el componente


    const onSubmit = async (data: Motorcycle) => {
        try {
            if (editingId !== null) {
                try {
                    data.id = editingId
                    const response = await editMotorcycle(data)

                    setEditingId(null);
                    if (user?.id) {
                        await fetchMotorcycles(user?.id);
                    }
                    alert(response)
                    reset();
                    return;
                } catch (error) {

                    console.error("Error editando la motocicleta:", error);
                    alert("Hubo un error al editar la motocicleta.");
                    return;
                }

            }

            await createMotorcycle(data);
            if (user?.id) {
                await fetchMotorcycles(user?.id);
            }
            alert("Motocicleta creada exitosamente")
            reset();
        } catch (error) {
            console.error("Error creando la motocicleta:", error);
            alert(error);
        }
    };

    const handleEdit = (id: string) => {
        const motorcycle = motorcycles.find((m) => m.id === id);
        if (motorcycle) {
            setValue("model", motorcycle.model);
            setValue("year", motorcycle.year);
            setValue("plate", motorcycle.plate);
            setValue("id_owner", motorcycle.id_owner);
            setValue("id_brand", motorcycle.id_brand);
            setEditingId(id);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await deleteMotorcycle(id);
            setMotorcycles((prev) => prev.filter((m) => m.id !== id));
            alert(response)
        } catch (error) {
            console.error("Error borrando la motorcicleta:", error);
            alert("Hubo un error al borrar la motocicleta.");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Módulo Motos
            </h1>
            <p className="text-gray-600 mb-6">
                Gestiona las motos que llegan a tu taller. Podrás crear, editar o borrar.
            </p>


            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-4 justify-between"
            >
                {/* Nombre */}
                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <Bike className="text-blue-600 min-w-[24px]" />
                    <input
                        type="text"
                        placeholder="Modelo de la moto"
                        {...register("model", { required: "El modelo es obligatorio" })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.model
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
                        placeholder="Placa ej: TGJ23Q"
                        {...register("plate", { required: "La placa es obligatoria" })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.plate
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                </div>


                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <Calendar className="text-blue-600 min-w-[24px]" />
                    <input
                        type="date"
                        placeholder="31-04-2012"
                        {...register("year", { required: "Año de la moto es requerido" })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.year
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <HomeIcon className="text-blue-600 w-[24px] " />
                    <select
                        {
                        ...register("id_brand", {
                            required: "La marca es obligatoria",
                        })
                        }
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.id_brand
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    >
                        <option value="">La marca es obligatoria</option>
                        {
                            brands?.map((brand, key) => (
                                <option value={brand.id} key={key}>{brand.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <PersonStandingIcon className="text-blue-600 w-[24px] " />
                    <select
                        {
                        ...register("id_owner", {
                            required: "El cliente es obligatorio",
                        })
                        }
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.id_owner
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    >
                        <option value="">El cliente es obligatorio</option>
                        {
                            clients?.map((client, key) => (
                                <option value={client.id} key={key}>{client.name}</option>
                            ))
                        }
                    </select>
                </div>
                {/* Botón */}
                <div className="w-full flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
                    >
                        {editingId !== null ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </form>



            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="px-4 py-3">Model</th>
                            <th className="px-4 py-3">Plate</th>
                            <th className="px-4 py-3">Year</th>
                            <th className="px-4 py-3">Dueño</th>
                            <th className="px-4 py-3">Marca</th>
                            <th className="px-4 py-3">Ordenes</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {motorcycles?.map((motorcycle) => (
                            <tr key={motorcycle.id} className="border-t">
                                <td className="px-4 py-3">{motorcycle.model}</td>
                                <td className="px-4 py-3">{motorcycle.plate}</td>
                                <td className="px-4 py-3">{new Date(motorcycle.year).toDateString()}</td>
                                <td className="px-4 py-3">{motorcycle.owner?.name}</td>
                                <td className="px-4 py-3">{motorcycle.brand?.name}</td>
                                <td className="px-4 py-3">
                                    <div className="relative h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                        <div className="flex flex-col gap-1">
                                            {Array.isArray(motorcycle?.work_orders) && motorcycle.work_orders.length > 0 ? 
                                                motorcycle.work_orders.map((workOrder: WorkOrder, key: number) => (
                                                <Link
                                                    key={key}
                                                    to={`/Order?id=${workOrder.id}`}
                                                    className="text-blue-600 underline"
                                                >
                                                    {workOrder.title}
                                                </Link>
                                            ))
                                        : ( <span className="text-gray-500 italic">No tiene órdenes</span> )}
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                                    </div>
                                </td>

                                <td className="px-4 py-3 flex justify-center gap-4">
                                    <div className="relative group">
                                        <button
                                            onClick={() => handleEdit(motorcycle.id)}
                                            className="text-blue-600 cursor-pointer hover:text-blue-800"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                            Editar motocicleta
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <button
                                            onClick={() => handleDelete(motorcycle.id)}
                                            className="text-red-600 cursor-pointer hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                            Eliminar motocicleta
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <Link
                                            to={`/Order/create?id=${motorcycle.id}`}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <Calendar size={18} />
                                        </Link>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                                            Crear orden
                                        </div>
                                    </div>
                                </td>

                            </tr>
                        ))}
                        {motorcycles?.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center px-4 py-5 text-gray-500">
                                    No hay motocicletas registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Motorcycles