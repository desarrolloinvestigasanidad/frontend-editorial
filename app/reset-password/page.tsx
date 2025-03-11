import { Suspense } from "react";
import dynamic from "next/dynamic";

const RecuperarContrasenaForm = dynamic(
  () => import("@/components/recuperar-contrasena-form"),
  {
    ssr: false,
    loading: () => <p>Loading password reset form...</p>,
  }
);

export default function RecuperarContrasenaPage() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <h1 className='text-3xl font-bold text-center mb-8'>
        Recuperar Contraseña
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RecuperarContrasenaForm />
      </Suspense>
    </div>
  );
}
