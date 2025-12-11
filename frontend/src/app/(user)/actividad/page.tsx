"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Actividades from "../../components/dashboard/actividad";
import CuentasOpciones from "../../components/cuentas/cuentas";

const ActividadPage = () => {
  const router = useRouter();
  const [actividades, setActividades] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("user_id");

      console.log(token, userId);

      if (!token || !userId) {
        router.push("/login");
        return;
      }

      try {
        // Obtener actividades
        const resActividades = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/actividades/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resActividades.ok) throw new Error("Error al obtener actividades");
        const dataActividades = await resActividades.json();
        setActividades(dataActividades);

        const resCuentas = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/usuarios-recientes/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resCuentas.ok) throw new Error("Error al obtener cuentas");
        const dataCuentas = await resCuentas.json();
        setCuentas(dataCuentas);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [router]);

  useEffect(() => {
    console.log("Cuentas recientes:", cuentas);
  }, [cuentas]);

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-white text-lg">Cargando actividad...</p>
      </main>
    );
  }

  return (
    <main className="p-4 grid gap-6 max-w-3xl mt-2 mx-auto">
      <Actividades actividades={actividades} tipo="paginado" buscador = {true} />
      <CuentasOpciones Cuentas={cuentas} onSeleccionar={() => {}}/>
    </main>
  );
};

export default ActividadPage;