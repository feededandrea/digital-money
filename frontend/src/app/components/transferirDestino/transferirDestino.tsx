// components/transferencia/Transferencia.tsx
"use client";

import React, { useState } from "react";
import TarjetasOpciones from "../tarjetas/tarjetas";
import Alerta from "../alerta/alerta";

type DestinoTransferencia = 
  | { tipo: "propia" }
  | { tipo: "externa", alias: string, banco: string, cvu: string, titular: string };

interface TransferenciaProps {
  tarjetas: any[];
  destino: DestinoTransferencia;
  onConfirmar: (params: {
    tarjetaId: number;
    monto: number;
    destino: DestinoTransferencia;
  }) => void;
}

const Transferencia: React.FC<TransferenciaProps> = ({
  tarjetas,
  destino,
  onConfirmar
}) => {
  const [step, setStep] = useState<"seleccion" | "monto" | "confirmacion" | "resultado">("seleccion");
  const [tarjetaSeleccionadaId, setTarjetaSeleccionadaId] = useState<number | null>(null);
  const [monto, setMonto] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  return (
    <>
      {step === "seleccion" && (
        <div className="bg-[rgba(32,31,34,1)] rounded-xl shadow-md px-8 py-10 m-12">
          <h2 className="text-[#c1fd35] font-bold text-xl mb-4">Seleccionar Tarjeta</h2>
          <TarjetasOpciones
            tarjetas={tarjetas}
            tarjetaSeleccionadaId={tarjetaSeleccionadaId}
            onSeleccionarPuntos={(id) => setTarjetaSeleccionadaId(id)}
          />
          <div className="flex justify-end mt-4">
            <button
              disabled={!tarjetaSeleccionadaId}
              onClick={() => setStep("monto")}
              className={`rounded-xl h-[64px] px-6 text-black font-bold transition ${
                !tarjetaSeleccionadaId ? "bg-gray-400" : "bg-[#c1fd35]"
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === "monto" && (
        <div className="bg-[rgba(32,31,34,1)] rounded-xl shadow-md px-8 py-10 m-12">
          <h2 className="text-[#c1fd35] font-bold text-xl mb-4">¿Cuánto querés ingresar?</h2>
          <input
            type="number"
            className="p-4 rounded-xl w-[40%]"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(Number(parseFloat(e.target.value).toFixed(2)))}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setStep("confirmacion")}
              className="rounded-xl h-[64px] px-6 text-black font-bold bg-[#c1fd35]"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {step === "confirmacion" && tarjetaSeleccionadaId && (


         <div className="bg-[rgba(32,31,34,1)] rounded-xl shadow-md px-8 py-10 m-12">

            <div className="flex  w-full text-[#c1fd35] justify-between">
                <h2 className="ml-2 font-bold text-xl">Revisá que todo está bien</h2>
            </div>

                <div className="flex">
                    
                    <p className="p-2 rounded-xl text-white">Vas a transferir</p>
                    <img className="[top:-1px] relative cursor-pointer" onClick={() => setStep("monto")} src="/edit-page.svg"></img>
                </div>

                <p className="p-2 rounded-xl text-white font-bold text-xl">${monto}</p>

                    <p className="p-2 rounded-xl text-white text-sm">Para</p>
                <p className="p-2 rounded-xl text-white font-bold text-xl">Cuenta Propia</p>
                    <p className="p-2 rounded-xl text-white">Brubank</p>
                    <p className="px-2 rounded-xl text-white">CVU: 0000002100075990000000</p>

                <div className="flex ">
                    <button onClick={async () => {
                      try {
                        await onConfirmar({
                          tarjetaId: tarjetaSeleccionadaId!,
                          monto,
                          destino
                        });
                        setStep("resultado");
                      } catch (error) {
                        setError(true);
                        console.error("Error al confirmar la transferencia:", error);
                      }
                    }}
                    className={`flex justify-center items-center shadow-md rounded-xl text-black font-bold h-[64px] w-[40%] ml-auto mt-2 mb-2 text-center mr-2 transition-opacity 
                        ${!tarjetaSeleccionadaId ? 'bg-[rgba(206,206,206,1)]' : 'bg-[#c1fd35]'}
                    `}>
                    Continuar
                    </button>
                </div>
        </div>
      )}

      {step === "resultado" && tarjetaSeleccionadaId && (
        <> 
        <Alerta mensaje="Ya cargamos el dinero en tu cuenta" imagen="imgCheckNegro"/>
         <div className="bg-[rgba(32,31,34,1)] rounded-xl shadow-md px-8 py-10 m-12">
                <div className="flex">
                    <p className="p-2 rounded-xl text-white">17 de agosto 2022 a 16:34 hs</p>
                </div>
                <p className="p-2 rounded-xl text-[#c1fd35] font-bold font-bold text-xl">${monto}</p>
                <p className="p-2 rounded-xl text-white text-sm">Para</p>
                <p className="p-2 rounded-xl text-[#c1fd35] font-bold text-xl">Cuenta Propia</p>
                <p className="p-2 rounded-xl text-white">Brubank</p>
                <p className="px-2 rounded-xl text-white">CVU: 0000002100075990000000</p>
        </div>
       <div className="flex items-end">
          <button onClick={ () => {} } className={`flex justify-center items-center shadow-md rounded-xl text-black font-bold h-[64px] w-[300px] ml-auto mt-2 mb-2 text-center mr-2 transition-opacity 
                        bg-[rgba(206,206,206,1)]
                    `}> Ir al inicio
                    </button>
                    <button onClick={ () => {} } className={`flex justify-center items-center shadow-md rounded-xl text-black font-bold h-[64px] w-[300px] mt-2 mb-2 text-center mr-12 transition-opacity 
                        ${!tarjetaSeleccionadaId ? 'bg-[rgba(206, 206, 206, 1)]' : 'bg-[#c1fd35]'}
                    `}> Descargar Comprobante
                    </button>
        </div>
        </>
      )}

      
    </>
  );
};

export default Transferencia;