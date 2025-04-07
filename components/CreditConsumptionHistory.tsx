"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function CreditConsumptionHistory({
  userId,
}: {
  userId: string;
}) {
  const { editionId } = useParams();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/editions/${editionId}/credit-consumption-history`
        );
        if (!response.ok) throw new Error("Error al cargar el historial");
        const data = await response.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && editionId) {
      fetchHistory();
    }
  }, [userId, editionId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='animate-spin h-5 w-5 text-purple-500'>
          <Clock className='h-5 w-5' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-red-500 text-sm text-center'>Error: {error}</div>
    );
  }

  if (history.length === 0) {
    return (
      <div className='text-gray-500 text-sm text-center'>
        No se han registrado consumos de créditos todavía.
      </div>
    );
  }

  return (
    <Card className='backdrop-blur-sm bg-white/80 rounded-xl border border-purple-100'>
      <CardContent className='p-4 space-y-4'>
        <h3 className='text-lg font-semibold text-purple-700'>
          Historial de Consumo de Créditos
        </h3>
        <ul className='space-y-3'>
          {history.map((item) => (
            <li key={item.id} className='flex items-start gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <CheckCircle className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-sm text-gray-700'>{item.description}</p>
                <p className='text-xs text-gray-500'>
                  {format(new Date(item.createdAt), "dd/MM/yyyy - HH:mm")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
