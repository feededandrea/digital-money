import React from "react";

interface Tarjeta {
  id: number;
  numero: string;
}

interface TarjetasOpcionesProps {
  tarjetas: Tarjeta[];
  onSeleccionar?: (id: number) => void;
  onSeleccionarPuntos?: (id: number) => void;
  onEliminar?: (id: number) => void;
  tarjetaSeleccionadaId?: number | null;
}

const TarjetasOpciones: React.FC<TarjetasOpcionesProps> = ({
  tarjetas,
  onSeleccionar,
  onEliminar,
  onSeleccionarPuntos,
  tarjetaSeleccionadaId,
}) => {
  const seleccionarTarjeta = (id: number) => {
    if (onSeleccionarPuntos) {
      onSeleccionarPuntos(id);
    } else if (onSeleccionar) {
      onSeleccionar(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md px-8 py-10">
      <h2 className="text-xl font-bold mb-4 text-black border-b border-b-black pb-3">
        Tus tarjetas
      </h2>

      <div className="grid gap-6">
        {tarjetas.length > 0 ? (
          tarjetas.map((tarjeta) => {
            const estaSeleccionada = tarjeta.id === tarjetaSeleccionadaId;

            return (
              <div
                key={tarjeta.id}
                className="flex w-full justify-between items-center border-b border-black pb-3 relative"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-blue-500" />
                  <div className="text-black font-medium">
                    Terminada en {tarjeta.numero.slice(-4)}
                  </div>
                </div>

                {(onSeleccionar || onSeleccionarPuntos) && (
                  <button
                    onClick={() => seleccionarTarjeta(tarjeta.id)}
                    className="relative"
                  >
                    {!onSeleccionarPuntos && (
                      <span className="font-bold text-blue-600 hover:underline">
                        {estaSeleccionada ? "Seleccionada" : "Seleccionar"}
                      </span>
                    )}

                    {onSeleccionarPuntos && (
                      <div
                        className={`w-6 h-6 rounded-full transition-colors duration-200 border-2 ${
                          estaSeleccionada
                            ? "border-[#201f22] bg-[#c1fd35]"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {estaSeleccionada && (
                          <div className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#201f22]" />
                        )}
                      </div>
                    )}
                  </button>
                )}

                {onEliminar && (
                  <button
                    onClick={() => onEliminar(tarjeta.id)}
                    className="font-bold text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-black/60">No hay tarjetas disponibles</p>
        )}
      </div>
    </div>
  );
};

export default TarjetasOpciones;