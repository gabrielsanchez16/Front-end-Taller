import axios, { AxiosError } from "axios";
import type { Motorcycle } from "../Interface/Motorcycles"

export const createMotorcycle = async (data: Motorcycle) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.post(`${apiUrl}/motorcycle/register`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.motorcycle;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al registrar motocicleta"
        );
    }
}

export const getAllMotorcycles = async (id: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.get(`${apiUrl}/motorcycle/all/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.motorcycles;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al obtener motocicletas"
        );
    }


}

export const deleteMotorcycle = async (id: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    try {
        const response = await axios.delete(`${apiUrl}/motorcycle/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al borrar una motocicleta"
        );
    }
}

export const editMotorcycle = async (data: Motorcycle) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.put(`${apiUrl}/motorcycle/${data.id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al editar motocicleta"
        );
    }
}

export const getById = async (id: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.get(`${apiUrl}/motorcycle/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.motorcycle;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al obtener motocicleta"
        );
    }
}