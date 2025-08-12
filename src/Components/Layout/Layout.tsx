import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
    Menu,
    Home,
    Users,
    Bike,
    Settings,
    Wrench,
    LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { user,logout } = useAuth();
    const navigate = useNavigate();
    const links = [
        { to: "/", label: "Dashboard", icon: <Home size={18} /> },
        // { to: "/ordenes", label: "Órdenes", icon: <ClipboardList size={18} /> },
        { to: "/Clients", label: "Clientes", icon: <Users size={18} /> },
        { to: "/Motorcycles", label: "Motocicletas", icon: <Bike size={18} /> },
        { to: "/Services", label: "Servicios", icon: <Settings size={18} /> },
        { to: "/Mechanics", label: "Mecánicos", icon: <Wrench size={18} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const SidebarContent = ({ onClick }: { onClick?: () => void }) => (
        user && 
        <div className="w-64 bg-[#111827] text-gray-100 h-full p-6 flex flex-col justify-between relative z-10">
            <div>
                <div className="text-l font-bold flex items-center gap-1 text-white mb-6">
                    <div className="rounded-full p-1 w-fit border border-white">
                        <img
                            src={user.logo || "https://img.freepik.com/vector-gratis/circulo-azul-usuario-blanco_78370-4707.jpg?semt=ais_hybrid&w=740"}
                            className="rounded-full w-[50px] h-[50px] bg-white object-contain"
                            alt=""
                        />
                    </div>
                    {user.name}
                </div>
                <nav className="flex flex-col gap-1 text-sm">
                    {links.map((link) => {
                        const active = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={onClick}
                                className={`flex items-center gap-3 p-2 rounded transition-all ${
                                    active
                                        ? "bg-indigo-600 text-white"
                                        : "hover:bg-gray-800 text-gray-300"
                                }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-6 border-t border-gray-700 pt-4">
                <button
                    onClick={() => {
                        onClick?.();
                        handleLogout();
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded text-red-400 hover:bg-gray-800 text-sm"
                >
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </div>
        </div>
        
    );

    return (
        user &&
        <div className="flex h-screen">
            {/* Sidebar móvil */}
            <div
                className={`fixed inset-0 z-50 transition-transform duration-300 lg:hidden ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <SidebarContent onClick={() => setSidebarOpen(false)} />
                <div
                    className="absolute inset-0 bg-black opacity-50"
                    onClick={() => setSidebarOpen(false)}
                />
            </div>

            {/* Sidebar escritorio */}
            <aside className="hidden lg:flex">
                <SidebarContent />
            </aside>

            {/* Contenido */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Topbar */}
                <header className="lg:hidden bg-gray-800 shadow p-4 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(true)} className="text-white">
                        <Menu size={22} />
                    </button>
                    <div className="text-l font-bold flex items-center gap-1 text-white">
                        <div className="rounded-full p-1 w-fit border border-white">
                            <img
                                src={user.logo || "https://img.freepik.com/vector-gratis/circulo-azul-usuario-blanco_78370-4707.jpg?semt=ais_hybrid&w=740"}
                                className="rounded-full w-[30px] h-[30px] bg-white object-contain"
                                alt=""
                            />
                        </div>
                        {user.name}
                    </div>
                </header>

                {/* Contenido principal */}
                <main className="flex-1 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
