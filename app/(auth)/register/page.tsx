"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Terminos from "@/components/terminos";

// TODAS las comunidades y provincias
const regionsProvinces: { [key: string]: string[] } = {
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
  const [showTermsModal, setShowTermsModal] = useState(false);

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
    autonomousCommunity: "",
    province: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "country" && value !== "España") {
      setFormData((prev) => ({
        ...prev,
        autonomousCommunity: "",
        province: "",
      }));
    }
  };

  const handleNext = (e: React.FormEvent) => {
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

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setStep((prev) => prev - 1);
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (formData.country === "España") {
      if (!formData.autonomousCommunity || !formData.province) {
        setMessage("Por favor, selecciona tu comunidad y provincia.");
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Se envía infoAccepted igual a termsAccepted
        body: JSON.stringify({
          ...formData,
          termsAccepted,
          infoAccepted: termsAccepted,
        }),
      });
      const data = await res.json();
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
        {/* Columna izquierda: Imagen y overlay */}
        <div className='relative md:w-2/5 min-h-[250px] md:min-h-0 bg-gradient-to-br from-purple-900 to-purple-700'>
          <Image
            src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
            alt='Investiga Sanidad'
            width={300}
            height={75}
            className='absolute top-8 left-1/2 -translate-x-1/2 z-20 w-40 h-auto'
          />
          <Image
            src='https://images.pexels.com/photos/8376232/pexels-photo-8376232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt='Registro en congresos médicos'
            fill
            className='object-cover absolute inset-0 mix-blend-overlay opacity-60'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-purple-900/90 to-purple-700/90 z-10'></div>
          <div className='relative z-20 p-6 md:p-8 h-full flex flex-col justify-center mt-16'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}>
              <h2 className='text-2xl md:text-3xl font-bold text-white mb-4'>
                Crea tu cuenta
              </h2>
              <p className='mb-8 text-white/90 text-sm md:text-base'>
                Completa los pasos para crear tu cuenta y acceder a nuestras
                publicaciones científicas.
              </p>
            </motion.div>
          </div>
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
              <form className='space-y-5'>
                {step === 0 && (
                  <>
                    <h2 className='text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-600'>
                      Paso 1: DNI/NIE/Pasaporte
                    </h2>
                    {/* Identificador */}
                    <div className='space-y-2'>
                      <Label htmlFor='id' className='text-gray-700 font-medium'>
                        Identificador <span className='text-red-500'>*</span>
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
                        Apellido <span className='text-red-500'>*</span>
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
                    {formData.country === "España" && (
                      <>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='autonomousCommunity'
                            className='text-gray-700 font-medium'>
                            Comunidad Autónoma{" "}
                            <span className='text-red-500'>*</span>
                          </Label>
                          <select
                            id='autonomousCommunity'
                            name='autonomousCommunity'
                            required
                            value={formData.autonomousCommunity}
                            onChange={handleChange}
                            className='w-full border border-gray-200 rounded-md p-2 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all'>
                            <option value=''>Selecciona una comunidad</option>
                            {Object.keys(regionsProvinces).map((comunidad) => (
                              <option key={comunidad} value={comunidad}>
                                {comunidad}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.autonomousCommunity && (
                          <div className='space-y-2'>
                            <Label
                              htmlFor='province'
                              className='text-gray-700 font-medium'>
                              Provincia <span className='text-red-500'>*</span>
                            </Label>
                            <select
                              id='province'
                              name='province'
                              required
                              value={formData.province}
                              onChange={handleChange}
                              className='w-full border border-gray-200 rounded-md p-2 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all'>
                              <option value=''>Selecciona una provincia</option>
                              {regionsProvinces[
                                formData.autonomousCommunity
                              ]?.map((prov) => (
                                <option key={prov} value={prov}>
                                  {prov}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </>
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
                      onClick={handleSubmitFinal}
                      disabled={isLoading || !termsAccepted}
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
function StepIndicator({
  stepNumber,
  label,
  active,
  completed,
}: {
  stepNumber: number;
  label: string;
  active: boolean;
  completed?: boolean;
}) {
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
