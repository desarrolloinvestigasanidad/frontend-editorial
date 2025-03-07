"use client";

import React, { useState } from "react";
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

  // Manejar cambios de campo
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Si cambia el país a != España, limpiamos region/province
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
    setMessage(""); // Limpia mensaje de error

    // Validar según paso actual
    if (step === 0) {
      // Paso 1: Credenciales
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
      // Paso 2: Datos personales
      const { firstName, lastName, phone, category } = formData;
      if (!firstName || !lastName || !phone || !category) {
        setMessage("Por favor, completa todos los campos requeridos.");
        return;
      }
    }
    // Si no hay error en los campos, avanza
    setStep((prev) => prev + 1);
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setStep((prev) => prev - 1);
  };

  // Enviar datos al servidor (final)
  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Validación final de ubicación
    if (formData.country === "España") {
      if (!formData.region || !formData.province) {
        setMessage("Por favor, selecciona tu comunidad y provincia.");
        return;
      }
    }

    try {
      const res: Response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
    }
  };

  // Mostrar mensaje final si registro completado
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

  // Renderizado condicional por pasos
  return (
    <div className='container mx-auto px-4 py-8 max-w-md'>
      <h1 className='text-3xl font-bold text-center mb-8'>Registro</h1>

      <form className='space-y-4'>
        {/* Título de cada paso */}
        {step === 0 && (
          <h2 className='text-xl font-semibold mb-2'>Paso 1: Credenciales</h2>
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
                className='absolute right-2 top-8 text-gray-500'
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
              <Label htmlFor='confirmPassword'>Repite la contraseña *</Label>
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
                className='absolute right-2 top-8 text-gray-500'
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

            {/* Si se elige España, mostrar región y provincia */}
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

        {/* Mensaje de error (si lo hubiera) */}
        {message && <p className='text-center text-red-500'>{message}</p>}

        {/* Botones de navegación */}
        <div className='flex justify-between mt-6'>
          {/* Botón Anterior (solo si step > 0) */}
          {step > 0 && (
            <Button variant='outline' onClick={handleBack}>
              Anterior
            </Button>
          )}

          {/* Botón Siguiente (solo si step < 2) */}
          {step < 2 && <Button onClick={handleNext}>Siguiente</Button>}

          {/* Botón Finalizar (solo en el último paso) */}
          {step === 2 && <Button onClick={handleSubmitFinal}>Finalizar</Button>}
        </div>
      </form>

      <p className='mt-4 text-center'>
        ¿Ya tienes una cuenta?{" "}
        <a href='/login' className='ml-2 text-primary hover:underline'>
          Inicia sesión
        </a>
      </p>
    </div>
  );
}
