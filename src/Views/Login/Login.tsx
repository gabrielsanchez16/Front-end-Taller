import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useForm as useReactHookForm } from "react-hook-form";
import type { LoginForm } from "../../Interface/auth";
import { login as LoginApi } from '../../Utils/api';
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { useState } from "react";



export default function Login() {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useReactHookForm<LoginForm>();
  const {login} = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

 const onSubmit = async (form: LoginForm) => {
  try {
    const data = await LoginApi(form);
    login(data.token);
    navigate("/");
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    } else {
      setError("Error al iniciar sesión");
      setTimeout(() => {
        setError(null);
      }, 3000); // Limpiar el error después de 3 segundos
    }
  }
};


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(/mecanicoBack.png)` }}
      ></div>

      <div className="relative z-10 w-full max-w-md bg-[#111827] shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Correo electrónico</label>
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
                className={`w-full bg-gray-200 pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 ring-red-400" : "border-white focus:ring-blue-500"}`}
                placeholder="ej. mecanico@taller.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Contraseña</label>
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
                className={`w-full bg-gray-200 pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 ring-red-400" : "border-white focus:ring-blue-500"}`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

        <p className="text-center text-sm text-white mt-6">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-400 font-medium hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
