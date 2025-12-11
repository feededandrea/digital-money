"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Actividades from "../../components/dashboard/actividad";
import CuentasOpciones from "../../components/cuentas/cuentas";
import TransferneciaBancaria from "../../components/transferenciaBancaria/tansferenciaBancaria";
import TransferneciaTarjeta from "../../components/transferenciaTarjeta/transferenciaTarjeta";
import { info } from "console";
import InformacionTransferencia from "../../components/informacionTransferencia/informacionTransferencia";
import TarjetasOpciones from "../../components/tarjetas/tarjetas";
import { Decimal } from "@prisma/client/runtime/library";
import Transferencia from "../../components/transferirDestino/transferirDestino";

type DestinoTransferencia = 
  | { tipo: "propia" }
  | { tipo: "externa", alias: string, banco: string, cvu: string, titular: string };


const CargaPage = () => {
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState([]);
  const [tarjeta, setTarjeta] = useState();
  const [ingresarDinero, setIngresarDinero] = useState(0);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [informacionTransferencia, setInformacionTransferencia] = useState(false);
  const [informacionTarjetas, setInformacionTarjetas] = useState(false);
  const [cantidadTarjeta, setCantidadTarjeta] = useState(false);
  const [confirmarIngreso, setConfirmarIngreso] = useState(false);
  const [tarjetaSeleccionadaId, setTarjetaSeleccionadaId] = useState<number | null>(null);
  const destino = { tipo: "propia" as const };

  const handleConfirmarTransferencia = async ({
  tarjetaId,
  monto,
  destino
}: {
  tarjetaId: number;
  monto: number;
  destino: DestinoTransferencia;
}) => {
    const token = localStorage.getItem("auth_token");

    setTarjetaSeleccionadaId(tarjetaId)
    setIngresarDinero(monto);

    if (!token || !tarjetaSeleccionadaId || ingresarDinero <= 0) {
        alert("Faltan datos para procesar la transferencia.");
        return;
    }

    const tarjetaSeleccionada = tarjetas.find((t) => t.id === tarjetaSeleccionadaId);

    if (!tarjetaSeleccionada) {
        alert("Tarjeta no encontrada.");
        return;
    }

    setTarjeta(tarjetaSeleccionada);

    try {
        const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/tarjetas/confirmar`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                numero: tarjetaSeleccionada.numero,
                titular: tarjetaSeleccionada.titular,
                vencimiento: tarjetaSeleccionada.vencimiento,
                cvv: tarjetaSeleccionada.cvv,
                importe: ingresarDinero,
                usuarioId: tarjetaSeleccionada.usuarioId,
            }),
        }
        );

        if (!res.ok) throw new Error("Error en la transferencia");

            alert("¡Transferencia completada!");
        } catch (err) {
            console.error("Error al realizar la transferencia:", err);
            alert("Hubo un problema al procesar la transferencia.");
        }
    };

  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem("auth_token");
      const userId = localStorage.getItem("user_id");

      console.log(token, userId);

      if (!token || !userId) {
        router.push("/login");
        return;
      }

        setInformacionTransferencia(false);
        setInformacionTarjetas(false);
        setCantidadTarjeta(false);


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

  


  useEffect(() => {
    console.log("Cuentas recientes:", cuentas);
  }, [cuentas]);

  return <>
  <main>

    { informacionTransferencia &&
    
        <div className="p-4 grid gap-6 max-w-3xl mt-2 mx-auto"><InformacionTransferencia/></div>
    }
  
    
    { informacionTarjetas &&
    
      <Transferencia
        tarjetas={tarjetas}
        destino={destino}
        onConfirmar={handleConfirmarTransferencia}
      />
    }
  
    
    {!informacionTransferencia && !informacionTarjetas && !cantidadTarjeta && !confirmarIngreso &&
        <div className="p-4 grid gap-6 max-w-3xl mt-2 mx-auto">
            <TransferneciaBancaria onMostrarInformacionBancaria={() => setInformacionTransferencia(true)} />
            <TransferneciaTarjeta onMostrarTransferencia={() => setInformacionTarjetas(true)}/>
        </div>
    }
    </main>

  </>
};

export default CargaPage;