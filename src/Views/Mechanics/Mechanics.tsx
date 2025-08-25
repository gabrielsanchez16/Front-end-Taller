import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserCog, Trash2, Pencil } from "lucide-react";
import { createMechanics, deleteMechanic, editMechanic, getAllMechanics } from "../../Utils/api";
import type { Mechanic } from "../../Interface/Mechanics";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Loading from "../../Components/Loading/Loading";




const Mechanics = () => {
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Mechanic>();

    const fetchMechanics = async (id: string) => {
        setLoading(true);
        try {
            const responseMechanics = await getAllMechanics(id);
            setMechanics(responseMechanics);
        } catch (error) {
            console.error("Error obteniendo mecánicos:", error);
            toast.error("Hubo un error al obtener los mecánicos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchMechanics(user.id);
        }
    }, []); // Ejecuta una sola vez al montar el componente


    const onSubmit = async (data: Mechanic) => {
        setLoading(true);
        try {
            if (editingId !== null) {
                try {
                    data.id = editingId
                    const response = await editMechanic(data)
                    setMechanics((prev) =>
                        prev.map((m) => (m.id === editingId ? { ...m, name: data.name } : m))
                    );
                    setEditingId(null);
                    toast.success(response)
                    reset();
                    return;
                } catch (error) {

                    console.error("Error editando mecánico:", error);
                    toast.error("Hubo un error al editar el mecánico.");
                    return;
                } 

            }

            const response = await createMechanics(data);
            const newMechanic: Mechanic = {
                id: response.id, // fallback si backend no devuelve ID
                name: response.name,
            };

            setMechanics((prev) => [...prev, newMechanic]);
            toast.success("Mecanico creado exitosamente");
            reset();
        } catch (error) {
            console.error("Error creando mecánico:", error);
            toast.error(error instanceof Error ? error.message : String(error));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        const mechanic = mechanics.find((m) => m.id === id);
        if (mechanic) {
            setValue("name", mechanic.name);
            setEditingId(id);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const response = await deleteMechanic(id);
            setMechanics((prev) => prev.filter((m) => m.id !== id));
            toast.success(response);
        } catch (error) {
            console.error("Error borrando mecánico:", error);
            toast.error(error instanceof Error ? error.message : String(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Módulo Mecánicos
            </h1>
            <p className="text-gray-600 mb-6">
                Gestiona a los mecánicos de tu taller. Podrás crear, editar o borrar.
            </p>

            {/* Formulario */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl shadow p-5 mb-8 flex flex-col sm:flex-row items-center gap-4"
            >
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <UserCog className="text-blue-600" />
                    <input
                        type="text"
                        placeholder="Nombre del mecánico"
                        {...register("name", { required: "El nombre es obligatorio" })}
                        className={`border rounded px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 ring-red-400" : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    <input
                        type="hidden"
                        value={user?.id}
                        {...register("id_workshop")}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
                >
                    {editingId !== null ? "Actualizar" : "Crear"}
                </button>
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
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mechanics?.map((mechanic) => (
                            <tr key={mechanic.id} className="border-t">
                                <td className="px-4 py-3">{mechanic.name}</td>
                                <td className="px-4 py-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(mechanic.id)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mechanic.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {mechanics?.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center px-4 py-5 text-gray-500">
                                    No hay mecánicos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {
                loading && (
                    <Loading />
                )
            }
        </div>
    );
};

export default Mechanics;
