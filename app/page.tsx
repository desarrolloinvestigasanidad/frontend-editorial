import Hero from "@/components/hero";
import Features from "@/components/features";
import PublicationTypes from "@/components/publication-types";
import Pricing from "@/components/pricing";
import UpcomingEditions from "@/components/upcoming-editions";
import Contact from "@/components/contact";
import CongresosCard from "@/components/CongresosCard";

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
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <PublicationTypes />
      <Pricing />
      <CongresosCard congresos={congresos} />
      <UpcomingEditions />
      <Contact />
    </>
  );
}
