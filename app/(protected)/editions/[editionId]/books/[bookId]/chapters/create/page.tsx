"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  ChevronLeft,
  FileText,
  Send,
  AlertCircle,
  CheckCircle,
  Info,
  BookMarked,
  Lightbulb,
  Maximize2,
  ArrowLeft,
  ArrowRight,
  X,
  Edit3,
  CheckSquare,
  HelpCircle,
  Target,
  Download,
  Eye,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAvailableCredits } from "@/hooks/useAvailableCredits";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Componente mejorado para el seguimiento de palabras
function WordCountProgress({
  text,
  min,
  max,
  showDetails = true,
}: {
  text: string;
  min: number;
  max: number;
  showDetails?: boolean;
}) {
  const count =
    text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
  const percentage = Math.min(Math.floor((count / max) * 100), 100);

  let status: "error" | "warning" | "success" = "error";
  if (count >= min && count <= max) {
    status = "success";
  } else if (count > max) {
    status = "warning";
  }

  const statusColors = {
    error: "text-red-500",
    warning: "text-amber-500",
    success: "text-green-600",
  };

  const progressColors = {
    error: "bg-red-500",
    warning: "bg-amber-500",
    success: "bg-green-600",
  };

  return (
    <div className='mt-2 space-y-1'>
      <div className='flex items-center justify-between text-xs'>
        <span className={statusColors[status]}>
          {count} palabra{count !== 1 && "s"}
        </span>
        <span className='text-muted-foreground'>
          {min}-{max} palabras
        </span>
      </div>
      <Progress
        value={percentage}
        className='h-1.5'
        style={
          {
            "--progress-background":
              status === "success"
                ? "var(--primary)"
                : status === "warning"
                ? "hsl(41, 100%, 48%)"
                : "hsl(0, 84.2%, 60.2%)",
          } as React.CSSProperties
        }
      />
      {showDetails && (
        <p className={`text-xs ${statusColors[status]}`}>
          {count < min
            ? `Necesitas ${min - count} palabra${
                min - count !== 1 ? "s" : ""
              } más para alcanzar el mínimo`
            : count > max
            ? `Has superado el máximo por ${count - max} palabra${
                count - max !== 1 ? "s" : ""
              }`
            : "Dentro del rango permitido"}
        </p>
      )}
    </div>
  );
}

