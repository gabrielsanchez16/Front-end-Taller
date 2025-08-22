import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import type { Type } from "../../Interface/Type";
import { createService } from "../../Utils/apiServices";
import { getAllTypes } from "../../Utils/apiType";
import type { Service } from '../../Interface/Service';
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Loading from "../Loading/Loading";

const ModalService = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {

    const [types, setTypes] = useState<Type[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null); // 👈 nuevo estado
    const [loading, setLoading] = useState<boolean>(false);


    const { user } = useAuth();

    const defaultValues: Service = {
        id: "",
        name: "",
        price: 0,
        brand: "",
        quantity: 1,
        id_type: "",
        id_workshop: "",
    };

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




    useEffect(() => {
        if (user?.id) {
            fetchTypes()
        }
    }, []); // Ejecuta una sola vez al montar el componente


    const onSubmit = async (data: Service) => {
        setLoading(true);

        try {
            if (editingId) {
                // actualizar
                await createService({ ...data, id: editingId }); // 👈 deberías tener un updateService() real
                toast.success("Servicio actualizado exitosamente");
            } else {
                // crear
                await createService(data);
                toast.success("Servicio creado exitosamente");
            }

            reset(defaultValues);
            setEditingId(null); // salir de edición
            onClose();
        } catch (error) {
            console.error("Error en el servicio:", error);
            toast.error(String(error));
        } finally {
            setLoading(false);

        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            {/* Contenedor */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 animate-fade-in">
                {/* Botón cerrar */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Título */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {editingId ? "Editar Servicio" : "Crear Servicio"}
                </h2>

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nombre del servicio"
                        {...register("name", { required: "El nombre es obligatorio" })}
                        className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors.name
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    <input type="hidden" value={user?.id} {...register("id_workshop")} />

                    <input
                        type="text"
                        placeholder="Marca"
                        {...register("brand", { required: "La marca es obligatoria" })}
                        className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors.brand
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />

                    <input
                        type="number"
                        placeholder="Cantidad"
                        {...register("quantity", { required: "Cantidad requerida" })}
                        className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors.quantity
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />

                    <select
                        {...register("id_type", { required: "El tipo es obligatorio" })}
                        className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors.id_type
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    >
                        <option value="">Selecciona el tipo</option>
                        {types.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Precio"
                        {...register("price", {
                            setValueAs: (v) => Number(String(v).replace(/\D/g, "")),
                        })}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            const numericValue = Number(raw);
                            const formatted = new Intl.NumberFormat("es-CO").format(numericValue);
                            setValue("price", numericValue, { shouldValidate: true });
                            e.target.value = `$ ${formatted}`;
                        }}
                        className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${errors.price
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />

                    {/* Botones */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                reset(defaultValues);
                                setEditingId(null);
                                onClose();
                            }}
                            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                            {editingId ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
            {
                loading && (
                    <Loading />
                )
            }
        </div>
    );
}

export default ModalService