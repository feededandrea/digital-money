"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TusDatos from "../../components/tusdatos/tusdatos";
import InformacionTransferencia from "../../components/informacionTransferencia/informacionTransferencia";


const TuPerfilPage = () => {
  const router = useRouter();
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
      setLoading(false);
    };

    fetchDatos();
  }, [router]);


  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-white text-lg">Cargando perfil...</p>
      </main>
    );
  }

  return (
    <main className="p-4 grid gap-6 max-w-3xl mx-auto">
      <TusDatos />
      <InformacionTransferencia/>
    </main>
  );
};

export default TuPerfilPage;