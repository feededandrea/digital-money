"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

interface Actividad {
  id: number;
  descripcion: string;
  importe: number;
  fecha: string;
}

interface ActividadesProps {
  actividades: Actividad[];
  tipo: "resumen" | "paginado";
  buscador?: boolean;
}

const Actividades: React.FC<ActividadesProps> = ({ actividades, tipo, buscador }) => {
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const porPagina = tipo === "resumen" ? 4 : 5;

  const actividadesFiltradas = actividades.filter((act) =>
    act.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(actividadesFiltradas.length / porPagina);
  const actividadesAMostrar = actividadesFiltradas
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice((pagina - 1) * porPagina, pagina * porPagina);

  return (

    <>  

      {buscador && (
              <div className="mb-2 flex bg-white rounded-xl shadow-md w-full h-[64px] border border-gray-300 focus-within:ring-2 focus-within:ring-[rgba(238, 234, 234, 1)] transition">
              <img className="w-[20px] ml-4" src="/search.svg" />
              <input
                type="search"
                inputMode="none"
                placeholder="Buscar en tu actividad"
                value={busqueda}
                autoComplete="off"
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPagina(1);
                }}

                //safari me sigue dando mails para autocompletar aun cuando
                // es autocomplete off asi que esta solucion es la unica que funciona
                onFocus={(e) => e.target.removeAttribute("readonly")}
                onBlur={(e) => e.target.readOnly = true}
                readOnly
                className="text-black w-full px-4 py-2 mr-4 outline-none bg-transparent"
              />
            </div>
            )}

      <div className="bg-white rounded-xl shadow-md px-8 py-10">
            <h2 className="text-xl font-bold mb-4 text-black border-b border-b-black pb-3">Tu actividad</h2>
            <ul className="space-y-4">
              {actividadesAMostrar.map((act) => (
                <li key={act.id} className="flex items-center border-b border-b-black pb-3 justify-between">
                  <div className="items-center flex space-x-3">
                    <div className="w-7 h-7 relative top-[-1px] rounded-full bg-blue-500"></div>
                    <div>
                      <div className="text-black font-medium">{act.descripcion}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-black">${act.importe.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">{dayjs(act.fecha).fromNow()}</div>
                  </div>
                </li>
              ))}

               {actividadesAMostrar.length == 0 ? (<p className="text-black/60 " >No hay actividades disponibles</p>) : ""}
            </ul>

            {tipo === "resumen" ? (
              <div className="mt-4 text-center">
                <button className="text-blue-600 font-medium hover:underline">
                  Ver toda tu actividad <span className="ml-1">→</span>
                </button>
              </div>
            ) : (
              <div className="mt-3 relative top-3 flex justify-center space-x-2">
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPagina(i + 1)}
                    className={`px-3 py-1 rounded ${
                      pagina === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>


    </>
   
  );
};

export default Actividades;