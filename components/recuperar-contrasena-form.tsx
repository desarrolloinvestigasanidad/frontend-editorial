"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface Props {
  onSuccess: () => void;
}

export default function RecuperarContrasenaForm({ onSuccess }: Props) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  // Estado de envío de correo
  const [identifier, setIdentifier] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de restablecer
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [success, setSuccess] = useState(false);

  // 1) Solo envío de correo
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: identifier }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al solicitar recuperación.");
      setIsSubmitted(true);
      // **No** llamamos a onSuccess aquí, porque aún no hemos cambiado contraseña
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 2) Restablecimiento de contraseña
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al restablecer la contraseña.");
      setSuccess(true);
      onSuccess(); // <-- aquí sí disparamos el botón
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Si tenemos token, mostramos el flow de restablecer
  if (token) {
    if (success) {
      return (
        <Alert>
          <CheckCircle2 className='h-4 w-4' />
          <AlertTitle>¡Contraseña actualizada!</AlertTitle>
          <AlertDescription>
            Tu contraseña ha sido restablecida correctamente. Ahora puedes
            iniciar sesión.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <form onSubmit={handleResetSubmit} className='space-y-4 max-w-md mx-auto'>
        {error && <p className='text-red-600'>{error}</p>}
        <div>
          <Label htmlFor='newPassword'>Nueva Contraseña</Label>
          <Input
            type='password'
            id='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor='confirmNewPassword'>Confirmar Nueva Contraseña</Label>
          <Input
            type='password'
            id='confirmNewPassword'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <Button type='submit' className='w-full'>
          Restablecer
        </Button>
      </form>
    );
  }

  // Si ya enviamos el correo, mostramos alerta pero sin disparar onSuccess
  if (isSubmitted) {
    return (
      <Alert>
        <CheckCircle2 className='h-4 w-4' />
        <AlertTitle>Correo enviado</AlertTitle>
        <AlertDescription>
          Se ha enviado un correo con las instrucciones para recuperar tu
          contraseña. Revisa tu bandeja de entrada.
        </AlertDescription>
      </Alert>
    );
  }

  // Paso inicial: pedir identificador
  return (
    <form
      onSubmit={handleRecoverySubmit}
      className='space-y-4 max-w-md mx-auto'>
      {error && <p className='text-red-600'>{error}</p>}
      <div>
        <Label htmlFor='identifier'>DNI/PASAPORTE/NIE</Label>
        <Input
          type='text'
          id='identifier'
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>
      <Button type='submit' className='w-full'>
        Enviar correo de recuperación
      </Button>
    </form>
  );
}
