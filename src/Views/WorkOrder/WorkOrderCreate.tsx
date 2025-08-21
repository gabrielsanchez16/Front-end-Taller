import { useForm } from "react-hook-form";
import type { WorkOrder } from "../../Interface/WorkOrder";
import { useLocation, useNavigate } from "react-router";
import { getById } from "../../Utils/apiMotorcycles";
import { useEffect, useState } from "react";
import type { Motorcycle } from '../../Interface/Motorcycles';
import { getAllMechanics } from "../../Utils/api";
import { useAuth } from "../../hooks/useAuth";
import type { Mechanic } from "../../Interface/Mechanics";
import { getAllServices } from "../../Utils/apiServices";
import type { Service } from "../../Interface/Service";
import { createWorkOrder } from "../../Utils/apiWorkOrder";
import { createServiceByWork } from "../../Utils/apiServiceByWork";
import { registerPhotos } from "../../Utils/apiPhoto";
import { toast } from "react-hot-toast";
import ModalService from "../../Components/ModalService/ModalService";

const WorkOrderCreate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [modalService, setModalService] = useState(false);
    const searchParams = new URLSearchParams(location.search);
    const [selectedServices, setSelectedServices] = useState<
        (Service & { quantity: number })[]
    >([]);
    const id_motorcycle = searchParams.get('id');
    const { user } = useAuth();

    const [motorcycle, setMotorcycle] = useState<Motorcycle>()
    const [mechanics, setMechanics] = useState<Mechanic[]>([])
    const [services, setServices] = useState<Service[]>([])
    const totalGeneral = selectedServices.reduce(
        (sum, s) => sum + s.price * s.quantity,
        0
    );
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<WorkOrder>();


    useEffect(() => {
        setValue("price", totalGeneral);
    }, [totalGeneral, setValue]);

    const handleSelectService = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (!selectedId) return;

        const selectedService = services.find((s) => s.id === selectedId);
        if (!selectedService) return;

        if (selectedService.quantity <= 0) {
            toast.error(`El servicio ${selectedService.name} no tiene stock disponible`);
            e.target.value = "";
            return;
        }

        if (!selectedServices.some((s) => s.id === selectedService.id)) {
            setSelectedServices((prev) => [
                ...prev,
                { ...selectedService, quantity: 1 },
            ]);
        }

        e.target.value = "";
    };



    const handleQuantityChange = (id: string, qty: number) => {
        setSelectedServices((prev) =>
            prev.map((s) => {
                if (s.id === id) {
                    // Buscar stock en services
                    const serviceStock = services.find((serv) => serv.id === id)?.quantity || 0;

                    if (qty > serviceStock) {
                        toast.error(`El servicio ${s.name} solo tiene ${serviceStock} en stock`);
                        return { ...s, quantity: serviceStock }; // limitar al stock
                    }

                    return { ...s, quantity: qty > 0 ? qty : 1 };
                }
                return s;
            })
        );
    };


    const handleRemoveService = (id: string) => {
        setSelectedServices((prev) => prev.filter((s) => s.id !== id));
    };



    const fetchMotorcycle = async (id: string) => {
        const responseMotorcycle = await getById(id)
        setMotorcycle(responseMotorcycle)
    }

    const fetchMechanics = async (id: string) => {
        const responseMechanics = await getAllMechanics(id);
        setMechanics(responseMechanics)
    }

    const fetchServices = async (id: string) => {
        try {
            const responseServices = await getAllServices(id);
            setServices(responseServices);
        } catch (error) {
            console.error("Error obteniendo Servicios:", error);
            alert("Hubo un error al obtener los Servicios.");
        }
    };

    useEffect(() => {
        if (id_motorcycle && user?.id) {
            fetchMotorcycle(id_motorcycle)
            fetchMechanics(user?.id)
            fetchServices(user?.id)
        }
    }, [])



    const onSubmit = async (data: WorkOrder) => {
        setLoading(true); // Mostrar loading
        try {

            const response = await createWorkOrder(data);
            if (response.id) {
                // Crear servicios asociados
                if (selectedServices.length > 0) {
                    for (const ser of selectedServices) {
                        await createServiceByWork({
                            name_service: ser.name,
                            id_order: response.id,
                            id_service: ser.id,
                            price_total: ser.price * ser.quantity,
                            price_unit: ser.price,
                            quantity_order: ser.quantity,
                            id_workshop: user?.id ?? ""
                        });
                    }

                    toast.success("Servicios asignados correctamente");
                }

                // Subir fotos
                if (imageFiles.length > 0) {
                    for (let index = 0; index < imageFiles.length; index++) {
                        const formData = new FormData();
                        formData.append("id_order", response.id);
                        formData.append("photo", imageFiles[index]); // aquí sí va el File real

                        await registerPhotos(formData);
                    }
                    toast.success("Imágenes subidas exitosamente");
                }
            }

            toast.success("Orden creada exitosamente");
            setTimeout(() => {
                navigate("/Motorcycles")
            }, 3000);
            reset();
        } catch (error) {
            console.error("Error creando el servicio:", error);
            toast.error("Error creando el servicio");

        } finally {
            setLoading(false); // Ocultar loading siempre
        }
    };




    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);

        setImageFiles(prev => [...prev, ...files]); // guardamos los archivos reales
        setPreviewImages(prev => [
            ...prev,
            ...files.map(file => URL.createObjectURL(file)), // guardamos URLs para preview
        ]);
    };

    const handleModal = () => {
        setModalService(!modalService)
        if (modalService && user?.id) {
            fetchServices(user.id)
        }

    }


    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Crea Orden: {motorcycle?.model + " " + motorcycle?.brand?.name}
            </h1>
            <p className="text-gray-600 mb-6">
                Crea una orden de la moto escogida, anexale servicios, mecanico, recomendaciones... tambien podras adjuntarle fotos del proceso
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
                {/* Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input type="hidden" value={id_motorcycle ?? ""} {...register("id_motorcycle")} />
                    <input
                        type="text"
                        {...register("title", { required: "El título es requerido" })}
                        className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.title ? "border-red-500 ring-red-400" : "border-gray-300 focus:ring-blue-500"
                            }`}
                        placeholder="Título de la orden"
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        {...register("description", { required: "Descripcion es requerida" })}
                        rows={3}
                        className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.description ? "border-red-500 ring-red-400" : "border-gray-300 focus:ring-blue-500"
                            }`}
                        placeholder="Descripción del trabajo"
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                </div>

                {/* Recomendaciones */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Recomendaciones</label>
                    <textarea
                        {...register("recommendations", { required: "Recomendaciones son requeridas" })}
                        rows={3}
                        className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.recommendations ? "border-red-500 ring-red-400" : "border-gray-300 focus:ring-blue-500"
                            }`}
                        placeholder="Recomendaciones para el cliente"
                    />
                    {errors.recommendations && <p className="text-sm text-red-500 mt-1">{errors.recommendations.message}</p>}
                </div>

                {/* Precio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio Total</label>
                    <input
                        type="hidden"
                        {...register("price", {
                            value: totalGeneral ?? 0, // aseguramos que nunca sea undefined
                            validate: (value) =>
                                Number(value) !== 0 || "El precio no puede ser 0",
                        })}
                    />

                    <input
                        type="text"
                        value={new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                        }).format(totalGeneral)}
                        readOnly
                        className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
                    />
                    {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                </div>


                {/* Fecha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                    <input
                        type="date"
                        {...register("date", { required: "Fecha requerida" })}
                        className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.date ? "border-red-500 ring-red-400" : "border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mecanicos</label>
                    <select
                        {
                        ...register("id_mechanic", {
                            required: "El mecanico es obligatorio",
                        })
                        }
                        className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${errors.id_mechanic
                            ? "border-red-500 ring-red-400"
                            : "border-gray-300 focus:ring-blue-500"
                            }`}
                    >
                        <option value="">Selecciona el mecanico</option>
                        {
                            mechanics?.map((mechanic, key) => (
                                <option value={mechanic.id} key={key}>{mechanic.name}</option>
                            ))
                        }
                    </select>
                    {errors.id_mechanic && <p className="text-sm text-red-500 mt-1">{errors.id_mechanic.message}</p>}
                </div>

                <div>
                    <label onClick={handleModal} className="block text-lg font-medium cursor-pointer text-blue-600 underline w-fit">Crear servicio</label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Servicios</label>
                    <select
                        onChange={handleSelectService}
                        className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
                    >
                        <option value="">Selecciona los servicios</option>
                        {services?.map((service) => (
                            <option value={service.id} key={service.id}>
                                {service.name} -{" "}
                                {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 0,
                                }).format(service.price)}
                            </option>
                        ))}
                    </select>

                    {selectedServices.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Servicios seleccionados</h3>

                            {/* Contenedor scroll horizontal para móviles */}
                            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
                                <table className="min-w-[600px] w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-100 text-left">
                                            <th className="p-2">Servicio</th>
                                            <th className="p-2">Precio Unitario</th>
                                            <th className="p-2">Cantidad</th>
                                            <th className="p-2">Total</th>
                                            <th className="p-2">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedServices.map((s) => (
                                            <tr key={s.id} className="hover:bg-gray-50">
                                                <td className="p-2">{s.name}</td>
                                                <td className="p-2">
                                                    {new Intl.NumberFormat("es-CO", {
                                                        style: "currency",
                                                        currency: "COP",
                                                        minimumFractionDigits: 0,
                                                    }).format(s.price)}
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        value={s.quantity}
                                                        min={1}
                                                        className="w-16 rounded border text-center px-1 py-0.5"
                                                        onChange={(e) =>
                                                            handleQuantityChange(s.id, parseInt(e.target.value))
                                                        }
                                                    />
                                                </td>
                                                <td className="p-2 font-medium">
                                                    {new Intl.NumberFormat("es-CO", {
                                                        style: "currency",
                                                        currency: "COP",
                                                        minimumFractionDigits: 0,
                                                    }).format(s.price * s.quantity)}
                                                </td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => handleRemoveService(s.id)}
                                                        className="text-red-500 hover:underline"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-100 font-semibold">
                                            <td colSpan={3} className="p-2 text-right">
                                                Total General:
                                            </td>
                                            <td className="p-2">
                                                {new Intl.NumberFormat("es-CO", {
                                                    style: "currency",
                                                    currency: "COP",
                                                    minimumFractionDigits: 0,
                                                }).format(totalGeneral)}
                                            </td>
                                            <td className="p-2"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Fotos de servicio
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full bg-gray-200 pl-10 pr-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {previewImages.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {previewImages.map((src, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={src}
                                        alt={`preview-${idx}`}
                                        className="w-full h-32 object-cover rounded border"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Botón enviar */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Guardar Orden
                    </button>
                </div>
            </form>

            <ModalService
                isOpen={modalService}
                onClose={handleModal}
            />

            {loading && (
                <div className="fixed inset-0 bg-black opacity-85 flex flex-col items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
                    <p className="text-white text-lg font-semibold">
                        Creando orden, por favor espera...
                    </p>
                </div>
            )}
        </div>
    )
}

export default WorkOrderCreate