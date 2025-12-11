"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TarjetasOpciones from "../../components/tarjetas/tarjetas";
import AgrgarTarjetas from "../../components/agregaTarjeta/agregaTarjeta";
import Tarjeta from "../../components/tarjetas/tarjeta"; // Este será tu formulario

const TarjetasPage = () => {
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modoAgregar, setModoAgregar] = useState(false);

  const handleAgregarTarjeta = async (formData) => {
    const token = localStorage.getItem("auth_token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) return;

    const [mes, anioCorto] = formData.expiry.split('/');
    const anio = parseInt(anioCorto, 10) + 2000;
    const vencimiento = new Date(anio, parseInt(mes) - 1, 1); 

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tarjetas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numero: formData.number.replace(/-/g, ''),
          titular: formData.name,
          vencimiento: vencimiento.toISOString(),
          cvv: formData.cvc,
          usuarioId: parseInt(userId),
        }),
      });

      if (!res.ok) throw new Error('Error al agregar tarjeta');

      const nuevaTarjeta = await res.json();
      setTarjetas((prev) => [...prev, nuevaTarjeta]); 
      setModoAgregar(false); 
    } catch (err) {
      console.error(err);
      alert('Hubo un error al guardar la tarjeta.');
    }
  };
  
  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        router.push("/login");
        return;
      }

      try {
        const resTarjetas = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/tarjetas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resTarjetas.ok) throw new Error("Error al obtener tarjetas");
        const dataTarjetas = await resTarjetas.json();
        setTarjetas(dataTarjetas);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [router]);

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-white text-lg">Cargando tarjetas...</p>
      </main>
    );
  }

  return (
    <main className="p-4 grid gap-6 max-w-3xl mx-auto">
      {!modoAgregar ? (
        <>
          <AgrgarTarjetas onNuevaTarjeta={() => setModoAgregar(true)} />
          <TarjetasOpciones tarjetas={tarjetas} onEliminar={() => true } />
        </>
      ) : (
        <Tarjeta onVolver={() => setModoAgregar(false)} onSubmit={handleAgregarTarjeta} />
      )}
    </main>
  );
};

export default TarjetasPage;
