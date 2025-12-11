"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Actividades from "../../components/dashboard/actividad";
import DineroDisponible from "../../components/dineroDisponible/dineroDisponible";

const DashboardPage = () => {
  const router = useRouter();
  const [actividades, setActividades] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        router.push("/login");
        return;
      }

      try {
        // Obtener saldo
        const resSaldo = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/saldo/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resSaldo.ok) throw new Error("Error al obtener saldo");
        const dataSaldo = await resSaldo.json();
        setSaldo(dataSaldo.saldo);

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

        // Obtener tarjetas
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

        // Obtener cuentas recientes
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

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-white text-lg">Cargando actividades...</p>
      </main>
    );
  }

  return (
    <main className="p-4 grid gap-6 max-w-3xl mx-auto">
      <DineroDisponible saldo={saldo} />
      <Actividades actividades={actividades} tipo="resumen" buscador={true} />
    </main>
  );
};

export default DashboardPage;