import axios, { AxiosError } from "axios";
import type { WorkOrder } from "../Interface/WorkOrder";

export const createWorkOrder = async (data:WorkOrder) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.post(`${apiUrl}/workOrder/register`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.workOrder;
    } catch (error) {
        const axiosError = error as AxiosError<{ error?: string }>;
        
        throw new Error(
            axiosError.response?.data?.error || "Error al registrar la ordern"
        );
    }
}

export const getOrderById = async (id:string) =>{
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    try {
        const response = await axios.get(`${apiUrl}/workOrder/getById/${id}`, {
            headers: {
                "Content-Type": "application/json"
            },
        });

        return response.data.workOrder;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al obtener orden"
        );
    }
}

export const editOrder = async (data:WorkOrder) =>{
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.put(`${apiUrl}/workOrder/update`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.workOrder;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al actualizar la order"
        );
    }
}


export const deleteOrder = async (id:string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token"); // o donde tengas guardado tu token

    try {
        const response = await axios.delete(`${apiUrl}/workOrder/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.message;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al borrar la orden"
        );
    }
}