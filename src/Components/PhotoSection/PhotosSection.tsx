import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FotosSection = ({ previewImages }: { previewImages: string[] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Evidencia fotográfica
      </h2>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {previewImages.map((src, idx) => (
          <motion.div
            key={idx}
            className="min-w-[140px] cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(src)}
          >
            <img
              src={src}
              alt={`foto-${idx}`}
              className="rounded-xl h-28 w-full object-cover shadow-md"
            />
          </motion.div>
        ))}
      </div>

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
    </section>
  );
};

export default FotosSection;
