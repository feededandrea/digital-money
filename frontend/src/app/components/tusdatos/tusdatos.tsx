"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Datos {
  id: number;
  nombre: string;
  email: string;
  cuit: string;
  telefono: string;
  contrasena: string;
}

const TusDatos: React.FC = () => {
  const [datos, setDatos] = useState<Datos | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDatos = async () => {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("auth_token");

      console.log("userId:", userId);
      console.log("token:", token);

      if (!userId || !token) {
        setError("No se encontraron credenciales.");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verificarTokenUsuario`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: Number(userId), token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al obtener los datos.");
        }

        setDatos(data.user);
        console.log(data.user);
      } catch (err: any) {
        setError(`Error al obtener los datos: ${err.message}`);
        router.push("/login");
      }
    };

    fetchDatos();
  }, [router]);

  const renderDato = (label: string, value: string | number) => (
    <div className="flex w-full  items-center border-b border-black/10 my-1">
      <div className="text-black w-[200px]  font-medium pb-1">{label}</div>
      <div className="text-black text-black/60 w-full font-medium pb-1">{value}</div>
      <div className="text-black w-[20px] font-medium pb-1 filter grayscale"><img src="/editar.svg"/></div>
    </div>
  );

  if (error) return <div className="text-red-500">{error}</div>;
  if (!datos) return <div className="text-black/50">Cargando datos...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md px-8 py-8">
      <h2 className="text-xl relative top-[-10px] font-bold text-black mb-2 ">
        Tus datos
      </h2>

      <div className="">
        {renderDato("Nombre", datos.nombre)}
        {renderDato("Email", datos.email)}
        {renderDato("CUIT", datos.cuit)}
        {renderDato("Teléfono", datos.telefono)}
        {renderDato("Contraseña", "********")}
      </div>
    </div>
  );
};

export default TusDatos; 