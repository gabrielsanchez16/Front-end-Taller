// utils/api.ts
import axios, { AxiosError } from "axios";
import type { LoginForm, RegisterForm } from '../Interface/auth';

export const login = async (data: LoginForm) => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await axios.post(`${apiUrl}/workshop/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    throw new Error(
      axiosError.response?.data?.message || "Error al iniciar sesión"
    );
  }
};


export const register = async (data: RegisterForm) => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("phone", data.phone);

  if (data.logo && data.logo[0]) {
    formData.append("logo", data.logo[0]); // Asegura que sea un File
  }

  try {
    const response = await axios.post(`${apiUrl}/workshop/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al registrar usuario"
    );
  }
};



