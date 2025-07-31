import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserCog, Trash2, Pencil, Phone, MessageCircle } from "lucide-react";
import { createClients, deleteClient, editClient, getAllClients } from "../../Utils/apiClients";

import { useAuth } from "../../hooks/useAuth";
import type { Client } from "../../Interface/Clients";
import { IdentificationIcon } from "@heroicons/react/24/outline";



const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Client>();

    const fetchClients = async (id: string) => {
        try {
            const responseClients = await getAllClients(id);
            setClients(responseClients);
        } catch (error) {
            console.error("Error obteniendo clientes:", error);
            alert("Hubo un error al obtener los clientes.");
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchClients(user.id);
        }
    }, []); // Ejecuta una sola vez al montar el componente


    const onSubmit = async (data: Client) => {
        try {
            if (editingId !== null) {
                try {
                    data.id = editingId
                    const response = await editClient(data)
                    setClients((prev) =>
                        prev.map((m) => (m.id === editingId ? { ...m, name: data.name, email: data.email, phone: data.phone,identification:data.identification } : m))
                    );
                    setEditingId(null);
                    alert(response)
                    reset();
                    return;
                } catch (error) {

                    console.error("Error editando cliente:", error);
                    alert("Hubo un error al editar el cliente.");
                    return;
                }

            }

            const response = await createClients(data);
            const newMechanic: Client = {
                id: response.id, // fallback si backend no devuelve ID
                name: response.name,
                phone: response.phone,
                email: response.email,
                identification: response.identification,
                id_workshop: response.id_workshop
            };

            setClients((prev) => [...prev, newMechanic]);
            alert("Cliente creado exitosamente")
            reset();
        } catch (error) {
            console.error("Error creando cliente:", error);
            alert("Hubo un error al crear el cliente.");
        }
    };

    const handleEdit = (id: string) => {
        const client = clients.find((m) => m.id === id);
        if (client) {
            setValue("name", client.name);
            setValue("email", client.email);
            setValue("identification", client.identification);
            setValue("phone", client.phone);
            setEditingId(id);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await deleteClient(id);
            setClients((prev) => prev.filter((m) => m.id !== id));
            alert(response)
        } catch (error) {
            console.error("Error borrando cliente:", error);
            alert("Hubo un error al borrar el cliente.");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Módulo Clientes
            </h1>
            <p className="text-gray-600 mb-6">
                Gestiona a los clientes de tu taller. Podrás crear, editar o borrar.
            </p>

            {/* Formulario */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-4 justify-between"
            >
                {/* Nombre */}
                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <UserCog className="text-blue-600 min-w-[24px]" />
                    <input
                        type="text"
                        placeholder="Nombre del cliente"
                        {...register("name", { required: "El nombre es obligatorio" })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.name
                                ? "border-red-500 ring-red-400"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    <input type="hidden" value={user?.id} {...register("id_workshop")} />
                </div>

                {/* Teléfono */}
                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <Phone className="text-blue-600 min-w-[24px]" />
                    <input
                        type="text"
                        placeholder="Teléfono ej: 311 603 6878"
                        {...register("phone", { required: "El teléfono es obligatorio" })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.phone
                                ? "border-red-500 ring-red-400"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                </div>

                {/* Correo */}
                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <MessageCircle className="text-blue-600 min-w-[24px]" />
                    <input
                        type="email"
                        placeholder="ej: user@gmail.com"
                        {...register("email", { required: "El correo es obligatorio" })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.email
                                ? "border-red-500 ring-red-400"
                                : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                </div>

                {/* Identificación */}
                <div className="flex items-center gap-2 w-full sm:w-[48%]">
                    <IdentificationIcon className="text-blue-600 w-[24px] " />
                    <input
                        type="number"
                        placeholder="Identificación ej: 40772132"
                        {...register("identification", {
                            required: "La identificación es obligatoria",
                        })}
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.identification
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
                        {editingId !== null ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </form>


            {/* Mensaje de error */}
            {errors.name && (
                <p className="text-red-600 mb-4 text-sm">{errors.name.message}</p>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Identification</th>
                            <th className="px-4 py-3">Correo</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients?.map((client) => (
                            <tr key={client.id} className="border-t">
                                <td className="px-4 py-3">{client.name}</td>
                                <td className="px-4 py-3">{client.identification}</td>
                                <td className="px-4 py-3">{client.email}</td>
                                <td className="px-4 py-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(client.id)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {clients?.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center px-4 py-5 text-gray-500">
                                    No hay Clientes registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Clients