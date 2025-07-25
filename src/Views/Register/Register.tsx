import { useState } from "react";
import { LockClosedIcon, EnvelopeIcon, UserIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useForm as useReactHookForm } from "react-hook-form";
import { register as RegisterApi } from '../../Utils/api';
import type { RegisterForm } from "../../Interface/auth";
import { useNavigate } from "react-router";


export default function Register() {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useReactHookForm<RegisterForm>();

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (form: RegisterForm) => {
    try {
      await RegisterApi(form);
      setSuccess("Registro exitoso. Redirigiendo a inicio de sesión...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        setError("Error al registrar taller");
        setTimeout(() => {
          setError(null);
        }, 3000); // Limpiar el error después de 3 segundos
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Imagen de fondo con desenfoque suave */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://formaelx.com/media/images/cursos_cursos/curso_area_163.png')`,
        }}
      ></div>

      {/* Formulario */}
      <div className="relative z-10 w-full max-w-md bg-[#111827] shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Crear Cuenta
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              Nombre del taller
            </label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-black absolute left-3 top-2.5" />
              <input
                type="text"
                {
                ...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                })
                }
                className="w-full bg-gray-200 pl-10 pr-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ej. Juan Pérez"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
              Telefono
            </label>
            <div className="relative">
              <PhoneIcon className="w-5 h-5 text-black absolute left-3 top-2.5" />
              <input
                type="text"
                {
                ...register("phone", {
                  required: "El teléfono es obligatorio",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "El teléfono debe tener 10 dígitos",
                  },
                })
                }
                className="w-full bg-gray-200 pl-10 pr-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ej. 3116036789"
              />
            </div>
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>


          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-black absolute left-3 top-2.5" />
              <input
                type="email"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo no válido"
                  }
                })}
                className="w-full bg-gray-200 pl-10 pr-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ej. mecanico@taller.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Contraseña
            </label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-black absolute left-3 top-2.5" />
              <input
                type="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres"
                  }
                })}
                className="w-full bg-gray-200 pl-10 pr-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-white mb-1">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

        {success && (
          <p className="text-green-400 text-sm mt-4 text-center">{success}</p>
        )}

        <p className="text-center text-sm text-white mt-6">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-400 font-medium hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
