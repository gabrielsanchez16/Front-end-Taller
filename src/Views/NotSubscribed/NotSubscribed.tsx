// views/NotSubscribed.tsx
import { useAuth } from "../../hooks/useAuth";

const plans = [
  {
    name: "Plan Beginner 1 mes",
    price: "$30.000",
    description: "Ideal para talleres pequeños que quieren empezar a digitalizarse. Acceso básico a funcionalidades.",
    features: ["Soporte por correo", "Actualizaciones mensuales"],
    popular: false,
  },
  {
    name: "Plan Professional 3 meses",
    price: "$75.000",
    description: "Ideal para para talleres que buscan un equilibrio entre costo y beneficios. Acceso a todas las funcionalidades.",
    features: ["Soporte rápido", "Actualizaciones semanales"],
    popular: true, // este será el destacado
  },
  {
    name: "Plan Legend 6 meses",
    price: "$150.000",
    description: "Todo el acceso sin límites. Para talleres que no eximen en gastos y quieren lo mejor. Leyendas de la mecánica.",
    features: ["Soporte 24/7", "Actualizaciones instantáneas"],
    popular: false,
  },
];

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}

const NotSubscribed = () => {
  const { user } = useAuth();

  const handleWhatsApp = (plan: Plan) => {

    const message = `Hola, soy el taller "${user ? user.name : "desconocido"}". Me registré en el sistema y quiero suscribirme al plan "${plan.name}".`;
    const phoneNumber = "3116036787";
    const url = `https://wa.me/57${phoneNumber}?text=${encodeURIComponent(message)}`;
    localStorage.clear();
    window.open(url, "_blank");
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://formaelx.com/media/images/cursos_cursos/curso_area_163.png')`,
      }}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 z-10 flex flex-col justify-center items-center px-4 py-10 bg-black/70 backdrop-blur-sm"
      />


      <div className="relative z-10 w-full max-w-6xl text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Tu cuenta no está suscrita
        </h1>
        <p className="text-white mb-10 text-base md:text-lg">
          Elige un plan para continuar
        </p>

        {/* Grid responsivo */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl h-full p-6 shadow-lg transition transform hover:scale-105 flex flex-col justify-between ${plan.popular
                ? "bg-white border-4 border-blue-600"
                : "bg-white border border-gray-200"
                }`}
            >
              {plan.popular && (
                <div className="text-xs md:text-sm text-white bg-blue-600 px-3 py-1 rounded-full w-fit mx-auto mb-4">
                  Más popular
                </div>
              )}

              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  {plan.name}
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {plan.price}
                </p>
                <p className="text-gray-600 mt-2 text-sm md:text-base">
                  {plan.description}
                </p>

                <ul className="text-left mt-4 space-y-2 text-gray-700 text-sm md:text-base">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      ✅ <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                onClick={() => handleWhatsApp(plan)}
              >
                Suscribirme
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default NotSubscribed;
