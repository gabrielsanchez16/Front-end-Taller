import axios, { AxiosError } from "axios";
import type { Client } from "../Interface/Clients";

export const createClients = async (data: Client) => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token"); // o donde tengas guardado tu token

  try {
    const response = await axios.post(`${apiUrl}/owner/register`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.owner;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al registrar cliente"
    );
  }
}

export const getAllClients = async (id:string) =>{
 const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token"); // o donde tengas guardado tu token

  try {
    const response = await axios.get(`${apiUrl}/owner/all/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.Owners;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al obtener clientes"
    );
  }


}

export const deleteClient = async (id: string) => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(`${apiUrl}/owner/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.message;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al borrar mecánico"
    );
  }
}

export const editClient = async (data: Client) => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token"); // o donde tengas guardado tu token

  try {
    const response = await axios.put(`${apiUrl}/owner/${data.id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.message;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al registrar mecánico"
    );
  }
}
