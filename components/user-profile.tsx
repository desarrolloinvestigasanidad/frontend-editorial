"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalData from "@/components/profile/personal-data";
import MyChapters from "@/components/profile/my-chapters";
import OfficialCertificates from "@/components/profile/official-certificates";
import MyPublications from "@/components/profile/my-publications";
import Library from "@/components/profile/library";
import Invoices from "@/components/profile/invoices";
import { Button } from "@/components/ui/button";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("personal-data");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4'>
      <TabsList className='grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
        <TabsTrigger value='personal-data'>Datos Personales</TabsTrigger>
        <TabsTrigger value='my-chapters'>Mis Capítulos</TabsTrigger>
        <TabsTrigger value='official-certificates'>
          Certificados Oficiales
        </TabsTrigger>
        <TabsTrigger value='my-publications'>Publicaciones</TabsTrigger>
        <TabsTrigger value='library'>Biblioteca</TabsTrigger>
        <TabsTrigger value='invoices'>Facturas</TabsTrigger>
      </TabsList>

      {/* Datos Personales */}
      <TabsContent value='personal-data'>
        <PersonalData />
      </TabsContent>

      {/* Mis Capítulos */}
      <TabsContent value='my-chapters'>
        <MyChapters />
      </TabsContent>

      {/* Certificados Oficiales */}
      <TabsContent value='official-certificates'>
        <OfficialCertificates />
      </TabsContent>

      {/* Publicaciones */}
      <TabsContent value='my-publications'>
        {/* Aquí añadimos la card para crear un libro */}
        <div className='border border-gray-200 rounded-lg p-4 mb-4'>
          <h3 className='text-lg font-semibold mb-2'>Crea tu propio libro</h3>
          <p className='text-sm text-gray-600 mb-4'>
            Publica tu libro de forma sencilla con la ayuda de nuestros
            servicios. Podrás coordinar a tus coautores y gestionar tus
            capítulos.
          </p>
          <Link href='/create-book'>
            <Button>Crea tu libro</Button>
          </Link>
        </div>

        <MyPublications />
      </TabsContent>

      {/* Biblioteca */}
      <TabsContent value='library'>
        <Library />
      </TabsContent>

      {/* Facturas */}
      <TabsContent value='invoices'>
        <Invoices />
      </TabsContent>
    </Tabs>
  );
}
