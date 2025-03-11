"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";

interface PaymentProps {
  params: { bookId: string };
}

export default function PaymentPage({ params }: PaymentProps) {
  const { bookId } = params;

  // Podrías chequear con GET /api/payments?bookId=... si ya ha pagado
  // y mostrar un formulario o un mensaje de "Pago completado".

  const handlePayNow = async () => {
    // Lógica para POST /api/payments
    // ...
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <Link href={`/books/${bookId}`}>
        <Button variant='ghost' className='flex items-center gap-2 mb-6 px-0'>
          <ArrowLeft className='h-4 w-4' />
          Volver
        </Button>
      </Link>

      <h1 className='text-xl md:text-2xl font-bold mb-4 flex items-center gap-2'>
        <CreditCard className='h-6 w-6' />
        Pago
      </h1>

      <div className='bg-white rounded-lg shadow p-6'>
        <p className='text-gray-700 mb-4'>
          El costo de este libro es de <strong>XX €</strong>. Por favor,
          completa el pago para continuar.
        </p>

        {/* Aquí podrías renderizar un formulario de Stripe, PayPal o un input manual */}
        <Button onClick={handlePayNow}>Pagar ahora</Button>
      </div>
    </div>
  );
}
