// components/EditionCard.tsx (o similar)
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Library,
  ArrowRight,
  Info,
  BookOpen,
  BookCheck,
  CalendarClock,
} from "lucide-react";

// Funciones helper (getEditionState, getBadgeStyle, getStateIcon)
// ... (estas funciones pueden permanecer en EditionsPage.tsx o moverse aquí si EditionCard es independiente)
// Por simplicidad, asumiré que se pasarán como props o se redefinirán aquí si es necesario.
// Para este ejemplo, las pasaré como props implícitas o las definiré dentro.

// Pegar aquí las funciones getEditionState, getBadgeStyle, getStateIcon
// O importarlas si las modularizas. Por ahora, las copio para que el componente sea autocontenido:

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
  if (publishDate) {
    publishDate.setHours(0, 0, 0, 0);
  }

  if (publishDate && publishDate <= today) return "publicada";
  if (openDate <= today && today <= deadline) return "abierta";
  if (today > deadline && (!publishDate || today < publishDate))
    return "cerrada";
  if (today < openDate) return "futura";
  return "desconocido";
}

function getBadgeStyle(state: string) {
  switch (state) {
    case "abierta":
      return "bg-green-100 text-green-800";
    case "cerrada":
      return "bg-yellow-100 text-yellow-800";
    case "publicada":
      return "bg-blue-100 text-blue-800";
    case "futura":
      return "bg-gray-200 text-gray-800";
    default:
      return "bg-red-100 text-red-800";
  }
}

function getStateIcon(state: string, cardDisplayType: CardDisplayType) {
  let iconClass = cardDisplayType === "prominent" ? "w-6 h-6" : "w-5 h-5";
  switch (state) {
    case "abierta":
      return <BookOpen className={`${iconClass} text-green-700`} />;
    case "cerrada":
      return <Info className={`${iconClass} text-yellow-700`} />;
    case "publicada":
      return <BookCheck className={`${iconClass} text-blue-700`} />;
    case "futura":
      return <CalendarClock className={`${iconClass} text-gray-700`} />;
    default:
      return <Library className={`${iconClass} text-purple-700`} />;
  }
}

export type CardDisplayType = "prominent" | "standard" | "compact";

interface EditionCardProps {
  edition: any;
  displayType: CardDisplayType;
  index?: number; // Para animaciones escalonadas
}

export function EditionCard({
  edition,
  displayType,
  index = 0,
}: EditionCardProps) {
  const state = getEditionState(edition);
  const badgeStyle = getBadgeStyle(state);
  const stateIcon = getStateIcon(state, displayType);

  let cardOuterClass = "group";
  let cardInnerClass =
    "relative backdrop-blur-sm bg-white/90 p-6 rounded-2xl shadow-lg border h-full transition-all duration-300 hover:shadow-xl flex flex-col";
  let titleClass = "text-xl font-bold transition-colors truncate";
  let iconContainerClass =
    "p-3 rounded-full mr-3 transition-colors duration-300 group-hover:scale-110";
  let decorativeBlobClass =
    "absolute top-0 right-0 w-24 h-24 rounded-bl-full -z-10 transition-colors duration-300";
  let descriptionClass = "text-gray-600 mb-6 text-sm flex-grow";
  let showFullDescription = true;
  let buttonSize: "default" | "sm" | "lg" = "default";

  // --- ESTILOS GLOBALES POR ESTADO (Color de acento) ---
  let accentColorClass = "purple"; // Default
  if (state === "abierta") accentColorClass = "green";
  else if (state === "cerrada") accentColorClass = "yellow";
  else if (state === "publicada") accentColorClass = "blue";
  else if (state === "futura") accentColorClass = "gray";

  cardInnerClass += ` border-${accentColorClass}-300 hover:border-${accentColorClass}-400`;
  iconContainerClass += ` bg-${accentColorClass}-100 group-hover:bg-${accentColorClass}-200`;
  decorativeBlobClass += ` bg-${accentColorClass}-100 group-hover:bg-${accentColorClass}-200`;
  titleClass += ` text-${accentColorClass}-700`;

  // --- AJUSTES ESPECÍFICOS POR TIPO DE DISPLAY ---
  if (displayType === "prominent") {
    cardInnerClass = cardInnerClass.replace("p-6", "p-8"); // Más padding
    titleClass = titleClass.replace("text-xl", "text-2xl md:text-3xl");
    descriptionClass = descriptionClass.replace("text-sm", "text-base");
    iconContainerClass = iconContainerClass.replace("p-3", "p-4");
    buttonSize = "lg";
    cardInnerClass += ` ring-2 ring-${accentColorClass}-200 shadow-${accentColorClass}-100`;
  } else if (displayType === "compact") {
    cardInnerClass = cardInnerClass.replace("p-6", "p-4");
    titleClass = titleClass.replace("text-xl", "text-lg");
    showFullDescription = false; // No mostrar descripción completa o resumirla
    decorativeBlobClass = "hidden"; // Ocultar blob decorativo
    buttonSize = "sm";
  }

  // --- LÓGICA DEL BOTÓN Y DESCRIPCIÓN (como antes) ---
  let buttonText = "Ver Detalles";
  let buttonLink = `/editions/${edition.id}`;
  let buttonIcon = <ArrowRight className='ml-2 h-4 w-4' />;
  let buttonDisabled = false;
  let buttonVariant: "outline" | "default" =
    state === "abierta" && displayType === "prominent" ? "default" : "outline";

  if (state === "cerrada") {
    buttonLink = "/library";
    buttonText = "Ver en Biblioteca";
  } else if (state === "futura") {
    buttonText = "Próximamente";
    buttonDisabled = true;
    buttonIcon = <></>;
    if (displayType === "compact") {
      showFullDescription = false;
    }
  }

  return (
    <motion.div
      className={cardOuterClass}
      whileHover={
        displayType !== "compact"
          ? { y: -5, ...(displayType === "prominent" && { scale: 1.03 }) }
          : {}
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, delay: index * 0.05 },
      }}
      layout>
      <div className={cardInnerClass}>
        <div className={decorativeBlobClass}></div>

        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center min-w-0'>
            <div className={iconContainerClass}>{stateIcon}</div>
            <h2 className={titleClass} title={edition.title || edition.name}>
              {edition.title || edition.name}
            </h2>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${badgeStyle}`}>
            {state.toUpperCase()}
          </span>
        </div>

        {showFullDescription && edition.description && (
          <p className={descriptionClass}>{edition.description}</p>
        )}

        {(state === "futura" ||
          (displayType === "compact" && !showFullDescription)) && (
          <div
            className={`mb-4 flex-grow ${
              displayType === "compact" ? "text-xs" : "text-sm"
            }`}>
            {state === "futura" && (
              <p className='text-gray-500'>Esta edición aún no está abierta.</p>
            )}
            {edition.openDate && (
              <p className={`text-gray-700 font-medium mt-1`}>
                Apertura:{" "}
                {new Date(edition.openDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
            {edition.description &&
              displayType === "compact" &&
              !showFullDescription && (
                <p className='text-gray-500 mt-2 italic line-clamp-2'>
                  {edition.description}
                </p>
              )}
          </div>
        )}

        <div className='mt-auto'>
          <Link
            href={buttonDisabled ? "#" : buttonLink}
            passHref
            legacyBehavior={buttonDisabled ? true : undefined}>
            <Button
              variant={buttonVariant}
              className='w-full'
              disabled={buttonDisabled}
              size={buttonSize}>
              {buttonText}
              {buttonIcon}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
