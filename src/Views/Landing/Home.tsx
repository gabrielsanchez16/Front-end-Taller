import { AnimatePresence, motion } from "framer-motion";
import { Wrench, Users, Clock, Smartphone, Star, Share2, Package, History, Hammer, Cog } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Title, Meta, Link as Link2 } from "react-head";

const Home = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const images = [
        "/ejemplo1.png",
        "/ejemplo2.png",
        "/ejemplo3.png",
        "/ejemplo4.png",
        "/ejemplo5.png",
        "/ejemplo6.png",
        "/ejemplo7.png",
    ];
    const icons = [Wrench, Hammer, Cog];
    const handleWhatsApp = () => {

        const message = `Hola, soy "tu nombre" me interesa agendar una demo para conocer el sistema.`;
        const phoneNumber = "3116036787";
        const url = `https://wa.me/57${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };
    return (
        <>
            {/* SEO */}
            <Title>Sistema de Talleres de Motos</Title>
            <Meta name="description" content="Digitaliza tu taller de motos y controla clientes, trabajos y facturación." />
            <Meta name="keywords" content="taller de motos, software de talleres, gestión de motos, sistema de talleres" />

            {/* Open Graph */}
            <Meta property="og:title" content="Sistema de Gestión de Talleres de Motos" />
            <Meta property="og:description" content="Optimiza tu taller con nuestro software digital." />
            <Meta property="og:image" content="https://www.systemworkshop.shop/logo.png" />
            <Meta property="og:url" content="https://www.systemworkshop.shop/" />

            {/* Favicon o canonical */}
            <Link2 rel="icon" href="https://www.systemworkshop.shop/mecanicoIcon.svg" />
            <Link2 rel="canonical" href="https://www.systemworkshop.shop/" />

            <div className="w-full min-h-screen bg-gray-50 text-gray-800">

                {/* Hero */}
                <section className="bg-gradient-to-r relative from-blue-700 to-indigo-900 text-white py-20 px-6 text-center">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(50)].map((_, i) => {
                            const Icon = icons[i % icons.length]; // rota entre herramientas
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 0, rotate: 0 }}
                                    animate={{
                                        opacity: [0.2, 1, 0.2],
                                        y: [0, -30, 0],
                                        rotate: [0, 15, -15, 0]
                                    }}
                                    transition={{ duration: 6 + (i % 5), repeat: Infinity }}
                                    className="absolute text-white/40"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        fontSize: `${Math.random() * 30 + 15}px`, // tamaños aleatorios
                                    }}
                                >
                                    <Icon className="w-7 h-7" />
                                </motion.div>
                            );
                        })}
                    </div>
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img
                            src="/logo.png"
                            alt="SystemWorkshop Logo"
                            className="w-34 h-34 md:w-42 md:h-42 object-contain drop-shadow-lg"
                        />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4">SystemWorkshop</h1>
                    <p className="text-lg md:text-2xl mb-6 max-w-2xl mx-auto">
                        La plataforma que organiza tu taller mecánico 🚀. Administra clientes, repuestos y órdenes de trabajo fácilmente.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleWhatsApp}
                            className="px-6 py-3 border cursor-pointer font-bold bg-amber-500 border-white rounded-lg hover:bg-white hover:text-blue-700 transition"
                        >
                            Agenda una demo
                        </button>
                        <Link
                            to={"/login"}
                            className="px-6 py-3 font-bold border cursor-pointer bg-green-500 border-white rounded-lg hover:bg-white hover:text-blue-700 transition"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </section>


                {/* Beneficios */}
                <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
                    {[
                        {
                            icon: <Wrench className="w-12 h-12 text-blue-600 mb-4" />,
                            title: "Órdenes rápidas",
                            desc: "Crea y gestiona órdenes de trabajo en segundos.",
                        },
                        {
                            icon: <Users className="w-12 h-12 text-blue-600 mb-4" />,
                            title: "Clientes organizados",
                            desc: "Lleva un registro claro de tus clientes y sus motos.",
                        },
                        {
                            icon: <Clock className="w-12 h-12 text-blue-600 mb-4" />,
                            title: "Ahorra tiempo",
                            desc: "Olvídate del papeleo, todo en la nube, rápido y fácil.",
                        },
                        {
                            icon: <Smartphone className="w-12 h-12 text-blue-600 mb-4" />,
                            title: "100% móvil",
                            desc: "Accede desde tu celular, tablet o computador.",
                        },
                        {
                            icon: <Star className="w-12 h-12 text-blue-600 mb-4" />,
                            title: "Mejora tu servicio",
                            desc: "Ofrece un trato profesional con reportes y recordatorios para tus clientes.",
                        },
                        {
                            icon: <Package className="w-12 h-12 text-blue-600 mb-4" />,
                            title: "Inventario controlado",
                            desc: "Gestiona repuestos y productos con alertas de stock bajo.",
                        },
                        {
                            icon: <History className="w-12 h-12 text-blue-600 mb-4" />,
                            title: "Historial completo",
                            desc: "Consulta todas las reparaciones realizadas en cada vehículo.",
                        },
                        {
                            icon: <Share2 className="w-12 h-12 text-blue-600 mb-4" />,
                            title: "Comparte órdenes",
                            desc: "Genera órdenes y compártelas con tus clientes en tiempo real.",
                        },

                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center"
                        >
                            {item.icon}
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </section>

                {/* Demo/Imágenes */}
                <section
                    id="demo"
                    className="bg-white py-16 px-6 text-center"
                >
                    <h2 className="text-3xl font-bold mb-6">Así se ve tu taller digital</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Visualiza el control de órdenes, clientes y repuestos con una interfaz moderna y simple.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
                        {images.map((src, i) => (
                            <div
                                key={i}
                                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg"
                                onClick={() => setSelectedImage(src)}
                            >
                                <img
                                    src={src}
                                    alt={`ejemplo ${i + 1}`}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                    <span className="text-white font-semibold">Ver detalle</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Final */}
                <section className="bg-gradient-to-r relative from-indigo-900 to-blue-700 text-white py-16 px-6 text-center">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(30)].map((_, i) => {
                            const Icon = icons[i % icons.length]; // rota entre herramientas
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 0, rotate: 0 }}
                                    animate={{
                                        opacity: [0.2, 1, 0.2],
                                        y: [0, -30, 0],
                                        rotate: [0, 15, -15, 0]
                                    }}
                                    transition={{ duration: 6 + (i % 5), repeat: Infinity }}
                                    className="absolute text-white/30"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        fontSize: `${Math.random() * 30 + 15}px`, // tamaños aleatorios
                                    }}
                                >
                                    <Icon className="w-7 h-7" />
                                </motion.div>
                            );
                        })}
                    </div>
                    <h2 className="text-3xl font-bold mb-4">¿Listo para transformar tu taller?</h2>
                    <p className="text-lg mb-6">
                        Únete a los mecánicos que ya gestionan su negocio con SystemWorkshop.
                    </p>
                    <Link
                        to={"/register"}
                        className="px-8 py-4 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
                    >
                        Comenzar ahora
                    </Link>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-6 text-center">
                    <p>© {new Date().getFullYear()} SystemWorkshop. Todos los derechos reservados.</p>
                </footer>
                {/* Modal grande */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.img
                                key={selectedImage}
                                src={selectedImage}
                                alt="Vista ampliada"
                                className="max-h-[90%] max-w-[90%] rounded-2xl shadow-lg"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al dar click en la imagen
                            />

                            {/* Botón cerrar */}
                            <button
                                className="absolute top-6 right-6 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 shadow-lg"
                                onClick={() => setSelectedImage(null)}
                            >
                                ✖
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Home;
