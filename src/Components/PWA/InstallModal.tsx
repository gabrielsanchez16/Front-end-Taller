import { useEffect, useState } from "react";

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

      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;

      // 🔥 Guardar globalmente para no perderlo
      (window as any).deferredPWAInstall = evt;

      setDeferredPrompt(evt);
      setShowModal(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 🔥 Revisar si ya estaba guardado de antes
    if ((window as any).deferredPWAInstall) {
  
      setDeferredPrompt((window as any).deferredPWAInstall);
      setShowModal(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
     await deferredPrompt.userChoice;
    

    setDeferredPrompt(null);
    (window as any).deferredPWAInstall = null;
    setShowModal(false);
  };


  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
            <h2 className="text-xl font-bold mb-4">📲 Instalar aplicación</h2>
            <p className="mb-4">¿Quieres instalar esta app en tu dispositivo?</p>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 px-4 py-2 cursor-pointer rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Ahora no
              </button>
              <button
                className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg"
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
