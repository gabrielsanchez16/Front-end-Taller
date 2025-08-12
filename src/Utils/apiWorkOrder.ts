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
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
            axiosError.response?.data?.message || "Error al registrar la ordern"
        );
    }
}