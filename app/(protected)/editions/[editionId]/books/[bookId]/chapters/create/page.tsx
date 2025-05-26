"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Info,
  BookMarked,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  X,
  Edit3,
  CheckSquare,
  HelpCircle,
  Target,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

import ChapterForm from "../../../../../../../../components/chapter-form";

export default function CreateChapterPage() {
  const { editionId, bookId } = useParams();

  return (
    <ChapterForm
      mode='create'
      editionId={editionId as string}
      bookId={bookId as string}
    />
  );
}
