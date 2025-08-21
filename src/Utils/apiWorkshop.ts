import axios, { AxiosError } from "axios";
import type { RegisterForm } from "../Interface/auth";


export const editWorkshop = async (data: RegisterForm, id: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token
     const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("phone", data.phone);
  if (typeof data.passwordConfirmation === "string") {
    formData.append("passwordConfirmation", data.passwordConfirmation);
  }

  if (data.logo && data.logo[0]) {
    formData.append("logo", data.logo[0]); // Asegura que sea un File
  }
    

    try {
        const response = await axios.put(`${apiUrl}/workshop/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.workshop;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al editar el taller"
        );
    }
}