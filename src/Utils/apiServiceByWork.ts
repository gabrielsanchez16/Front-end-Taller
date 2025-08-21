import axios, { AxiosError } from "axios";
import type { ServiceByWork } from "../Interface/ServiceByWork";

export const createServiceByWork = async (data: ServiceByWork) => {
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
        const axiosError = error as AxiosError<{ error?: string }>;
        throw new Error(
            axiosError.response?.data?.error || "Error al asignar el servicio"
        );
    }
}

export const editServiceByWork = async (data: ServiceByWork) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.put(`${apiUrl}/serviceByWorkshop/update`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message;
    } catch (error) {
        const axiosError = error as AxiosError<{ error?: string }>;
        throw new Error(
            axiosError.response?.data?.error|| "Error al editar el servicio"
        );
    }
}

export const deleteServiceByWork = async (id:string) =>{
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.delete(`${apiUrl}/serviceByWorkshop/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al borrar el servicio"
        );
    }
}

export const getServicesByWorkshop = async (id_workshop: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.get(`${apiUrl}/serviceByWorkshop/workshop/${id_workshop}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.services;
    } catch (error) {
        const axiosError = error as AxiosError<{ error?: string }>;
        throw new Error(
            axiosError.response?.data?.error || "Error al obtener los servicios del taller"
        );
    }
}
