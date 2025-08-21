import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { editWorkshop } from "../../Utils/apiWorkshop";
import toast from "react-hot-toast";
import { LockClosedIcon } from "@heroicons/react/24/outline";

type FormData = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    phone: string;
    logo?: FileList;
};

const Profile = () => {
    const { user, logout } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            phone: user?.phone || "",
        },
    });

    const onSubmit = async (data: FormData) => {
        if (!user) {
            toast.error("Usuario no autenticado");
            return;
        }
        try {
            await editWorkshop(data, user.id);
            toast.success("Perfil actualizado correctamente ✅");
            logout();
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar el perfil ❌");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 relative">
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                        <img
                            src={user?.logo ? user.logo : `https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff&size=100`}
                            alt="avatar"
                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                        />
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 pt-16 pb-8">
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
                        Editar Perfil
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Nombre
                            </label>
                            <input
                                {...register("name", { required: "El nombre es obligatorio" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                type="text"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Correo
                            </label>
                            <input
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Correo no válido",
                                    },
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                type="email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Teléfono
                            </label>
                            <input
                                {...register("phone", {
                                    required: "El teléfono es obligatorio",
                                    minLength: { value: 7, message: "Número no válido" },
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                type="text"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Contraseña
                            </label>
                            <input
                                {...register("password")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                type="password"
                                placeholder="•••••••"
                            />
                            <p className="text-gray-500 text-xs mt-1">
                                Déjalo vacío si no quieres cambiarla
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Contraseña anterior
                            </label>
                            <input
                                    {...register("passwordConfirmation")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                type="password"
                                placeholder="•••••••"
                            />
                            <p className="text-gray-500 text-xs mt-1">
                                Déjalo vacío si no quieres cambiarla
                            </p>
                           
                        </div>

                        <div>
                            <label htmlFor="logo" className="block text-sm font-medium mb-1">
                                Subir logo (opcional)
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="w-5 h-5 text-black absolute left-3 top-2.5" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("logo")}
                                    className="w-full bg-gray-200 pl-10 pr-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
