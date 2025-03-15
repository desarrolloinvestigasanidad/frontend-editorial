import React from "react";
import CongresosCard from "@/components/CongresosCard";
import { Button } from "@/components/ui/button";

const congresos = [
  {
    titulo: "I Congreso de Avances y Tendencias en Sanidad (CATS)",
    fecha: "24 y 25 de septiembre",
    fechaLimiteEnvio: "1 de septiembre",
    entregaCertificados: "25 de septiembre",
    webCongreso: "https://congresosanidad.es",
    plataforma: "https://plataformacongresosanidad.es",
    imagen:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2940&auto=format&fit=crop",
    tarifas: [
      { precio: "50€", fechaLimite: "15 de julio" },
      { precio: "60€", fechaLimite: "15 de agosto" },
      { precio: "80€", fechaLimite: "1 de septiembre" },
    ],
  },
  {
    titulo: "I Congreso de Investigación Sanitaria (CIS)",
    fecha: "28 y 29 de octubre",
    fechaLimiteEnvio: "1 de octubre",
    entregaCertificados: "29 de octubre",
    webCongreso: "https://congresoinvestigacionsanitaria.es",
    plataforma: "https://plataformacongresoinvestigacionsanitaria.es",
    imagen:
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=2940&auto=format&fit=crop",
    tarifas: [
      { precio: "50€", fechaLimite: "15 de julio" },
      { precio: "60€", fechaLimite: "15 de agosto" },
      { precio: "80€", fechaLimite: "25 de septiembre" },
    ],
  },
];

export default function CongresosPage() {
  return (
    <section className='py-16'>
      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-bold text-center mb-8'>Congresos</h1>

        <CongresosCard congresos={congresos} />

        {/* Pack Especial – Miembro del Comité */}
        <div className='bg-white p-6 rounded-lg shadow mt-8'>
          <h2 className='text-xl font-bold mb-2'>
            Pack Especial – Miembro del Comité
          </h2>
          <p className='mb-4'>
            Aprovecha un precio especial si deseas participar como miembro del
            Comité Científico:
          </p>
          <ul className='list-disc list-inside pl-2'>
            <li>Pack 2 Congresos: 65€</li>
            <li>
              Si ya estás inscrito en uno de los congresos, precio especial: 55€
              (te proporcionaremos un cupón)
            </li>
          </ul>
          <div className='mt-6'>
            <Button>Solicitar ser parte del Comité Científico</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
