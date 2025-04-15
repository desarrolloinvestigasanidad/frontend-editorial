"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Library, ArrowRight } from "lucide-react";

export default function EditionsPage() {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions`)
      .then((res) => res.json())
      .then((data) => {
        setEditions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching editions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando ediciones...</div>;

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Todas las Ediciones</h1>
      {editions.length === 0 ? (
        <p>No hay ediciones disponibles.</p>
      ) : (
        <motion.div
          className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}>
          {editions.map((edition: any) => (
            <motion.div
              key={edition.id}
              className='group'
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5 },
              }}>
              <div className='relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>

                <div className='flex items-center mb-4'>
                  <div className='bg-purple-100 p-3 rounded-full mr-3 transition-colors duration-300 group-hover:bg-purple-200 group-hover:scale-110'>
                    <Library className='w-5 h-5 text-purple-700' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors'>
                    {edition.title || edition.name}
                  </h2>
                </div>

                <p className='text-gray-600 mb-6'>{edition.description}</p>

                <div className='mt-auto'>
                  <Link href={`/editions/${edition.id}`}>
                    <Button variant='outline' className='mt-2'>
                      Ver Detalles
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
