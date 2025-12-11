import React from "react";

interface TransferneciaTarjeta {
  onMostrarTransferencia: () => void;
}

const TransferneciaTarjeta: React.FC<TransferneciaTarjeta> = ({ onMostrarTransferencia }) => {
  return (
    <div className="bg-[rgba(32,31,34,1)] rounded-xl shadow-md px-8 py-10">
      <button
        onClick={onMostrarTransferencia}
        className="flex text-xxl w-full text-[#c1fd35] justify-between">

        <div className="flex items-center">
          <img src="/card.svg" alt="plus" />
          <h2 className="ml-2">Seleccionar Tarjetas</h2>
        </div>
        <img className="imgFlechaVerde" alt="flecha" />
      </button>
    </div>
  );
};

export default TransferneciaTarjeta;