// Modificar el componente StepsNavigation para que sea más visual e intuitivo
function StepsNavigation({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;
}) {
  return (
    <div className='w-full overflow-x-auto pb-2'>
      <div className='flex space-x-2 min-w-max'>
        {steps.map((step, index) => {
          // Determinar el estado del paso (completado, actual, pendiente)
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <button
              key={index}
              onClick={() => onStepClick(index)}
              className={`flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : isCompleted
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}>
              <div
                className={`flex items-center justify-center size-7 rounded-full mr-2 ${
                  isCurrent
                    ? "bg-primary-foreground text-primary"
                    : isCompleted
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                {isCompleted ? (
                  <CheckSquare className='h-3.5 w-3.5' />
                ) : (
                  <span className='text-xs font-medium'>{index + 1}</span>
                )}
              </div>
              {isCurrent && <span className='text-sm font-medium'>{step}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Componente para mostrar consejos específicos para cada paso con iconos más visuales
function StepTipsPanel({ step, tips }: { step: string; tips: any }) {
  const currentTip = tips[step];

  // Iconos específicos para cada tipo de consejo
  const tipIcons = {
    Introducción: <Info className='h-5 w-5 text-blue-500' />,
    Objetivos: <Target className='h-5 w-5 text-green-500' />,
    Metodología: <FileText className='h-5 w-5 text-purple-500' />,
    Resultados: <BookMarked className='h-5 w-5 text-amber-500' />,
    "Discusión-Conclusión": <Lightbulb className='h-5 w-5 text-orange-500' />,
    Bibliografía: <BookOpen className='h-5 w-5 text-red-500' />,
    Previsualización: <HelpCircle className='h-5 w-5 text-gray-500' />,
  };

  return (
    <div className='bg-white p-4 rounded-xl border shadow-sm'>
      <div className='flex items-center gap-2 mb-3'>
        {tipIcons[step as keyof typeof tipIcons] || currentTip.icon}
        <h3 className='font-medium text-primary'>{currentTip.title}</h3>
      </div>

      <div className='space-y-3'>
        <p className='text-sm text-muted-foreground'>{currentTip.content}</p>

        {step === "Introducción" && (
          <div className='space-y-2 pt-2'>
            <div className='flex items-start gap-2'>
              <Info className='h-4 w-4 text-blue-500 mt-0.5' />
              <p className='text-sm'>
                Proporciona contexto y antecedentes relevantes
              </p>
            </div>
            <div className='flex items-start gap-2'>
              <Info className='h-4 w-4 text-blue-500 mt-0.5' />
              <p className='text-sm'>Explica la importancia del tema</p>
            </div>
            <div className='flex items-start gap-2'>
              <Info className='h-4 w-4 text-blue-500 mt-0.5' />
              <p className='text-sm'>Identifica el vacío de conocimiento</p>
            </div>
          </div>
        )}

        {step === "Metodología" && (
          <div className='space-y-2 pt-2'>
            <div className='flex items-start gap-2'>
              <FileText className='h-4 w-4 text-purple-500 mt-0.5' />
              <p className='text-sm'>Describe el diseño del estudio</p>
            </div>
            <div className='flex items-start gap-2'>
              <FileText className='h-4 w-4 text-purple-500 mt-0.5' />
              <p className='text-sm'>
                Detalla la muestra y criterios de selección
              </p>
            </div>
            <div className='flex items-start gap-2'>
              <FileText className='h-4 w-4 text-purple-500 mt-0.5' />
              <p className='text-sm'>
                Explica los instrumentos y técnicas utilizadas
              </p>
            </div>
          </div>
        )}

        {step === "Resultados" && (
          <div className='space-y-2 pt-2'>
            <div className='flex items-start gap-2'>
              <BookMarked className='h-4 w-4 text-amber-500 mt-0.5' />
              <p className='text-sm'>Presenta datos de forma objetiva</p>
            </div>

            <div className='flex items-start gap-2'>
              <BookMarked className='h-4 w-4 text-amber-500 mt-0.5' />
              <p className='text-sm'>Evita interpretaciones en esta sección</p>
            </div>
          </div>
        )}

        {step === "Discusión-Conclusión" && (
          <div className='space-y-2 pt-2'>
            <div className='flex items-start gap-2'>
              <Lightbulb className='h-4 w-4 text-orange-500 mt-0.5' />
              <p className='text-sm'>Interpreta los resultados obtenidos</p>
            </div>
            <div className='flex items-start gap-2'>
              <Lightbulb className='h-4 w-4 text-orange-500 mt-0.5' />
              <p className='text-sm'>Compara con estudios previos</p>
            </div>
            <div className='flex items-start gap-2'>
              <Lightbulb className='h-4 w-4 text-orange-500 mt-0.5' />
              <p className='text-sm'>Menciona limitaciones y futuras líneas</p>
            </div>
          </div>
        )}

        {step === "Bibliografía" && (
          <div className='space-y-2 pt-2'>
            <div className='flex items-start gap-2'>
              <BookOpen className='h-4 w-4 text-red-500 mt-0.5' />
              <p className='text-sm'>
                Usa un formato consistente (APA, Vancouver)
              </p>
            </div>
            <div className='flex items-start gap-2'>
              <BookOpen className='h-4 w-4 text-red-500 mt-0.5' />
              <p className='text-sm'>
                Incluye fuentes actualizadas y relevantes
              </p>
            </div>
            <div className='flex items-start gap-2'>
              <BookOpen className='h-4 w-4 text-red-500 mt-0.5' />
              <p className='text-sm'>
                Verifica que todas las citas estén referenciadas
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Modificar la parte del renderizado del formulario detallado
// Componente para la navegación horizontal de pasos
function FocusMode({
  children,
  isActive,
  onClose,
  title,
  wordCount,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  objectives,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
  title: string;
  wordCount: { text: string; min: number; max: number };
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  objectives: string;
}) {
  if (!isActive) return null;

  return (
    <div className='fixed inset-0 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-md z-50 flex flex-col'>
      <div className='bg-background/80 backdrop-blur-sm border-b border-border/30 shadow-sm flex items-center justify-between px-6 py-3 transition-all duration-300'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='hover:bg-primary/10 transition-colors'>
            <X className='h-4 w-4' />
          </Button>
          <h2 className='text-lg font-medium text-foreground/90'>{title}</h2>
        </div>
        <div className='flex items-center gap-3'>
          <Badge
            variant='outline'
            className='gap-1 bg-background/50 backdrop-blur-sm'>
            <Edit3 className='h-3 w-3' />
            Paso {currentStep} de {totalSteps}
          </Badge>
          <div className='w-48'>
            <WordCountProgress
              text={wordCount.text}
              min={wordCount.min}
              max={wordCount.max}
              showDetails={false}
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' className='ml-2'>
                  <Info className='h-4 w-4 text-primary' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='left' className='w-80 p-4'>
                <h4 className='font-medium mb-2'>Objetivos del capítulo</h4>
                <p className='text-sm'>
                  {objectives || "No has definido objetivos aún."}
                </p>
                {objectives && (
                  <WordCountProgress
                    text={objectives}
                    min={50}
                    max={150}
                    showDetails={false}
                  />
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className='flex-1 overflow-auto py-6 px-4 flex items-center justify-center bg-gradient-to-b from-muted/10 to-transparent'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='w-[80%] max-w-5xl' // Increased from 60% to 80%
        >
          {/* Aplicamos estilos específicos para el modo de concentración */}
          <div className='bg-background/60 backdrop-blur-md rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl'>
            {/* Modificamos el contenido para aplicar estilos específicos a los elementos de entrada */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement, {
                  className: "focus-mode-content p-10", // Increased padding from p-8 to p-10
                });
              }
              return child;
            })}
          </div>
        </motion.div>
      </div>
      <div className='bg-background/80 backdrop-blur-sm border-t border-border/30 shadow-sm flex items-center justify-between px-6 py-3 transition-all duration-300'>
        <Button
          variant='ghost'
          onClick={onPrev}
          disabled={currentStep === 1}
          className='gap-1 hover:bg-primary/10 transition-colors'>
          <ArrowLeft className='h-4 w-4' /> Anterior
        </Button>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            {wordCount.text.trim() === ""
              ? 0
              : wordCount.text.trim().split(/\s+/).filter(Boolean).length}{" "}
            palabras
          </span>
          <span className='text-xs text-muted-foreground'>
            (Mín: {wordCount.min} / Máx: {wordCount.max})
          </span>
        </div>
        <Button
          onClick={onNext}
          disabled={currentStep === totalSteps}
          className='gap-1 bg-primary hover:bg-primary/90 transition-colors'>
          Siguiente <ArrowRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

export default function CreateChapterPage() {
  const { editionId, bookId } = useParams();
  const router = useRouter();

  // Estados principales para el formulario
  const [title, setTitle] = useState("");
  const [studyType, setStudyType] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [objectives, setObjectives] = useState("");
  const [methodology, setMethodology] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [bibliography, setBibliography] = useState("");

  // Estados para perfil, detalles del libro y créditos disponibles
  const [authorId, setAuthorId] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const { availableCredits, loadingCredits, errorCredits } =
    useAvailableCredits(editionId as string);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Estado para controlar la fase del formulario (inicial o detallada)
  const [formPhase, setFormPhase] = useState<"initial" | "detailed">("initial");

  // Definición de pasos
  const steps = [
    "Introducción",
    "Objetivos",
    "Metodología",
    "Resultados",
    "Discusión-Conclusión",
    "Bibliografía",
    "Previsualización",
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const [exampleFor, setExampleFor] = useState<string | null>(null);
  // Verifica que cada sección cumpla el mínimo y máximo de palabras
  const isValidRange = (text: string, min: number, max: number) => {
    const count = text.trim() ? text.trim().split(/\s+/).length : 0;
    return count >= min && count <= max;
  };
  const allValid =
    isValidRange(introduction, 50, 150) &&
    isValidRange(objectives, 50, 150) &&
    isValidRange(methodology, 30, 100) &&
    isValidRange(results, 50, 250) &&
    isValidRange(discussion, 30, 150) &&
    isValidRange(bibliography, 30, 150);

  // Consejos dinámicos según el paso actual
  const tips: {
    [key: string]: { title: string; content: string; icon: React.ReactNode };
  } = {
    Introducción: {
      title: "Consejos para la Introducción",
      content:
        "Describe el contexto y los antecedentes de tu estudio. Explica por qué es relevante y qué vacío de conocimiento pretende llenar.",
      icon: <Info className='size-4' />,
    },
    Objetivos: {
      title: "Consejos para los Objetivos",
      content:
        "Define claramente los objetivos del trabajo. Usa verbos en infinitivo y asegúrate de que sean medibles y alcanzables.",
      icon: <CheckSquare className='size-4' />,
    },
    Metodología: {
      title: "Consejos para la Metodología",
      content:
        "Explica el método y las técnicas que utilizarás. Sé específico sobre el diseño del estudio, la muestra y los instrumentos.",
      icon: <FileText className='size-4' />,
    },
    Resultados: {
      title: "Consejos para los Resultados",
      content:
        "Presenta los resultados esperados de forma clara y objetiva. Usa datos concretos y evita interpretaciones en esta sección.",
      icon: <BookMarked className='size-4' />,
    },
    "Discusión-Conclusión": {
      title: "Consejos para la Discusión",
      content:
        "Discute los hallazgos y saca conclusiones. Relaciona tus resultados con la literatura existente y explica sus implicaciones.",
      icon: <Lightbulb className='size-4' />,
    },
    Bibliografía: {
      title: "Consejos para la Bibliografía",
      content:
        "Incluye todas las fuentes consultadas siguiendo un formato consistente (APA, Vancouver, etc.). Asegúrate de que sean actuales y relevantes.",
      icon: <BookOpen className='size-4' />,
    },
    Previsualización: {
      title: "Revisa tu trabajo",
      content:
        "Revisa todo el contenido antes de enviar el capítulo. Verifica la coherencia, la ortografía y que cumplas con todos los requisitos.",
      icon: <HelpCircle className='size-4' />,
    },
  };
  const EXAMPLES: Record<string, string> = {
    introduccion: `En la última década, la telemedicina ha emergido como una estrategia clave para el manejo de enfermedades crónicas, especialmente la diabetes tipo 2. La monitorización remota de glucemias, las consultas virtuales y el apoyo educativo a distancia buscan mejorar el control metabólico y reducir complicaciones. A pesar de sus ventajas, persisten dudas sobre su efectividad comparada con la atención presencial y la adherencia a largo plazo. Este estudio evalúa el impacto de un programa de telemedicina estructurado en pacientes con diabetes tipo 2, analizando tanto parámetros clínicos como percepción del paciente.`,
    objetivos: `1. Determinar la variación de HbA1c en pacientes con diabetes tipo 2 antes y después de implementar telemedicina.\n2. Analizar la adherencia al tratamiento farmacológico y los cambios en hábitos de vida saludable.\n3. Evaluar la satisfacción, la percepción de calidad de atención y la accesibilidad a los servicios virtuales.`,
    metodologia: `Estudio cuasi-experimental de 12 semanas con cohorte de 80 pacientes con diabetes tipo 2. Se recolectaron valores de HbA1c al inicio y tras la intervención. Los participantes recibieron consultas virtuales semanales, educación nutricional y herramientas de autocontrol mediante app móvil. Se aplicaron encuestas de adherencia (Morisky–Green) y satisfacción validada. El análisis incluyó prueba t para muestras pareadas y estadística descriptiva.`,
    resultados: `Al finalizar el programa, el promedio de HbA1c disminuyó de 8,2 % a 7,4 % (p < 0,001). La adherencia al tratamiento mejoró un 20 %, según Morisky–Green (p = 0,02). El 78 % de los participantes calificó la experiencia como satisfactoria o muy satisfactoria, y el 85 % destacó mayor comodidad y accesibilidad. Se observó una reducción del 30 % en visitas de emergencia por hipoglucemia, aunque no fue estadísticamente significativa (p = 0,08).`,
    discusion: `Estos hallazgos indican que la telemedicina puede mejorar significativamente el control glucémico y la adherencia en pacientes con diabetes tipo 2, probablemente gracias al monitoreo continuo y soporte educativo frecuente. Coinciden con González et al. (2020) y Sánchez y Pérez (2021), que reportaron resultados similares. No obstante, es necesario evaluar la sostenibilidad a largo plazo y su integración en la práctica clínica. Futuras investigaciones deberían explorar costos, escalabilidad y eficacia en poblaciones rurales.`,
    bibliografia: `1. González A., Martínez L. (2020). Telemedicina en diabetes tipo 2: revisión sistemática. *Revista Clínica de Endocrinología*, 15(3), 123–134.\n2. Sánchez M., Pérez J. (2021). Adherencia y satisfacción en programas virtuales de diabetes. *Journal of Telehealth*, 8(2), 45–53.\n3. World Health Organization. (2019). *Global report on diabetes*. OMS.`,
  };

  const renderExample = (key: string, title: string) =>
    exampleFor === key && (
      <Alert variant='default' className='mt-2 whitespace-pre-wrap relative'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setExampleFor(null)}
          className='absolute top-2 right-2'>
          <X className='h-4 w-4' />
        </Button>
        <AlertTitle>Ejemplo de {title}</AlertTitle>
        <AlertDescription className='text-sm'>{EXAMPLES[key]}</AlertDescription>
      </Alert>
    );

  // Funciones para navegar entre pasos
  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Obtener el texto actual para el contador de palabras en modo de concentración
  const getCurrentWordCount = () => {
    const step = steps[currentStep];
    switch (step) {
      case "Introducción":
        return { text: introduction, min: 50, max: 150 };
      case "Objetivos":
        return { text: objectives, min: 50, max: 150 };
      case "Metodología":
        return { text: methodology, min: 30, max: 100 };
      case "Resultados":
        return { text: results, min: 50, max: 250 };
      case "Discusión-Conclusión":
        return { text: discussion, min: 30, max: 150 };
      case "Bibliografía":
        return { text: bibliography, min: 30, max: 150 };
      default:
        return { text: "", min: 0, max: 0 };
    }
  };

  // Renderizado condicional para cada paso
  const renderStepContent = () => {
    const step = steps[currentStep];

    if (step === "Previsualización") {
      return (
        <div className='space-y-6 bg-card p-6 rounded-lg border'>
          <div className='space-y-2'>
            <h3 className='text-xl font-semibold text-primary'>{title}</h3>
            <Badge>{studyType}</Badge>
          </div>

          <Tabs defaultValue='introduccion' className='w-full'>
            <TabsList className='grid grid-cols-3 md:grid-cols-6'>
              <TabsTrigger
                value='introduccion'
                className={!introduction.trim() ? "border-red-500 border" : ""}>
                Intro
              </TabsTrigger>
              <TabsTrigger
                value='objetivos'
                className={!objectives.trim() ? "border-red-500 border" : ""}>
                Objetivos
              </TabsTrigger>
              <TabsTrigger
                value='metodologia'
                className={!methodology.trim() ? "border-red-500 border" : ""}>
                Método
              </TabsTrigger>
              <TabsTrigger
                value='resultados'
                className={!results.trim() ? "border-red-500 border" : ""}>
                Resultados
              </TabsTrigger>
              <TabsTrigger
                value='discusion'
                className={!discussion.trim() ? "border-red-500 border" : ""}>
                Discusión
              </TabsTrigger>
              <TabsTrigger
                value='bibliografia'
                className={!bibliography.trim() ? "border-red-500 border" : ""}>
                Bibliografía
              </TabsTrigger>
            </TabsList>

            <TabsContent value='introduccion' className='mt-4 space-y-2'>
              <h4 className='font-medium'>Introducción</h4>
              {introduction.trim() ? (
                <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                  {introduction}
                </p>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Sección vacía</AlertTitle>
                  <AlertDescription>
                    Esta sección es obligatoria. Por favor, complétala antes de
                    enviar.
                  </AlertDescription>
                </Alert>
              )}
              <WordCountProgress text={introduction} min={50} max={150} />
            </TabsContent>

            <TabsContent value='objetivos' className='mt-4 space-y-2'>
              <h4 className='font-medium'>Objetivos</h4>
              {objectives.trim() ? (
                <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                  {objectives}
                </p>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Sección vacía</AlertTitle>
                  <AlertDescription>
                    Esta sección es obligatoria. Por favor, complétala antes de
                    enviar.
                  </AlertDescription>
                </Alert>
              )}
              <WordCountProgress text={objectives} min={50} max={150} />
            </TabsContent>

            <TabsContent value='metodologia' className='mt-4 space-y-2'>
              <h4 className='font-medium'>Metodología</h4>
              {methodology.trim() ? (
                <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                  {methodology}
                </p>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Sección vacía</AlertTitle>
                  <AlertDescription>
                    Esta sección es obligatoria. Por favor, complétala antes de
                    enviar.
                  </AlertDescription>
                </Alert>
              )}
              <WordCountProgress text={methodology} min={30} max={100} />
            </TabsContent>

            <TabsContent value='resultados' className='mt-4 space-y-2'>
              <h4 className='font-medium'>Resultados</h4>
              {results.trim() ? (
                <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                  {results}
                </p>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Sección vacía</AlertTitle>
                  <AlertDescription>
                    Esta sección es obligatoria. Por favor, complétala antes de
                    enviar.
                  </AlertDescription>
                </Alert>
              )}
              <WordCountProgress text={results} min={50} max={250} />
            </TabsContent>

            <TabsContent value='discusion' className='mt-4 space-y-2'>
              <h4 className='font-medium'>Discusión-Conclusión</h4>
              {discussion.trim() ? (
                <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                  {discussion}
                </p>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Sección vacía</AlertTitle>
                  <AlertDescription>
                    Esta sección es obligatoria. Por favor, complétala antes de
                    enviar.
                  </AlertDescription>
                </Alert>
              )}
              <WordCountProgress text={discussion} min={30} max={150} />
            </TabsContent>

            <TabsContent value='bibliografia' className='mt-4 space-y-2'>
              <h4 className='font-medium'>Bibliografía</h4>
              {bibliography.trim() ? (
                <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                  {bibliography}
                </p>
              ) : (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Sección vacía</AlertTitle>
                  <AlertDescription>
                    Esta sección es obligatoria. Por favor, complétala antes de
                    enviar.
                  </AlertDescription>
                </Alert>
              )}
              <WordCountProgress text={bibliography} min={30} max={150} />
            </TabsContent>
          </Tabs>

          {/* Add a summary of missing sections */}
          {(!introduction.trim() ||
            !objectives.trim() ||
            !methodology.trim() ||
            !results.trim() ||
            !discussion.trim() ||
            !bibliography.trim()) && (
            <Alert variant='destructive' className='mt-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Secciones incompletas</AlertTitle>
              <AlertDescription>
                Para poder enviar el capítulo, debes completar todas las
                secciones obligatorias.
                <ul className='mt-2 list-disc pl-5'>
                  {!introduction.trim() && <li>Introducción</li>}
                  {!objectives.trim() && <li>Objetivos</li>}
                  {!methodology.trim() && <li>Metodología</li>}
                  {!results.trim() && <li>Resultados</li>}
                  {!discussion.trim() && <li>Discusión-Conclusión</li>}
                  {!bibliography.trim() && <li>Bibliografía</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className='mt-6 flex justify-center'>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  className='gap-2'
                  disabled={!allValid}
                  title={
                    !allValid
                      ? "Completa todas las secciones dentro de rango para previsualizar"
                      : undefined
                  }>
                  <Eye className='h-4 w-4' /> Previsualizar como PDF
                </Button>
              </DialogTrigger>

              <DialogContent className='max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh]'>
                <DialogHeader>
                  <DialogTitle>Vista previa en formato PDF</DialogTitle>
                </DialogHeader>
                <div className='flex-1 h-[calc(95vh-120px)] overflow-hidden'>
                  <PDFPreview
                    title={title}
                    studyType={studyType}
                    introduction={introduction}
                    objectives={objectives}
                    methodology={methodology}
                    results={results}
                    discussion={discussion}
                    bibliography={bibliography}
                  />
                </div>
                <PDFDownloadLink
                  document={
                    <Document>
                      <Page size='A4' style={styles.page}>
                        <View>
                          <Text style={styles.title}>{title}</Text>
                          <Text style={styles.studyType}>
                            Tipo de estudio: {studyType}
                          </Text>

                          <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                              Introducción
                            </Text>
                            <Text style={styles.text}>{introduction}</Text>
                          </View>

                          <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Objetivos</Text>
                            <Text style={styles.text}>{objectives}</Text>
                          </View>

                          <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Metodología</Text>
                            <Text style={styles.text}>{methodology}</Text>
                          </View>

                          <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Resultados</Text>
                            <Text style={styles.text}>{results}</Text>
                          </View>

                          <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                              Discusión y Conclusiones
                            </Text>
                            <Text style={styles.text}>{discussion}</Text>
                          </View>

                          <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                              Bibliografía
                            </Text>
                            <Text style={styles.text}>{bibliography}</Text>
                          </View>

                          <Text style={styles.footer}>
                            Este documento es una vista previa y puede estar
                            sujeto a cambios.
                          </Text>
                        </View>
                      </Page>
                    </Document>
                  }
                  fileName={`${title.replace(/\s+/g, "_")}.pdf`}>
                  {({ loading }) => (
                    <Button
                      disabled={loading}
                      className='mt-4 gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50'>
                      {loading ? (
                        "Generando PDF…"
                      ) : (
                        <>
                          <Download className='h-4 w-4' /> Descargar PDF
                        </>
                      )}
                    </Button>
                  )}
                </PDFDownloadLink>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      );
    }

    // En función del paso, se muestran los Textarea correspondientes
    // Modificamos para que en modo concentración no se muestre el contador de palabras
    // y para que los textareas tengan un estilo especial
    switch (step) {
      case "Introducción":
        return (
          <>
            <Label className='text-gray-700 font-medium mb-1 block'>
              Introducción
            </Label>
            <Button
              variant='link'
              size='sm'
              onClick={() => setExampleFor("introduccion")}>
              Ver ejemplo
            </Button>
            <Textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={8}
              placeholder='Describe el contexto y los antecedentes de tu estudio...'
              required
              className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-y focus-mode-textarea'
            />
            {renderExample("introduccion", "Introducción")}
            {!focusMode && (
              <WordCountProgress text={introduction} min={50} max={150} />
            )}
          </>
        );
      case "Objetivos":
        return (
          <>
            <Label className='text-gray-700 font-medium mb-1 block'>
              Objetivos
            </Label>
            <Button
              variant='link'
              size='sm'
              onClick={() => setExampleFor("objetivos")}>
              Ver ejemplo
            </Button>
            <Textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              rows={8}
              placeholder='Define claramente los objetivos del trabajo...'
              required
              className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-y focus-mode-textarea'
            />
            {renderExample("objetivos", "Objetivos")}
            {!focusMode && (
              <WordCountProgress text={objectives} min={50} max={150} />
            )}
          </>
        );
      case "Metodología":
        return (
          <>
            <Label className='text-gray-700 font-medium mb-1 block'>
              Metodología
            </Label>
            <Button
              variant='link'
              size='sm'
              onClick={() => setExampleFor("metodologia")}>
              Ver ejemplo
            </Button>
            <Textarea
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              rows={8}
              placeholder='Explica el método y las técnicas que utilizarás...'
              required
              className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-y focus-mode-textarea'
            />
            {renderExample("metodologia", "Metodología")}
            {!focusMode && (
              <WordCountProgress text={methodology} min={30} max={100} />
            )}
          </>
        );
      case "Resultados":
        return (
          <>
            <Label className='text-gray-700 font-medium mb-1 block'>
              Resultados
            </Label>
            <Button
              variant='link'
              size='sm'
              onClick={() => setExampleFor("resultados")}>
              Ver ejemplo
            </Button>
            <Textarea
              value={results}
              onChange={(e) => setResults(e.target.value)}
              rows={8}
              placeholder='Presenta los resultados esperados...'
              required
              className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-y focus-mode-textarea'
            />
            {renderExample("resultados", "Resultados")}
            {!focusMode && (
              <WordCountProgress text={results} min={50} max={250} />
            )}
          </>
        );
      case "Discusión-Conclusión":
        return (
          <>
            <Label className='text-gray-700 font-medium mb-1 block'>
              Discusión-Conclusión
            </Label>
            <Button
              variant='link'
              size='sm'
              onClick={() => setExampleFor("discusion")}>
              Ver ejemplo
            </Button>
            <Textarea
              value={discussion}
              onChange={(e) => setDiscussion(e.target.value)}
              rows={8}
              placeholder='Discute los hallazgos y saca conclusiones...'
              required
              className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-y focus-mode-textarea'
            />
            {renderExample("discusion", "Discusión-Conclusión")}
            {!focusMode && (
              <WordCountProgress text={discussion} min={30} max={150} />
            )}
          </>
        );
      case "Bibliografía":
        return (
          <>
            <Label className='text-gray-700 font-medium mb-1 block'>
              Bibliografía
            </Label>
            <Button
              variant='link'
              size='sm'
              onClick={() => setExampleFor("bibliografia")}>
              Ver ejemplo
            </Button>
            <Textarea
              value={bibliography}
              onChange={(e) => setBibliography(e.target.value)}
              rows={8}
              placeholder='Incluye todas las fuentes consultadas...'
              required
              className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-y focus-mode-textarea'
            />
            {renderExample("bibliografia", "Bibliografía")}
            {!focusMode && (
              <WordCountProgress text={bibliography} min={30} max={150} />
            )}
          </>
        );
      default:
        return null;
    }
  };

  // Modificar el useEffect para los estilos del modo de concentración
  useEffect(() => {
    if (focusMode) {
      // Añadir estilos para el modo de concentración
      const style = document.createElement("style");
      style.id = "focus-mode-styles";
      style.innerHTML = `
      .focus-mode-content {
        transition: all 0.3s ease;
      }
      
      .focus-mode-content:hover {
        transform: translateY(-2px);
      }
      
      .focus-mode-content textarea {
        font-size: 1.35rem;
        line-height: 1.8;
        min-height: 350px;
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: none;
        background-color: transparent;
        box-shadow: none;
        transition: all 0.3s ease;
        width: 100%;
        resize: none;
      }
      
      .focus-mode-content textarea:focus {
        outline: none;
        background-color: rgba(255, 255, 255, 0.05);
      }
      
      .focus-mode-content label {
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 1rem;
        color: rgba(75, 85, 99, 0.9);
        display: inline-block;
        transition: all 0.3s ease;
      }
      
      .focus-mode-content:hover label {
        color: rgba(75, 85, 99, 1);
      }
      
      /* Animación de cursor personalizado */
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      
      .focus-mode-content textarea::selection {
        background-color: rgba(124, 58, 237, 0.2);
      }
    `;
      document.head.appendChild(style);

      return () => {
        // Limpiar estilos al desmontar
        const styleElement = document.getElementById("focus-mode-styles");
        if (styleElement) {
          styleElement.remove();
        }
      };
    }
  }, [focusMode]);

  // useEffect para obtener datos: perfil y detalles del libro
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        let userId = localStorage.getItem("userId");
        if (token) {
          const profileRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!profileRes.ok) {
            throw new Error("Error al obtener el perfil");
          }
          const profileData = await profileRes.json();
          if (profileData && profileData.id) {
            setAuthorId(profileData.id);
            userId = profileData.id;
          }
        }
        const bookRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
        );
        if (bookRes.ok) {
          const bookData = await bookRes.json();
          setBookTitle(bookData.title || "Libro seleccionado");
        }
      } catch (err: any) {
        console.error("Error al obtener datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editionId, bookId]);

  // Modify the handleSubmit function to check for empty fields
  const handleSubmit = async () => {
    if (!authorId) {
      setError("No se pudo obtener el perfil del autor. Intente nuevamente.");
      return;
    }

    // Check for empty required fields
    const emptyFields = [];
    if (!introduction.trim()) emptyFields.push("Introducción");
    if (!objectives.trim()) emptyFields.push("Objetivos");
    if (!methodology.trim()) emptyFields.push("Metodología");
    if (!results.trim()) emptyFields.push("Resultados");
    if (!discussion.trim()) emptyFields.push("Discusión-Conclusión");
    if (!bibliography.trim()) emptyFields.push("Bibliografía");

    if (emptyFields.length > 0) {
      setError(
        `Por favor completa los siguientes campos obligatorios: ${emptyFields.join(
          ", "
        )}`
      );
      // Show error alert
      document
        .getElementById("error-alert")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const body = {
        title,
        studyType,
        methodology,
        introduction,
        objectives,
        results,
        discussion,
        bibliography,
        authorId,
        content: introduction, // Se utiliza la introducción como fallback para el contenido
        status: "pendiente", // Change status to pending instead of draft
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el capítulo");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/editions/${editionId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo condicional de vistas de carga, éxito o ausencia de créditos
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-6 w-6 text-primary' />
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='text-center p-8 max-w-md bg-card rounded-xl shadow-lg border'>
          <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
            <CheckCircle className='h-8 w-8 text-green-600' />
          </div>
          <h2 className='text-2xl font-bold text-foreground mb-2'>
            ¡Capítulo enviado con éxito!
          </h2>
          <p className='text-muted-foreground mb-6'>
            Tu capítulo ha sido enviado correctamente y está pendiente de
            revisión.
          </p>
          <Button
            className='bg-primary hover:bg-primary/90'
            onClick={
              () => router.push(`/editions/${editionId}`) // al listado de libros de la edición
            }>
            Ir a la edición
          </Button>
        </motion.div>
      </div>
    );
  }

  if (loadingCredits || loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-6 w-6 text-primary' />
          </div>
        </div>
      </div>
    );
  }

  if (availableCredits === null || availableCredits <= 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] p-4'>
        <Card className='max-w-md w-full'>
          <CardHeader>
            <CardTitle>Créditos insuficientes</CardTitle>
            <CardDescription>
              Para enviar un capítulo, primero debes comprar participación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant='default' className='mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Atención</AlertTitle>
              <AlertDescription>
                No tienes créditos disponibles para crear un nuevo capítulo.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              className='w-full'
              onClick={() =>
                router.push(
                  `/editions/${editionId}/books/${bookId}/chapters/purchase`
                )
              }>
              Comprar Participación
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo decorativo */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between mb-8'>
          <Button
            variant='ghost'
            className='flex items-center text-primary hover:text-primary/90 hover:bg-primary/10'
            onClick={() => router.back()}>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Volver
          </Button>
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-primary/10 text-primary'>
            Nuevo Capítulo
          </div>
        </motion.div>

        {/* Formulario inicial o detallado según la fase */}
        {formPhase === "initial" ? (
          <Card className='max-w-3xl mx-auto backdrop-blur-sm bg-white/80 border-white/50'>
            <CardHeader>
              <CardTitle className='text-2xl text-primary'>
                Crear nuevo capítulo
              </CardTitle>
              <CardDescription>
                Completa la información básica para comenzar a crear tu capítulo
                para {bookTitle}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <Label className='text-gray-700 font-medium mb-1 block'>
                  Título del capítulo
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Ej: Estudio de caso: Manejo de diabetes'
                  required
                  className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                />
              </div>
              <div>
                <Label className='text-gray-700 font-medium mb-1 block'>
                  Tipo de estudio
                </Label>
                <Select onValueChange={(val) => setStudyType(val)} required>
                  <SelectTrigger className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'>
                    <SelectValue placeholder='Selecciona un tipo de estudio' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='revisión bibliográfica'>
                      Revisión bibliográfica
                    </SelectItem>
                    <SelectItem value='caso clínico'>Caso clínico</SelectItem>
                    <SelectItem value='protocolo'>Protocolo</SelectItem>
                    <SelectItem value='otros'>
                      Otros trabajos de investigación
                    </SelectItem>
                  </SelectContent>
                  <div className='mt-2 bg-primary/5 p-4 rounded-lg border'>
                    <div className='flex items-start gap-3'>
                      <FileText className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                      <div>
                        <h3 className='font-medium text-sm mb-1'>
                          Sobre el tipo de estudio
                        </h3>
                        <p className='text-xs text-muted-foreground'>
                          {studyType === "revisión bibliográfica" &&
                            "La revisión bibliográfica consiste en analizar, evaluar e interpretar investigaciones previas relacionadas con un área temática. Estructura: Introducción, Metodología de búsqueda, Resultados de la revisión, Discusión y Conclusiones."}
                          {studyType === "caso clínico" &&
                            "El caso clínico presenta la experiencia con un paciente específico, detallando el diagnóstico, tratamiento y evolución. Estructura: Introducción, Presentación del caso, Discusión clínica, Conclusiones."}
                          {studyType === "protocolo" &&
                            "El protocolo describe detalladamente los procedimientos a seguir en una investigación. Estructura: Justificación, Objetivos, Metodología detallada, Consideraciones éticas, Cronograma."}
                          {studyType === "otros" &&
                            "Otros trabajos de investigación pueden incluir estudios experimentales, observacionales o cualitativos. Estructura: Introducción, Metodología, Resultados, Discusión, Conclusiones."}
                          {!studyType &&
                            "Selecciona un tipo de estudio para ver su descripción y estructura recomendada."}
                        </p>
                      </div>
                    </div>
                  </div>
                </Select>
              </div>

              <div className='bg-primary/5 p-4 rounded-lg border flex items-start gap-3'>
                <Info className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                <div>
                  <h3 className='font-medium text-sm mb-1'>
                    Información importante
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    Una vez que hayas completado el título y tipo de estudio,
                    podrás continuar con la estructura detallada de tu capítulo.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
              <Button
                onClick={() => setFormPhase("detailed")}
                disabled={!title || !studyType}
                className='bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg'>
                Continuar con la estructura
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className='max-w-6xl mx-auto'>
            {/* Cabecera con título y navegación de pasos */}
            <div className='bg-white rounded-xl shadow-sm border p-4 mb-6'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4'>
                <div>
                  <h2 className='text-2xl font-bold text-primary'>{title}</h2>
                  <p className='text-muted-foreground'>
                    Estructura para: {studyType}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => setFocusMode(true)}>
                          <Maximize2 className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Modo concentración</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Navegación de pasos horizontal mejorada */}
              <StepsNavigation
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>

            {/* Contenido principal con layout mejorado */}
            <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
              {/* Panel central con contenido del paso */}
              <div className='md:col-span-9 '>
                {error && (
                  <Alert
                    variant='destructive'
                    className='mb-6'
                    id='error-alert'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className='bg-white p-6 rounded-xl border shadow-sm'>
                  {renderStepContent()}

                  <div className='mt-6 flex justify-between'>
                    <Button
                      variant='outline'
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className='gap-1'>
                      <ArrowLeft className='h-4 w-4' /> Anterior
                    </Button>

                    {currentStep === steps.length - 1 ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={!allValid}
                        title={
                          !allValid
                            ? "No cumple todos los requisitos de palabras"
                            : undefined
                        }
                        className='gap-1 bg-primary hover:bg-primary/90 disabled:opacity-50'>
                        <Send className='h-4 w-4' /> Enviar Capítulo
                      </Button>
                    ) : (
                      <Button onClick={handleNext} className='gap-1'>
                        Siguiente <ArrowRight className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {/* Panel izquierdo con consejos */}
              <div className='md:col-span-3'>
                <StepTipsPanel step={steps[currentStep]} tips={tips} />

                {/* Progreso */}
                <div className='mt-4 bg-white p-4 rounded-xl border shadow-sm'>
                  <h3 className='font-medium text-sm mb-2 flex items-center gap-2'>
                    <Edit3 className='h-4 w-4 text-primary' />
                    Progreso
                  </h3>
                  <Progress
                    value={(currentStep / (steps.length - 1)) * 100}
                    className='h-1.5 mb-2'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Paso {currentStep + 1} de {steps.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modo de concentración */}
      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <FocusMode
              isActive={focusMode}
              onClose={() => setFocusMode(false)}
              title={`${title} - ${steps[currentStep]}`}
              wordCount={getCurrentWordCount()}
              currentStep={currentStep + 1}
              totalSteps={steps.length}
              onNext={handleNext}
              onPrev={handlePrevious}
              objectives={objectives}>
              <div className='bg-card p-6 rounded-lg border shadow-sm'>
                {renderStepContent()}
              </div>
            </FocusMode>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// PDF Preview Component
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#7c3aed",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#4b5563",
  },
  studyType: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "#6b7280",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#7c3aed",
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#9ca3af",
  },
});

function PDFPreview({
  title,
  studyType,
  introduction,
  objectives,
  methodology,
  results,
  discussion,
  bibliography,
}: {
  title: string;
  studyType: string;
  introduction: string;
  objectives: string;
  methodology: string;
  results: string;
  discussion: string;
  bibliography: string;
}) {
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <Document>
        <Page size='A4' style={styles.page}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.studyType}>Tipo de estudio: {studyType}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Introducción</Text>
              <Text style={styles.text}>{introduction}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Objetivos</Text>
              <Text style={styles.text}>{objectives}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Metodología</Text>
              <Text style={styles.text}>{methodology}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resultados</Text>
              <Text style={styles.text}>{results}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discusión y Conclusiones</Text>
              <Text style={styles.text}>{discussion}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bibliografía</Text>
              <Text style={styles.text}>{bibliography}</Text>
            </View>

            <Text style={styles.footer}>
              Este documento es una vista previa y puede estar sujeto a cambios.
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
