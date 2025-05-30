"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  X,
  Check,
  ChevronDown,
  Search,
  Loader2, // Para el estado de carga del select
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Componente MultiSelect (se mantiene como está, no se usa para categorías profesionales aquí)
export type Option = {
  value: string;
  label: string;
};
// ... (código del componente MultiSelect sin cambios) ...
type MultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
};

function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((val) => val !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (
    e: React.MouseEvent<HTMLButtonElement>,
    optionValue: string
  ) => {
    e.stopPropagation();
    onChange(value.filter((val) => val !== optionValue));
  };

  const getSelectedLabels = () => {
    return value.map(
      (val) => options.find((option) => option.value === val)?.label || val
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full font-sans",
        disabled && "opacity-70 cursor-not-allowed",
        className
      )}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "ring-2 ring-purple-500 ring-offset-2",
          disabled && "bg-gray-50 cursor-not-allowed"
        )}>
        <div className='flex flex-wrap gap-1.5 pe-8'>
          {value.length > 0 ? (
            getSelectedLabels().map((label, index) => (
              <div
                key={index}
                className='flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800'>
                <span>{label}</span>
                <button
                  type='button'
                  onClick={(e) => removeOption(e, value[index])}
                  className='ml-1 rounded-full p-0.5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  disabled={disabled}>
                  <X className='h-3 w-3' />
                </button>
              </div>
            ))
          ) : (
            <span className='text-gray-500'>{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </div>
      {isOpen && (
        <div className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg'>
          <div className='sticky top-0 z-20 bg-white px-2 py-1.5 border-b border-gray-100'>
            <div className='relative'>
              <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
              <input
                ref={searchInputRef}
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className='h-8 w-full rounded-md border-0 bg-gray-50 pl-8 pr-2 text-sm outline-none focus:bg-gray-100'
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'>
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>
          <div className='mt-1'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100",
                      isSelected && "bg-purple-50"
                    )}>
                    <span
                      className={cn(
                        "text-sm",
                        isSelected
                          ? "text-purple-700 font-medium"
                          : "text-gray-700"
                      )}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <Check className='h-4 w-4 text-purple-600' />
                    )}
                  </div>
                );
              })
            ) : (
              <div className='px-3 py-2 text-sm text-gray-500'>
                No se encontraron resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Terminos (placeholder)
// ... (código del componente Terminos sin cambios) ...
export function Terminos() {
  return (
    <div className='max-h-[70vh] overflow-y-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>TÉRMINOS Y CONDICIONES</h2>
      <div className='prose prose-sm'>
        <ol className='list-decimal list-inside space-y-4'>
          <li>
            <strong>Objeto</strong>
            <p>
              El presente documento regula el acceso y uso del sitio web{" "}
              <a
                href='https://www.investigasanidad.es'
                target='_blank'
                rel='noopener noreferrer'>
                www.investigasanidad.es
              </a>
              , titularidad de SANIMARON S.L., así como la contratación de los
              servicios ofrecidos en la plataforma.
            </p>
          </li>
          <li>
            <strong>Condiciones de Uso</strong>
            <p>
              El acceso al portal es gratuito, salvo en los casos en que se
              especifique lo contrario. Los usuarios se comprometen a:
            </p>
            <ul className='list-disc list-inside ml-4'>
              <li>
                Hacer un uso adecuado de los contenidos y servicios de la web.
              </li>
              <li>
                No realizar actividades ilícitas, fraudulentas o que puedan
                dañar el funcionamiento del sitio.
              </li>
              <li>
                No introducir virus u otros elementos que puedan alterar o dañar
                sistemas informáticos.
              </li>
            </ul>
          </li>
          <li>
            <strong>Propiedad Intelectual</strong>
            <p>
              Todos los contenidos de la web, incluyendo textos, imágenes,
              logotipos, diseños y software, son propiedad de SANIMARON S.L. o
              de terceros licenciantes. Queda prohibida la reproducción,
              distribución, modificación o uso sin autorización expresa.
            </p>
          </li>
          <li>
            <strong>Exclusión de Responsabilidad</strong>
            <p>
              SANIMARON S.L. no garantiza la disponibilidad continua del sitio
              web ni se hace responsable de:
            </p>
            <ul className='list-disc list-inside ml-4'>
              <li>
                Fallos técnicos, interrupciones del servicio o errores en el
                contenido.
              </li>
              <li>
                Daños o perjuicios derivados del uso de la información contenida
                en la web.
              </li>
              <li>
                Enlaces a terceros, cuyo contenido es ajeno a nuestra
                responsabilidad.
              </li>
            </ul>
          </li>
          <li>
            <strong>Contratación de Servicios</strong>
            <p>
              La contratación de servicios a través de la web está sujeta a las
              siguientes condiciones:
            </p>
            <ul className='list-disc list-inside ml-4'>
              <li>
                El usuario debe ser mayor de edad y proporcionar datos veraces.
              </li>
              <li>
                Los precios y condiciones de los servicios se detallan antes de
                la contratación.
              </li>
              <li>Se podrá requerir pago previo para ciertos servicios.</li>
            </ul>
          </li>
          <li>
            <strong>Modificación de Condiciones</strong>
            <p>
              SANIMARON S.L. se reserva el derecho de modificar estos términos y
              condiciones en cualquier momento. La utilización del sitio tras
              dichas modificaciones implica la aceptación de los nuevos
              términos.
            </p>
          </li>
          <li>
            <strong>Legislación Aplicable y Jurisdicción</strong>
            <p>
              Estas condiciones se rigen por la legislación española. Cualquier
              disputa será resuelta en los tribunales de Murcia.
            </p>
          </li>
        </ol>
        <p className='mt-6'>
          Para cualquier consulta, puede contactarnos a través de{" "}
          <a href='mailto:protecciondedatos@totaldata.es'>
            protecciondedatos@totaldata.es
          </a>
          .
        </p>
      </div>
    </div>
  );
}

// Datos de regiones y provincias (sin cambios)
// ... (código de regionsProvinces sin cambios) ...
const regionsProvinces = {
  Andalucía: [
    "Almería",
    "Cádiz",
    "Córdoba",
    "Granada",
    "Huelva",
    "Jaén",
    "Málaga",
    "Sevilla",
  ],
  Aragón: ["Huesca", "Teruel", "Zaragoza"],
  "Principado de Asturias": ["Asturias"],
  "Islas Baleares": ["Islas Baleares"],
  Canarias: ["Las Palmas", "Santa Cruz de Tenerife"],
  Cantabria: ["Cantabria"],
  "Castilla y León": [
    "Ávila",
    "Burgos",
    "León",
    "Palencia",
    "Salamanca",
    "Segovia",
    "Soria",
    "Valladolid",
    "Zamora",
  ],
  "Castilla-La Mancha": [
    "Albacete",
    "Ciudad Real",
    "Cuenca",
    "Guadalajara",
    "Toledo",
  ],
  Cataluña: ["Barcelona", "Girona", "Lleida", "Tarragona"],
  "Comunidad de Madrid": ["Madrid"],
  "Comunidad Valenciana": ["Alicante", "Castellón", "Valencia"],
  Extremadura: ["Badajoz", "Cáceres"],
  Galicia: ["A Coruña", "Lugo", "Ourense", "Pontevedra"],
  "Región de Murcia": ["Murcia"],
  "Comunidad Foral de Navarra": ["Navarra"],
  "País Vasco": ["Álava", "Guipúzcoa", "Vizcaya"],
  "La Rioja": ["La Rioja"],
  Ceuta: ["Ceuta"],
  Melilla: ["Melilla"],
};

// Tipo para las opciones de categoría profesional
type ProfessionalCategoryOption = {
  id: string;
  nombre: string;
};

const CONFIG_KEY_CATEGORIAS = "professional_categories_simple"; // Clave consistente
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Para el submit final
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [infoAccepted, setInfoAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [deviceIp, setDeviceIp] = useState("");
  const { toast } = useToast();

  // Nuevos estados para categorías profesionales
  const [professionalCategories, setProfessionalCategories] = useState<
    ProfessionalCategoryOption[]
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); // Carga de categorías

  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    professionalCategory: "", // El valor será el 'id' de la categoría
    gender: "",
    address: "",
    interests: "",
    country: "España",
    autonomousCommunity: [] as string[],
  });

  const communityOptions: Option[] = Object.keys(regionsProvinces).map(
    (community) => ({
      value: community,
      label: community,
    })
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setDeviceIp(data.ip))
      .catch((err) => console.error("Error al obtener la IP:", err));
  }, []);

  // useEffect para cargar las categorías profesionales
  useEffect(() => {
    const fetchProfessionalCategories = async () => {
      setIsLoadingCategories(true);
      if (!BASE_API_URL) {
        console.error("URL base de la API no configurada para categorías.");
        toast({
          title: "Error de Configuración",
          description: "No se pudo cargar las categorías profesionales.",
          variant: "destructive",
        });
        setIsLoadingCategories(false);
        return;
      }
      try {
        const response = await fetch(
          `${BASE_API_URL}/config/${CONFIG_KEY_CATEGORIAS}`
        );
        if (response.status === 404) {
          setProfessionalCategories([]); // No hay categorías configuradas
        } else if (response.ok) {
          const setting = await response.json();
          const parsedCategories = (
            JSON.parse(setting.value || "[]") as any[]
          ).map((cat) => ({
            id: cat.id, // Asegúrate que 'id' es el campo correcto
            nombre: cat.nombre, // Asegúrate que 'nombre' es el campo correcto
          }));
          setProfessionalCategories(
            parsedCategories.sort((a, b) => a.nombre.localeCompare(b.nombre))
          ); // Ordenar alfabéticamente
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al cargar categorías del servidor."
          );
        }
      } catch (error: any) {
        console.error("Error fetching professional categories:", error);
        toast({
          title: "Error al cargar categorías",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchProfessionalCategories();
  }, []); // Se ejecuta solo una vez al montar

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  interface HandleChangeEvent
    extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> {}

  const handleChange = (e: HandleChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "country" && value !== "España") {
      setFormData((prev) => ({
        ...prev,
        autonomousCommunity: [],
      }));
    }
  };

  const handleCommunityChange = (selected: string[]) => {
    setFormData((prev) => ({
      ...prev,
      autonomousCommunity: selected,
    }));
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage(""); // Limpiar mensajes de error/éxito de validaciones previas
    setEmailError("");

    if (step === 0) {
      const { id, email, password, confirmPassword } = formData;
      if (!id || !email || !password || !confirmPassword) {
        toast({
          title: "Campos incompletos",
          description: "Por favor, completa todos los campos requeridos.",
          variant: "destructive",
        });
        return;
      }
      if (!validateEmail(email)) {
        setEmailError("Por favor, introduce un email válido.");
        return;
      }
      if (password.length < 6) {
        // Ejemplo de validación de contraseña
        toast({
          title: "Contraseña inválida",
          description: "La contraseña debe tener al menos 6 caracteres.",
          variant: "destructive",
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "Error de contraseña",
          description: "Las contraseñas no coinciden.",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 1) {
      const { firstName, lastName, phone, professionalCategory } = formData;
      if (!firstName || !lastName || !phone || !professionalCategory) {
        toast({
          title: "Campos incompletos",
          description:
            "Por favor, completa todos los campos requeridos en Datos Personales.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage("");
    setStep((prev) => prev - 1);
  };

  interface RegisterRequestBody {
    id: string;
    password: string;
    // confirmPassword: string; // No se envía al backend
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    professionalCategory: string; // Se enviará el ID de la categoría
    gender: string;
    address: string;
    interests: string;
    country: string;
    autonomousCommunity: string[];
    termsAccepted: boolean;
    infoAccepted: boolean;
    deviceIp: string;
  }

  const handleSubmitFinal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(""); // Limpiar mensajes previos
    setIsLoading(true);

    if (formData.country === "España") {
      if (
        !formData.autonomousCommunity ||
        formData.autonomousCommunity.length === 0
      ) {
        toast({
          title: "Campo requerido",
          description: "Por favor, selecciona al menos una Comunidad Autónoma.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }
    if (!termsAccepted) {
      // Mover esta validación aquí, antes del submit
      toast({
        title: "Términos y Condiciones",
        description:
          "Debes aceptar los términos y condiciones para registrarte.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Preparar datos para enviar (sin confirmPassword)
    const { confirmPassword, ...dataToSubmit } = formData;

    try {
      const res = await fetch(`${BASE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataToSubmit,
          termsAccepted,
          infoAccepted,
          deviceIp,
        } as RegisterRequestBody),
      });
      const data: { message?: string } = await res.json(); // Asumir que el backend puede devolver 'message'
      if (res.ok) {
        toast({
          title: "Registro exitoso",
          description:
            data.message || "Revisa tu correo para verificar la cuenta.", // Usar mensaje del backend si existe
        });
        setRegistrationComplete(true);
        setMessage(
          data.message || "Revisa tu correo para verificar la cuenta."
        ); // Para la pantalla de éxito
      } else {
        toast({
          title: "Error al registrar",
          description: data.message || "Ha ocurrido un error inesperado.",
          variant: "destructive",
        });
        setMessage(data.message || "Error en el registro."); // También para el estado general si se reintenta
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error de red",
        description:
          error instanceof Error
            ? error.message
            : "No se ha podido conectar con el servidor.",
        variant: "destructive",
      });
      setMessage("Error de conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationComplete) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-50'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='max-w-md w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl text-center'>
          <div className='w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <CheckCircle className='w-8 h-8 md:w-10 md:h-10 text-purple-600' />
          </div>
          <h1 className='text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-600'>
            ¡Registro completado!
          </h1>
          <p className='text-gray-700 mb-6 font-medium'>{message}</p>{" "}
          {/* Usar el mensaje del estado para consistencia */}
          <p className='text-gray-600 mb-8 text-sm md:text-base'>
            Sigue las instrucciones enviadas a tu correo para activar tu cuenta.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className='w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3'>
            Ir a Iniciar Sesión
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f7ad0040] via-white to-[#52338a40]'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row'>
        <div className='relative md:w-2/5 min-h-[250px] md:min-h-0 bg-gradient-to-br from-purple-900 to-purple-700 flex flex-col items-center justify-center p-8'>
          <Image
            src='/is_white_bg.jpg' // Asegúrate que esta ruta sea correcta desde la carpeta public
            alt='Investiga Sanidad'
            width={300}
            height={75}
            className='w-40 h-auto'
          />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='mt-6 text-center text-white'>
            <h2 className='text-2xl md:text-3xl font-bold mb-4'>
              Crea tu cuenta
            </h2>
            <p className='mb-8 text-white/90 text-sm md:text-base'>
              Completa los pasos para crear tu cuenta y acceder a nuestras
              publicaciones científicas.
            </p>
          </motion.div>
        </div>

        <div className='md:w-3/5 p-6 md:p-8'>
          <div className='flex justify-center mb-6 md:mb-8'>
            <div className='flex space-x-2 md:space-x-4 overflow-x-auto w-full justify-center'>
              <StepIndicator
                stepNumber={1}
                label='Credenciales'
                active={step === 0}
                completed={step > 0}
              />
              <StepIndicator
                stepNumber={2}
                label='Datos Personales'
                active={step === 1}
                completed={step > 1}
              />
              <StepIndicator
                stepNumber={3}
                label='Ubicación y Términos'
                active={step === 2}
                completed={step > 2}
              />
            </div>
          </div>

          <AnimatePresence mode='wait'>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step === 0 ? 0 : 20 }} // Ajustar animación inicial para el primer paso
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}>
              <form
                className='space-y-5'
                onSubmit={
                  step === 2 ? handleSubmitFinal : (e) => e.preventDefault()
                }>
                {" "}
                {/* Prevenir submit en pasos intermedios */}
                {step === 0 && (
                  <>
                    <h2 className='text-xl font-semibold mb-5 text-gray-700'>
                      Paso 1: DNI/NIE/Pasaporte y Acceso
                    </h2>
                    <div className='space-y-2'>
                      <Label htmlFor='id' className='text-gray-700 font-medium'>
                        DNI/NIE/Pasaporte{" "}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='text'
                        id='id'
                        name='id'
                        placeholder='Introduce tu identificador'
                        required
                        value={formData.id}
                        onChange={handleChange}
                        className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='email'
                        className='text-gray-700 font-medium'>
                        Email <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='ejemplo@correo.com'
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm'
                      />
                      {emailError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='mt-1 text-xs text-red-600'>
                          {emailError}
                        </motion.p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='password'
                        className='text-gray-700 font-medium'>
                        Contraseña <span className='text-red-500'>*</span>
                      </Label>
                      <div className='relative'>
                        <Input
                          type={showPassword ? "text" : "password"}
                          id='password'
                          name='password'
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm pr-10'
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1'
                          aria-label='Toggle password visibility'>
                          {showPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='confirmPassword'
                        className='text-gray-700 font-medium'>
                        Repite la contraseña{" "}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <div className='relative'>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          id='confirmPassword'
                          name='confirmPassword'
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm pr-10'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1'
                          aria-label='Toggle confirm password visibility'>
                          {showConfirmPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <h2 className='text-xl font-semibold mb-5 text-gray-700'>
                      Paso 2: Datos Personales
                    </h2>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='firstName'
                        className='text-gray-700 font-medium'>
                        Nombre <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='text'
                        id='firstName'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='lastName'
                        className='text-gray-700 font-medium'>
                        Apellidos <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='text'
                        id='lastName'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='phone'
                        className='text-gray-700 font-medium'>
                        Teléfono (+34) <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='text'
                        id='phone'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder='6XX XXX XXX'
                        required
                        className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm'
                      />
                    </div>
                    {/* Categoría Profesional con datos del backend */}
                    <div className='space-y-2'>
                      <Label
                        htmlFor='professionalCategory'
                        className='text-gray-700 font-medium'>
                        Categoría profesional{" "}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <div className='relative'>
                        <select
                          id='professionalCategory'
                          name='professionalCategory'
                          value={formData.professionalCategory}
                          onChange={handleChange}
                          required
                          disabled={isLoadingCategories} // Deshabilitar mientras carga
                          className='w-full border border-gray-300 rounded-md p-2.5 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 transition-all shadow-sm appearance-none pr-8'>
                          <option value='' disabled={isLoadingCategories}>
                            {isLoadingCategories
                              ? "Cargando categorías..."
                              : "Selecciona tu categoría"}
                          </option>
                          {!isLoadingCategories &&
                            professionalCategories.length === 0 && (
                              <option value='' disabled>
                                No hay categorías disponibles
                              </option>
                            )}
                          {professionalCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {" "}
                              {/* Usar cat.id como value */}
                              {cat.nombre}
                            </option>
                          ))}
                        </select>
                        {isLoadingCategories && (
                          <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-500' />
                        )}
                        {!isLoadingCategories && (
                          <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none' />
                        )}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='gender'
                        className='text-gray-700 font-medium'>
                        Género
                      </Label>
                      <select
                        id='gender'
                        name='gender'
                        value={formData.gender}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2.5 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 transition-all shadow-sm appearance-none pr-8'>
                        <option value=''>Selecciona tu género</option>
                        <option value='M'>Masculino</option>
                        <option value='F'>Femenino</option>
                        <option value='Otro'>Otro</option>
                      </select>
                      <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none' />{" "}
                      {/* Posicionar este icono correctamente si se usa un div relativo en el select */}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <h2 className='text-xl font-semibold mb-5 text-gray-700'>
                      Paso 3: Ubicación y Términos
                    </h2>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='country'
                        className='text-gray-700 font-medium'>
                        País <span className='text-red-500'>*</span>
                      </Label>
                      <select
                        id='country'
                        name='country'
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2.5 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 transition-all shadow-sm appearance-none pr-8'>
                        <option value='España'>España</option>
                        <option value='Otros'>Otros</option>
                      </select>
                      <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none' />
                    </div>
                    {formData.country === "España" && (
                      <div className='space-y-2'>
                        <Label
                          htmlFor='autonomousCommunity'
                          className='text-gray-700 font-medium'>
                          Comunidades Autónomas (elige en las que quieras
                          publicar)
                        </Label>
                        <MultiSelect
                          options={communityOptions}
                          value={formData.autonomousCommunity}
                          onChange={handleCommunityChange}
                          placeholder='Selecciona comunidades autónomas...'
                          searchPlaceholder='Buscar comunidades...'
                        />
                      </div>
                    )}
                    <div className='items-top flex space-x-2 mt-4 pt-2 border-t'>
                      {" "}
                      {/* Alineación y borde superior */}
                      <input
                        type='checkbox'
                        id='termsAccepted'
                        name='termsAccepted'
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className='h-4 w-4 accent-purple-600 mt-1'
                      />
                      <div className='grid gap-1.5 leading-none'>
                        <label
                          htmlFor='termsAccepted'
                          className='text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                          Acepto los{" "}
                          <button
                            type='button'
                            onClick={() => setShowTermsModal(true)}
                            className='text-purple-600 underline hover:text-purple-800'>
                            Términos y Condiciones
                          </button>{" "}
                          <span className='text-red-500'>*</span>
                        </label>
                        {!termsAccepted &&
                          step === 2 && ( // Mostrar solo si no aceptado y en el último paso antes de submit
                            <p className='text-xs text-red-500'>
                              Debes aceptar los términos para continuar.
                            </p>
                          )}
                      </div>
                    </div>
                    <div className='items-top flex space-x-2 mt-3'>
                      <input
                        type='checkbox'
                        id='infoAccepted'
                        name='infoAccepted'
                        checked={infoAccepted}
                        onChange={(e) => setInfoAccepted(e.target.checked)}
                        className='h-4 w-4 accent-purple-600 mt-1'
                      />
                      <label
                        htmlFor='infoAccepted'
                        className='text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                        Acepto el envío de comunicaciones y promociones por
                        parte de Investiga Sanidad
                      </label>
                    </div>
                  </>
                )}
                {message &&
                  !emailError &&
                  step ===
                    0 /* Mostrar mensaje general solo si no hay error de email */ && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='mt-2 text-center text-sm text-red-600 bg-red-50 p-2 rounded-md'>
                      {message}
                    </motion.p>
                  )}
                {message &&
                  step !== 0 /* Mostrar mensaje general en otros pasos */ && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='mt-2 text-center text-sm text-red-600 bg-red-50 p-2 rounded-md'>
                      {message}
                    </motion.p>
                  )}
                <div
                  className={`flex mt-8 ${
                    step === 0 ? "justify-end" : "justify-between"
                  }`}>
                  {step > 0 && (
                    <Button
                      variant='outline'
                      onClick={handleBack}
                      className='border-purple-500 text-purple-700 hover:bg-purple-50/80'>
                      <ArrowLeft className='mr-2 h-4 w-4' /> Anterior
                    </Button>
                  )}
                  {step < 2 && (
                    <Button
                      onClick={handleNext}
                      className='ml-auto bg-gradient-to-r from-purple-600 to-[#52338a] hover:from-purple-700 hover:to-purple-800 text-white'>
                      Siguiente <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  )}
                  {step === 2 && (
                    <Button
                      type='submit'
                      disabled={isLoading || !termsAccepted}
                      className='ml-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white disabled:opacity-70'>
                      {isLoading ? (
                        <span className='flex items-center'>
                          <Loader2 className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' />{" "}
                          Procesando...
                        </span>
                      ) : (
                        <span className='flex items-center'>
                          Finalizar Registro{" "}
                          <UserPlus className='ml-2 h-4 w-4' />
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </form>
              <div className='mt-8 text-center'>
                <p className='text-sm text-gray-600'>
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    href='/login'
                    className='text-purple-600 hover:text-purple-800 font-medium hover:underline'>
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4 backdrop-blur-sm'>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-auto relative max-h-[90vh] flex flex-col'>
              <div className='flex justify-between items-center p-4 border-b'>
                <h2 className='text-lg font-semibold text-gray-800'>
                  Términos y Condiciones
                </h2>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setShowTermsModal(false)}
                  className='text-gray-500 hover:text-gray-800'>
                  <X className='h-5 w-5' />
                </Button>
              </div>
              <div className='overflow-y-auto flex-grow'>
                <Terminos />
              </div>
              <div className='p-4 border-t flex justify-end'>
                <Button
                  onClick={() => {
                    setTermsAccepted(true);
                    setShowTermsModal(false);
                  }}
                  className='bg-purple-600 hover:bg-purple-700 text-white'>
                  Aceptar Términos
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StepIndicatorProps {
  stepNumber: number;
  label: string;
  active: boolean;
  completed: boolean;
}

function StepIndicator({
  stepNumber,
  label,
  active,
  completed,
}: StepIndicatorProps) {
  return (
    <div
      className={`flex flex-col items-center transition-all duration-300 min-w-[80px] sm:min-w-[100px] ${
        active ? "opacity-100" : completed ? "opacity-90" : "opacity-60"
      }`}>
      <div
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 text-sm font-semibold ${
          completed
            ? "bg-purple-600 text-white"
            : active
            ? "border-2 border-purple-600 bg-white text-purple-600"
            : "border-2 border-gray-300 bg-transparent text-gray-400"
        }`}>
        {completed ? (
          <CheckCircle className='w-4 h-4 md:w-5 md:h-5' />
        ) : (
          stepNumber
        )}
      </div>
      <span
        className={`text-xs text-center md:text-sm font-medium mt-1.5 ${
          active
            ? "text-purple-700"
            : completed
            ? "text-purple-600"
            : "text-gray-500"
        }`}>
        {label}
      </span>
    </div>
  );
}
