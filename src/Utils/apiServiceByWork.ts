import axios, { AxiosError } from "axios";
import type { ServiceByWork } from "../Interface/ServiceByWork";

export const createServiceByWork = async (data:ServiceByWork) => {
     const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.post(`${apiUrl}/serviceByWorkshop/register`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.service;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al asignar el servicio"
        );
    }
}