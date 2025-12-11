import React from "react";

interface AgragarTarjetasProps {
  onNuevaTarjeta: () => void;
}

const AgragarTarjetas: React.FC<AgragarTarjetasProps> = ({ onNuevaTarjeta }) => {
  return (
    <div className="bg-[rgba(32,31,34,1)] rounded-xl shadow-md px-8 py-10">
      <h2 className="text-xl font-bold mb-4 text-white pb-3">
        Agrega tu tarjeta de crédito o débito
      </h2>
      <button
        onClick={onNuevaTarjeta}
        className="flex text-xxl w-full text-[#c1fd35] justify-between"
      >
        <div className="flex items-center">
          <img src="/plus.svg" alt="plus" />
          <h2 className="ml-2">Nueva tarjeta</h2>
        </div>
        <img className="imgFlechaVerde" alt="flecha" />
      </button>
    </div>
  );
};

export default AgragarTarjetas;