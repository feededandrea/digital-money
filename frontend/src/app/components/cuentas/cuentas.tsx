import React from "react";

interface Cuenta {
  id: number;
  nombre: string;
}

interface CuentasOpcionesProps {
  Cuentas: Cuenta[];
  onSeleccionar: (id: number) => void;
}

const CuentasOpciones: React.FC<CuentasOpcionesProps> = ({ Cuentas, onSeleccionar }) => {
  console.log("Cuentas recibidas en CuentasOpciones:", Cuentas); // Verifica las props que llegan

  return (
    <div className="bg-white rounded-xl shadow-md px-8 py-10">
      <h2 className="text-xl font-bold mb-4 text-black border-b border-b-black pb-3">
        Últimas cuentas
      </h2>

      <div className="grid  gap-6">
        {Cuentas.length > 0 ? (
          Cuentas.map((Cuenta) => (
            <div
              key={Cuenta.id}
              className="flex w-full justify-between items-center border-b border-black pb-3"
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-blue-500" />
                <div className="text-black font-medium">{Cuenta.nombre}</div>
              </div>
              <button
                onClick={() => onSeleccionar(Cuenta.id)}
                className="font-bold text-blue-600 hover:underline">
                    <img src="/flecha.svg"/>
              </button>
            </div>
          ))
        ) : (
          <p className="text-black/60 " >No hay Cuentas disponibles</p>
        )}
      </div>
    </div>
  );
};

export default CuentasOpciones;