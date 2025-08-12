import axios, { AxiosError } from "axios";

export const getAllBrand = async () =>{
 const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token"); // o donde tengas guardado tu token

  try {
    const response = await axios.get(`${apiUrl}/brand`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.brands;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al obtener marcas"
    );
  }


}