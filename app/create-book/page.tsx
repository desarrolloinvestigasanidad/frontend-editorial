"use client";

import { useState } from "react";
import CrearLibroModal from "@/components/CreateBookPage";

export default function CrearLibroPage() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className='container mx-auto px-4 py-8'>
      <CrearLibroModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
