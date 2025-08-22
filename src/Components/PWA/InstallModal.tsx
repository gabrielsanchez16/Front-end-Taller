import { useEffect, useState } from "react";

// Type definition for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
    console.log("👉 Evento beforeinstallprompt disparado");
      e.preventDefault(); // Evita que salga el prompt por defecto
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowModal(true); // mostramos el modal
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // lanza el diálogo nativo de instalación
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Usuario eligió:", outcome);

    setDeferredPrompt(null);
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
            <h2 className="text-xl font-bold mb-4">📲 Instalar aplicación</h2>
            <p className="mb-4">¿Quieres instalar esta app en tu dispositivo?</p>
            <div className="flex justify-around">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Ahora no
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={handleInstall}
              >
                Instalar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPrompt;
