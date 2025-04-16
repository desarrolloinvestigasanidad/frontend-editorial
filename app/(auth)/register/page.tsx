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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Componente MultiSelect
export type Option = {
  value: string;
  label: string;
};

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

  // Filtrar opciones basadas en el término de búsqueda
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar clic fuera para cerrar el dropdown
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

  // Enfocar el input de búsqueda cuando se abre el dropdown
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Alternar selección de una opción
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((val) => val !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  // Remover una opción seleccionada
  const removeOption = (
    e: React.MouseEvent<HTMLButtonElement>,
    optionValue: string
  ) => {
    e.stopPropagation();
    onChange(value.filter((val) => val !== optionValue));
  };

  // Obtener etiquetas para las opciones seleccionadas
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
      {/* Botón principal que muestra las selecciones actuales */}
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

      {/* Dropdown con opciones */}
      {isOpen && (
        <div className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg'>
          {/* Barra de búsqueda */}
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

          {/* Lista de opciones */}
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
function Terminos() {
  return (
    <div className='max-h-[70vh] overflow-y-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>Términos y Condiciones</h2>
      <div className='prose prose-sm'>
        <p>
          Estos Términos y Condiciones regulan la relación entre Investiga
          Sanidad y los usuarios de la plataforma.
        </p>
        {/* Contenido de los términos y condiciones */}
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis
          aliquam nisl nunc quis nisl.
        </p>
        <h3>1. Registro y Cuenta</h3>
        <p>
          Al registrarse en nuestra plataforma, usted acepta proporcionar
          información precisa y completa. Es responsable de mantener la
          confidencialidad de su cuenta y contraseña.
        </p>
        <h3>2. Privacidad</h3>
        <p>
          Su privacidad es importante para nosotros. Consulte nuestra Política
          de Privacidad para entender cómo recopilamos y utilizamos su
          información.
        </p>
        <h3>3. Propiedad Intelectual</h3>
        <p>
          Todo el contenido disponible en la plataforma está protegido por
          derechos de autor y otras leyes de propiedad intelectual.
        </p>
        <h3>4. Limitación de Responsabilidad</h3>
        <p>
          No seremos responsables por daños indirectos, incidentales, especiales
          o consecuentes que resulten del uso de nuestra plataforma.
        </p>
        <h3>5. Modificaciones</h3>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier
          momento. Las modificaciones entrarán en vigor inmediatamente después
          de su publicación.
        </p>
      </div>
    </div>
  );
}

// TODAS las comunidades (se usan para vincular los certificados)
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

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [infoAccepted, setInfoAccepted] = useState(false); // Consentimiento para comunicaciones
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [deviceIp, setDeviceIp] = useState("");

  // Se elimina "province" ya que se solicitará en facturación
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    professionalCategory: "",
    gender: "",
    address: "",
    interests: "",
    country: "España",
    // Ahora es un array para permitir la selección múltiple
    autonomousCommunity: [] as string[],
  });

  // Convertir regionsProvinces a opciones para MultiSelect
  const communityOptions: Option[] = Object.keys(regionsProvinces).map(
    (community) => ({
      value: community,
      label: community,
    })
  );

  // Redirigir al usuario si ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  // Obtener la IP del dispositivo usando ipify
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setDeviceIp(data.ip))
      .catch((err) => console.error("Error al obtener la IP:", err));
  }, []);

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

  // Función para manejar el cambio en el MultiSelect de comunidades
  const handleCommunityChange = (selected: string[]) => {
    setFormData((prev) => ({
      ...prev,
      autonomousCommunity: selected,
    }));
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage("");
    setEmailError("");

    if (step === 0) {
      const { id, email, password, confirmPassword } = formData;
      if (!id || !email || !password || !confirmPassword) {
        setMessage("Por favor, completa todos los campos requeridos");
        return;
      }
      if (!validateEmail(email)) {
        setEmailError("Por favor, introduce un email válido.");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("Las contraseñas no coinciden.");
        return;
      }
    } else if (step === 1) {
      const { firstName, lastName, phone, professionalCategory } = formData;
      if (!firstName || !lastName || !phone || !professionalCategory) {
        setMessage(
          "Por favor, completa todos los campos requeridos en Datos Personales."
        );
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

  interface HandleSubmitFinalEvent extends React.FormEvent<HTMLFormElement> {}

  interface RegisterRequestBody {
    id: string;
    password: string;
    confirmPassword: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    professionalCategory: string;
    gender: string;
    address: string;
    interests: string;
    country: string;
    autonomousCommunity: string[];
    termsAccepted: boolean;
    infoAccepted: boolean;
    deviceIp: string;
  }

  const handleSubmitFinal = async (e: HandleSubmitFinalEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Validación: si el país es España se requiere seleccionar al menos una comunidad
    if (formData.country === "España") {
      if (
        !formData.autonomousCommunity ||
        formData.autonomousCommunity.length === 0
      ) {
        setMessage("Por favor, selecciona al menos una Comunidad Autónoma.");
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          termsAccepted,
          infoAccepted,
          deviceIp,
        } as RegisterRequestBody),
      });
      const data: { message?: string } = await res.json();
      if (res.ok) {
        setMessage(
          "Se ha enviado un correo a tu email para verificar la cuenta."
        );
        setRegistrationComplete(true);
      } else {
        setMessage(data.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al registrar el usuario.");
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
          <p className='text-green-600 mb-6 font-medium'>{message}</p>
          <p className='text-gray-600 mb-8 text-sm md:text-base'>
            Te hemos enviado un correo de verificación. Por favor, revisa tu
            bandeja de entrada y sigue las instrucciones para activar tu cuenta.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className='bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'>
            Ir a iniciar sesión
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-50'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row'>
        {/* Columna izquierda: Solo logo e información sin foto de fondo */}
        <div className='relative md:w-2/5 min-h-[250px] md:min-h-0 bg-gradient-to-br from-purple-900 to-purple-700 flex flex-col items-center justify-center p-8'>
          <Image
            src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
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

        {/* Columna derecha: Formulario */}
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}>
              <form className='space-y-5' onSubmit={handleSubmitFinal}>
                {step === 0 && (
                  <>
                    <h2 className='text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-600'>
                      Paso 1: DNI/NIE/Pasaporte
                    </h2>
                    {/* Identificador */}
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
                        className='bg-white border-gray-200 focus:border-purple-500 transition-all'
                      />
                    </div>
                    {/* Email */}
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
                        className='bg-white border-gray-200 focus:border-purple-500 transition-all'
                      />
                      {emailError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='mt-1 text-sm text-red-600'>
                          {emailError}
                        </motion.p>
                      )}
                    </div>
                    {/* Password */}
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
                          className='bg-white border-gray-200 focus:border-purple-500 transition-all pr-10'
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                          aria-label='Toggle password visibility'>
                          {showPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Confirm Password */}
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
                          className='bg-white border-gray-200 focus:border-purple-500 transition-all pr-10'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
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
                    <h2 className='text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-600'>
                      Paso 2: Datos Personales
                    </h2>
                    {/* Nombre */}
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
                        className='bg-white border-gray-200 focus:border-purple-500 transition-all'
                      />
                    </div>
                    {/* Apellido */}
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
                        className='bg-white border-gray-200 focus:border-purple-500 transition-all'
                      />
                    </div>
                    {/* Teléfono */}
                    <div className='space-y-2'>
                      <Label
                        htmlFor='phone'
                        className='text-gray-700 font-medium'>
                        Teléfono <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='text'
                        id='phone'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className='bg-white border-gray-200 focus:border-purple-500 transition-all'
                      />
                    </div>
                    {/* Categoría Profesional */}
                    <div className='space-y-2'>
                      <Label
                        htmlFor='professionalCategory'
                        className='text-gray-700 font-medium'>
                        Categoría profesional{" "}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <select
                        id='professionalCategory'
                        name='professionalCategory'
                        value={formData.professionalCategory}
                        onChange={handleChange}
                        required
                        className='w-full border border-gray-200 rounded-md p-2 bg-white focus:border-purple-500 transition-all'>
                        <option value=''>
                          Selecciona tu categoría profesional
                        </option>
                        <option value='medico'>Médico</option>
                        <option value='enfermero'>Enfermero</option>
                        <option value='farmaceutico'>Farmacéutico</option>
                        <option value='dentista'>Dentista</option>
                        <option value='fisioterapeuta'>Fisioterapeuta</option>
                        <option value='tecnico_lab'>
                          Técnico de laboratorio
                        </option>
                        <option value='auxiliar_enfermeria'>
                          Auxiliar de enfermería
                        </option>
                        <option value='otro'>Otro</option>
                      </select>
                    </div>
                    {/* Género */}
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
                        className='w-full border border-gray-200 rounded-md p-2 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all'>
                        <option value=''>Selecciona tu género</option>
                        <option value='M'>Masculino</option>
                        <option value='F'>Femenino</option>
                        <option value='Otro'>Otro</option>
                      </select>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className='text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-600'>
                      Paso 3: Ubicación y Términos
                    </h2>
                    {/* País */}
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
                        className='w-full border border-gray-200 rounded-md p-2 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all'>
                        <option value='España'>España</option>
                        <option value='Otros'>Otros</option>
                      </select>
                    </div>
                    {/* Selección múltiple de Comunidades Autónomas con MultiSelect */}
                    {formData.country === "España" && (
                      <div className='space-y-2'>
                        <Label
                          htmlFor='autonomousCommunity'
                          className='text-gray-700 font-medium'>
                          Comunidades Autónomas (elige una o más)
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
                    {/* Términos y Condiciones */}
                    <div className='flex items-center space-x-2 mt-4'>
                      <input
                        type='checkbox'
                        id='termsAccepted'
                        name='termsAccepted'
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className='h-4 w-4'
                      />
                      <label
                        htmlFor='termsAccepted'
                        className='text-sm text-gray-700'>
                        Acepto los{" "}
                        <button
                          type='button'
                          onClick={() => setShowTermsModal(true)}
                          className='text-purple-600 underline'>
                          Términos y Condiciones
                        </button>
                      </label>
                    </div>
                    {/* Consentimiento para comunicaciones (infoAccepted) */}
                    <div className='flex items-center space-x-2 mt-4'>
                      <input
                        type='checkbox'
                        id='infoAccepted'
                        name='infoAccepted'
                        checked={infoAccepted}
                        onChange={(e) => setInfoAccepted(e.target.checked)}
                        className='h-4 w-4'
                      />
                      <label
                        htmlFor='infoAccepted'
                        className='text-sm text-gray-700'>
                        Acepto el envío de comunicaciones y el registro de la IP
                        de mi dispositivo.
                      </label>
                    </div>
                  </>
                )}

                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center text-red-600 bg-red-50 p-2 rounded-md'>
                    {message}
                  </motion.p>
                )}

                <div className='flex justify-between mt-8'>
                  {step > 0 && (
                    <Button
                      variant='outline'
                      onClick={handleBack}
                      className='border-purple-500 text-purple-700 hover:bg-purple-50'>
                      <ArrowLeft className='mr-2 h-4 w-4' />
                      Anterior
                    </Button>
                  )}
                  {step < 2 && (
                    <Button
                      onClick={handleNext}
                      className='ml-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'>
                      Siguiente
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  )}
                  {step === 2 && (
                    <Button
                      type='submit'
                      disabled={isLoading || !termsAccepted || !infoAccepted}
                      className='ml-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'>
                      {isLoading ? (
                        <span className='flex items-center'>
                          <svg
                            className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'>
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                          </svg>
                          Procesando...
                        </span>
                      ) : (
                        <span className='flex items-center'>
                          Finalizar
                          <UserPlus className='ml-2 h-4 w-4' />
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </form>
              <div className='mt-8 text-center'>
                <p className='text-gray-600'>
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
            className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white rounded-lg p-6 max-w-3xl mx-auto relative'>
              <button
                onClick={() => setShowTermsModal(false)}
                className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'>
                Cerrar
              </button>
              <Terminos />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente StepIndicator
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
      className={`flex flex-col items-center transition-all duration-300 ${
        active ? "opacity-100" : completed ? "opacity-90" : "opacity-60"
      }`}>
      <div
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
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
        className={`text-xs md:text-sm font-medium mt-1 ${
          active
            ? "text-purple-900"
            : completed
            ? "text-purple-700"
            : "text-gray-500"
        }`}>
        {label}
      </span>
    </div>
  );
}
