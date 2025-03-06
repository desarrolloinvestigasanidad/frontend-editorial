"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Ejemplo de mapeo para comunidades autónomas y provincias en España
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
  Cataluña: ["Barcelona", "Girona", "Lleida", "Tarragona"],
  Madrid: ["Madrid"],
  // Agrega el resto de las comunidades y provincias que necesites
};

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    category: "",
    country: "España",
    region: "",
    province: "",
  });
  const [selectedCountry, setSelectedCountry] = useState("España");
  const [message, setMessage] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setRegistrationComplete(false);
  };

  interface FormData {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    category: string;
    country: string;
    region: string;
    province: string;
  }

  interface ChangeEvent {
    target: {
      name: string;
      value: string;
    };
  }

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));

    if (name === "country") {
      setSelectedCountry(value);
      // Si no es España, reseteamos region y province
      if (value !== "España") {
        setFormData((prev: FormData) => ({
          ...prev,
          region: "",
          province: "",
        }));
      }
    }
  };

  interface SubmitEvent {
    preventDefault: () => void;
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Lógica de inicio de sesión
      try {
        const res: Response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: formData.id,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          // Guardamos el token en localStorage
          localStorage.setItem("token", data.token);
          // Redirigimos al perfil (o a donde quieras)
          window.location.href = "/profile";
        } else {
          setMessage(data.message || "Error al iniciar sesión.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Error al iniciar sesión.");
      }
    } else {
      // Lógica de registro
      try {
        const res: Response = await fetch(
          "http://localhost:5000/api/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const data: { message: string } = await res.json();

        if (res.ok) {
          setMessage(
            "Se ha enviado un correo a tu email para verificar la cuenta."
          );
          setRegistrationComplete(true);
        } else {
          setMessage(data.message);
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
        setMessage("Error al registrar el usuario.");
      }
    }
  };

  return (
    <div className='max-w-md mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>
        {isLogin ? "Iniciar sesión" : "Registro"}
      </h2>

      {/* Si estamos en registro y ya se completó el registro, ocultamos el formulario */}
      {(!registrationComplete || isLogin) && (
        <form className='space-y-4' onSubmit={handleSubmit}>
          {/* Campo de identificador */}
          <div>
            <Label htmlFor='id'>DNI/PASAPORTE/NIE</Label>
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

          {/* Contraseña */}
          <div>
            <Label htmlFor='password'>Contraseña</Label>
            <Input
              type='password'
              id='password'
              name='password'
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <>
              {/* Email */}
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='tu@email.com'
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {/* Nombre */}
              <div>
                <Label htmlFor='firstName'>Nombre</Label>
                <Input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              {/* Apellido */}
              <div>
                <Label htmlFor='lastName'>Apellido</Label>
                <Input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              {/* Teléfono */}
              <div>
                <Label htmlFor='phone'>Teléfono</Label>
                <Input
                  type='text'
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {/* Categoría */}
              <div>
                <Label htmlFor='category'>Categoría</Label>
                <Input
                  type='text'
                  id='category'
                  name='category'
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              {/* País */}
              <div>
                <Label htmlFor='country'>País</Label>
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
              {selectedCountry === "España" && (
                <>
                  <div>
                    <Label htmlFor='region'>Comunidad Autónoma</Label>
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
                      <Label htmlFor='province'>Provincia</Label>
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

          <Button type='submit' className='w-full'>
            {isLogin ? "Iniciar sesión" : "Registrarse"}
          </Button>
        </form>
      )}

      {message && <p className='mt-4 text-center text-green-600'>{message}</p>}

      {isLogin && (
        <div className='mt-4 text-center'>
          <Link href='/reset-password' className='text-primary hover:underline'>
            He olvidado mi contraseña
          </Link>
        </div>
      )}
      <p className='mt-4 text-center'>
        {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
        <button
          onClick={toggleForm}
          className='ml-2 text-primary hover:underline'>
          {isLogin ? "Regístrate" : "Inicia sesión"}
        </button>
      </p>
    </div>
  );
}
