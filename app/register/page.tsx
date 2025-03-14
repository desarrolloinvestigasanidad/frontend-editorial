"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

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
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [message, setMessage] = useState("");

  // Datos del formulario
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    category: "",
    country: "España",
    region: "",
    province: "",
  });

  // Estado para el paso actual (0, 1, 2)
  const [step, setStep] = useState(0);

  // Estados para mostrar u ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Manejo de cambios
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Si cambia el país y no es España, se vacían region/province
    if (name === "country" && value !== "España") {
      setFormData((prev) => ({
        ...prev,
        region: "",
        province: "",
      }));
    }
  };

  // Validación y navegación de pasos
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (step === 0) {
      // Validar credenciales
      const { id, password, confirmPassword, email } = formData;
      if (!id || !email || !password || !confirmPassword) {
        setMessage("Por favor, completa todos los campos requeridos.");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("Las contraseñas no coinciden.");
        return;
      }
    } else if (step === 1) {
      // Validar datos personales
      const { firstName, lastName, phone, category } = formData;
      if (!firstName || !lastName || !phone || !category) {
        setMessage("Por favor, completa todos los campos requeridos.");
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

  // Manejar envío final
  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Validar ubicacion
    if (formData.country === "España") {
      if (!formData.region || !formData.province) {
        setMessage("Por favor, selecciona tu comunidad y provincia.");
        return;
      }
    }

    try {
      const res: Response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

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
    }
  };

  // Si ya se completó el registro
  if (registrationComplete) {
    return (
      <div className='container mx-auto px-4 py-8 max-w-md text-center'>
        <h1 className='text-3xl font-bold mb-4'>¡Registro completado!</h1>
        <p className='text-green-600 mb-6'>{message}</p>
        <p>
          Te hemos enviado un correo de verificación. Por favor, revisa tu
          bandeja de entrada y sigue las instrucciones para activar tu cuenta.
        </p>
      </div>
    );
  }

  // Render del multi-step con layout
  return (
    <div className='min-h-[70vh] flex items-center justify-center p-4 bg-gray-50'>
      {/* Contenedor principal con dos columnas */}
      <div className='bg-white w-3/5 h-full shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row'>
        {/* Columna izquierda: Imagen + Steps */}
        <div className='relative md:w-1/3 bg-blue-900 text-white flex flex-col p-8'>
          {/* Imagen de fondo */}
          <Image
            src='https://images.pexels.com/photos/8376232/pexels-photo-8376232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt='Registro en congresos médicos'
            fill
            className='object-cover absolute inset-0 opacity-30'
          />

          {/* Contenido overlay */}
          <div className='relative z-10 mt-10'>
            <h2 className='text-2xl font-bold mb-4'>Regístrate</h2>
            <p className='mb-8'>
              Completa los pasos para crear tu cuenta y acceder a nuestros
              congresos.
            </p>
            <div className='space-y-4'>
              {/* Indicadores de pasos */}
              <StepIndicator
                stepNumber={1}
                label='Credenciales'
                active={step === 0}
              />
              <StepIndicator
                stepNumber={2}
                label='Datos Personales'
                active={step === 1}
              />
              <StepIndicator
                stepNumber={3}
                label='Ubicación'
                active={step === 2}
              />
            </div>
          </div>
        </div>

        {/* Columna derecha: Formulario */}
        <div className='md:w-2/3 p-8'>
          <form className='space-y-4'>
            {/* Título del paso */}
            {step === 0 && (
              <h2 className='text-xl font-semibold mb-2'>
                Paso 1: Credenciales
              </h2>
            )}
            {step === 1 && (
              <h2 className='text-xl font-semibold mb-2'>
                Paso 2: Datos Personales
              </h2>
            )}
            {step === 2 && (
              <h2 className='text-xl font-semibold mb-2'>Paso 3: Ubicación</h2>
            )}

            {/* Paso 0: Credenciales */}
            {step === 0 && (
              <>
                <div>
                  <Label htmlFor='id'>DNI/PASAPORTE/NIE *</Label>
                  <Input
                    type='text'
                    id='id'
                    name='id'
                    placeholder='Introduce tu identificador'
                    required
                    value={formData.id}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor='email'>Email *</Label>
                  <Input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='ejemplo@correo.com'
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Password con icono de ojo */}
                <div className='relative'>
                  <Label htmlFor='password'>Contraseña *</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id='password'
                    name='password'
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-2 top-9 text-gray-500'
                    aria-label='Toggle password visibility'>
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>

                {/* Confirm Password con icono de ojo */}
                <div className='relative'>
                  <Label htmlFor='confirmPassword'>
                    Repite la contraseña *
                  </Label>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id='confirmPassword'
                    name='confirmPassword'
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-2 top-9 text-gray-500'
                    aria-label='Toggle confirm password visibility'>
                    {showConfirmPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Paso 1: Datos Personales */}
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor='firstName'>Nombre *</Label>
                  <Input
                    type='text'
                    id='firstName'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='lastName'>Apellido *</Label>
                  <Input
                    type='text'
                    id='lastName'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='phone'>Teléfono *</Label>
                  <Input
                    type='text'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='category'>Categoría *</Label>
                  <Input
                    type='text'
                    id='category'
                    name='category'
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* Paso 2: Ubicación */}
            {step === 2 && (
              <>
                <div>
                  <Label htmlFor='country'>País *</Label>
                  <select
                    id='country'
                    name='country'
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className='w-full border rounded p-2'>
                    <option value='España'>España</option>
                    <option value='Otros'>Otros</option>
                  </select>
                </div>

                {formData.country === "España" && (
                  <>
                    <div>
                      <Label htmlFor='region'>Comunidad Autónoma *</Label>
                      <select
                        id='region'
                        name='region'
                        required
                        value={formData.region}
                        onChange={handleChange}
                        className='w-full border rounded p-2'>
                        <option value=''>Selecciona una comunidad</option>
                        {Object.keys(regionsProvinces).map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.region && (
                      <div>
                        <Label htmlFor='province'>Provincia *</Label>
                        <select
                          id='province'
                          name='province'
                          required
                          value={formData.province}
                          onChange={handleChange}
                          className='w-full border rounded p-2'>
                          <option value=''>Selecciona una provincia</option>
                          {regionsProvinces[formData.region].map((prov) => (
                            <option key={prov} value={prov}>
                              {prov}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Mensaje de error */}
            {message && <p className='text-center text-red-500'>{message}</p>}

            {/* Botones de navegación */}
            <div className='flex justify-between mt-6'>
              {step > 0 && (
                <Button variant='outline' onClick={handleBack}>
                  Anterior
                </Button>
              )}
              {step < 2 && <Button onClick={handleNext}>Siguiente</Button>}
              {step === 2 && (
                <Button onClick={handleSubmitFinal}>Finalizar</Button>
              )}
            </div>
          </form>

          <p className='mt-4 text-center'>
            ¿Ya tienes una cuenta?{" "}
            <a href='/login' className='ml-2 text-primary hover:underline'>
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/** Componente simple para marcar cada step en el panel izquierdo */
function StepIndicator({
  stepNumber,
  label,
  active,
}: {
  stepNumber: number;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${
        active ? "opacity-100" : "opacity-60"
      }`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
          active ? "border-white" : "border-white/60"
        }`}>
        {stepNumber}
      </div>
      <span className='text-sm'>{label}</span>
    </div>
  );
}
