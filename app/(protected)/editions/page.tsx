"use client";
import { useEffect, useState } from "react";
import { EditionCard } from "../../../components/EditionCard";
import { Switch } from "@/components/ui/switch";

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
  const [publishedEditions, setPublishedEditions] = useState<any[]>([]);
  const [closedEditions, setClosedEditions] = useState<any[]>([]);
  const [futureEditions, setFutureEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(true);
  const [pastFilter, setPastFilter] = useState<
    "todas" | "publicadas" | "cerradas"
  >("todas");

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const allEditions = Array.isArray(data) ? data : [];

        const open: any[] = [];
        const published: any[] = [];
        const closed: any[] = [];
        const future: any[] = [];

        allEditions.forEach((edition) => {
          const state = getEditionState(edition);
          if (state === "abierta") open.push(edition);
          else if (state === "publicada") published.push(edition);
          else if (state === "cerrada") closed.push(edition);
          else if (state === "futura") future.push(edition);
        });

        open.sort(
          (a, b) =>
            new Date(a.openDate).getTime() - new Date(b.openDate).getTime()
        );
        published.sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        );
        closed.sort(
          (a, b) =>
            new Date(b.deadlineChapters).getTime() -
            new Date(a.deadlineChapters).getTime()
        );
        future.sort(
          (a, b) =>
            new Date(a.openDate).getTime() - new Date(b.openDate).getTime()
        );

        setOpenEditions(open);
        setPublishedEditions(published);
        setClosedEditions(closed);
        setFutureEditions(future);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching editions:", err);
        setOpenEditions([]);
        setPublishedEditions([]);
        setClosedEditions([]);
        setFutureEditions([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen text-xl font-semibold'>
        Cargando ediciones...
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center bg-gradient-to-br from-gray-100 via-slate-100 to-stone-200 p-4 gap-6 min-h-screen'>
      {/* Ediciones Abiertas */}
      <div className='w-full max-w-6xl'>
        <h2 className='text-2xl font-bold text-center text-purple-700 mb-4'>
          Ediciones Abiertas
        </h2>
        {openEditions.length > 0 ? (
          <div className='flex flex-wrap justify-center gap-4'>
            {openEditions.map((edition) => (
              <EditionCard
                key={edition.id}
                edition={edition}
                displayType='prominent'
              />
            ))}
          </div>
        ) : (
          <div className='text-center bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6'>
            <h3 className='text-xl font-semibold text-purple-700 mb-2'>
              ¡Bienvenido/a!
            </h3>
            <p className='text-gray-600'>
              Actualmente no hay ediciones con convocatoria abierta.
            </p>
          </div>
        )}
      </div>

      {/* Switch de vistas */}
      <div className='w-full max-w-6xl mt-10'>
        <div className='flex items-center justify-center gap-2 mb-4'>
          <span className='text-sm font-medium text-gray-600'>
            Ver próximas ediciones
          </span>
          <Switch
            checked={!showPast}
            onCheckedChange={() => setShowPast((prev) => !prev)}
          />
          <span className='text-sm font-medium text-gray-600'>
            Ver ediciones pasadas
          </span>
        </div>

        {showPast ? (
          <div className='space-y-6'>
            {/* Filtro por tipo de edición pasada */}
            <div className='flex justify-center mb-2'>
              <select
                value={pastFilter}
                onChange={(e) =>
                  setPastFilter(
                    e.target.value as "todas" | "publicadas" | "cerradas"
                  )
                }
                className='border rounded-md px-3 py-1 text-sm shadow-sm bg-white'>
                <option value='todas'>Todas</option>
                <option value='publicadas'>Solo publicadas</option>
                <option value='cerradas'>Solo cerradas</option>
              </select>
            </div>

            <div className='flex flex-wrap justify-start gap-4'>
              {(pastFilter === "todas" || pastFilter === "publicadas") &&
                publishedEditions.map((edition, idx) => (
                  <a
                    href='/library'
                    key={edition.id}
                    className='hover:scale-[1.015] transition-transform duration-300'>
                    <EditionCard
                      edition={edition}
                      displayType='standard'
                      index={idx}
                    />
                  </a>
                ))}
              {(pastFilter === "todas" || pastFilter === "cerradas") &&
                closedEditions.map((edition, idx) => (
                  <EditionCard
                    key={edition.id}
                    edition={edition}
                    displayType='standard'
                    index={idx}
                  />
                ))}
              {publishedEditions.length === 0 &&
                closedEditions.length === 0 && (
                  <p className='text-center text-gray-500 text-sm'>
                    No hay ediciones pasadas disponibles.
                  </p>
                )}
            </div>
          </div>
        ) : (
          <div>
            <h2 className='text-xl font-semibold text-gray-700 text-center mb-4'>
              Próximas Ediciones
            </h2>
            {futureEditions.length > 0 ? (
              <div className='flex flex-wrap justify-center gap-3'>
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
              <p className='text-center text-gray-500 text-sm'>
                No hay ediciones futuras programadas.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
