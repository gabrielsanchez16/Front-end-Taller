import axios, { AxiosError } from "axios";

export const registerPhotos = async (formData: FormData) => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${apiUrl}/photo/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.photo;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al asignar foto"
    );
  }
};
