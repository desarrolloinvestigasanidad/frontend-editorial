"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditionCard } from "../../../components/EditionCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getEditionState(edition: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const openDate = new Date(edition.openDate);
  openDate.setHours(0, 0, 0, 0);
  const deadline = new Date(edition.deadlineChapters);
  deadline.setHours(0, 0, 0, 0);
  const publishDate = edition.publishDate
    ? new Date(edition.publishDate)
    : null;
  if (publishDate) publishDate.setHours(0, 0, 0, 0);

  if (publishDate && publishDate <= today) return "publicada";
  if (openDate <= today && today <= deadline) return "abierta";
  if (today > deadline && (!publishDate || today < publishDate))
    return "cerrada";
  if (today < openDate) return "futura";
  return "desconocido";
}

export default function EditionsPage() {
  const [openEditions, setOpenEditions] = useState<any[]>([]);
  const [pastEditions, setPastEditions] = useState<any[]>([]);
  const [futureEditions, setFutureEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOpenIndex, setCurrentOpenIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const allEditions = Array.isArray(data) ? data : [];

        const open: any[] = [];
        const past: any[] = [];
        const future: any[] = [];

        allEditions.forEach((edition) => {
          const state = getEditionState(edition);
          if (state === "abierta") open.push(edition);
          else if (state === "publicada" || state === "cerrada")
            past.push(edition);
          else if (state === "futura") future.push(edition);
        });

        open.sort(
          (a, b) =>
            new Date(a.openDate).getTime() - new Date(b.openDate).getTime()
        );
        past
          .sort(
            (a, b) =>
              new Date(a.publishDate || a.deadlineChapters).getTime() -
              new Date(b.publishDate || b.deadlineChapters).getTime()
          )
          .reverse();
        future.sort(
          (a, b) =>
            new Date(a.openDate).getTime() - new Date(b.openDate).getTime()
        );

        setOpenEditions(open);
        setPastEditions(past);
        setFutureEditions(future);
        setCurrentOpenIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching editions:", err);
        setOpenEditions([]);
        setPastEditions([]);
        setFutureEditions([]);
        setLoading(false);
      });
  }, []);

  const handlePrevOpen = () => {
    setCurrentOpenIndex((prev) =>
      prev === 0 ? Math.max(0, openEditions.length - 1) : prev - 1
    );
  };

  const handleNextOpen = () => {
    setCurrentOpenIndex((prev) =>
      prev === openEditions.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen text-xl font-semibold'>
        Cargando ediciones...
      </div>
    );
  }

  const currentActiveEdition =
    openEditions.length > 0 ? openEditions[currentOpenIndex] : null;

  return (
    <div className='flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 via-slate-100 to-stone-200 p-3 md:p-4 gap-3 md:gap-4 items-start'>
      {/* Columna Izquierda: Ediciones Pasadas */}
      <aside className='lg:w-1/4 xl:w-1/5 space-y-3 order-2 lg:order-1 flex flex-col bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-3'>
        <h2 className='text-lg md:text-xl font-semibold text-gray-700 sticky top-2 bg-white/80 backdrop-blur-sm py-2 z-10 rounded-md px-2'>
          Ediciones Pasadas
        </h2>
        {pastEditions.length > 0 ? (
          <div className='overflow-y-auto space-y-3 pr-2 max-h-[80vh] custom-scrollbar'>
            {pastEditions.map((edition, idx) => (
              <EditionCard
                key={edition.id}
                edition={edition}
                displayType='standard'
                index={idx}
              />
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-sm p-4 text-center'>
            No hay ediciones pasadas.
          </p>
        )}
      </aside>

      {/* Columna Central: Ediciones Abiertas */}
      <main className='lg:w-1/2 xl:w-3/5 space-y-4 order-1 lg:order-2 flex flex-col items-center justify-start'>
        {currentActiveEdition ? (
          <div className='w-full max-w-xl xl:max-w-2xl flex flex-col items-center'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentActiveEdition.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{
                  duration: 0.35,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
                className='w-full'>
                <EditionCard
                  edition={currentActiveEdition}
                  displayType='prominent'
                />
              </motion.div>
            </AnimatePresence>

            {openEditions.length > 1 && (
              <div className='flex flex-col items-center mt-4 md:mt-6 w-full'>
                <div className='flex items-center justify-center space-x-3 md:space-x-4'>
                  <Button
                    onClick={handlePrevOpen}
                    variant='outline'
                    className='shadow-md bg-white/80 hover:bg-white'>
                    <ChevronLeft className='h-5 w-5' />{" "}
                    <span className='sr-only'>Anterior</span>
                  </Button>
                  <span className='text-sm text-gray-700 font-medium bg-white/70 px-3 py-1 rounded-md shadow'>
                    {currentOpenIndex + 1} de {openEditions.length}
                  </span>
                  <Button
                    onClick={handleNextOpen}
                    variant='outline'
                    className='shadow-md bg-white/80 hover:bg-white'>
                    <ChevronRight className='h-5 w-5' />{" "}
                    <span className='sr-only'>Siguiente</span>
                  </Button>
                </div>
                <div className='flex justify-center space-x-2 mt-3 md:mt-4'>
                  {openEditions.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      onClick={() => setCurrentOpenIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out focus:outline-none ring-1 ring-offset-1 ring-transparent ${
                        currentOpenIndex === index
                          ? "bg-purple-600 scale-125 ring-purple-400"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Ir a edición ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='text-center p-8 md:p-10 bg-white/80 backdrop-blur-md rounded-xl shadow-xl max-w-md'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}>
              <h2 className='text-2xl font-semibold text-purple-700 mb-3'>
                ¡Bienvenido/a!
              </h2>
              <p className='text-gray-600 mb-2'>
                Actualmente no hay ediciones con convocatoria abierta.
              </p>
              <p className='text-gray-500 text-sm'>
                Puedes explorar las ediciones pasadas o estar atento/a a las
                futuras en los paneles laterales.
              </p>
            </motion.div>
          </div>
        )}
      </main>

      {/* Columna Derecha: Ediciones Futuras */}
      <aside className='lg:w-1/4 xl:w-1/5 space-y-3 order-3 flex flex-col bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-3'>
        <h2 className='text-lg md:text-xl font-semibold text-gray-700 sticky top-2 bg-white/80 backdrop-blur-sm py-2 z-10 rounded-md px-2'>
          Próximas Ediciones
        </h2>
        {futureEditions.length > 0 ? (
          <div className='overflow-y-auto space-y-3 pr-2 max-h-[80vh] custom-scrollbar'>
            {futureEditions.map((edition, idx) => (
              <EditionCard
                key={edition.id}
                edition={edition}
                displayType='compact'
                index={idx}
              />
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-sm p-4 text-center'>
            No hay ediciones futuras programadas.
          </p>
        )}
      </aside>
    </div>
  );
}
