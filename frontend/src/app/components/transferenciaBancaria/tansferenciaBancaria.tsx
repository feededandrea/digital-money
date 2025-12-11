import React from "react";

interface TransferneciaBancaria {
  onMostrarInformacionBancaria: () => void;
}

const AgragarTarjetas: React.FC<TransferneciaBancaria> = ({ onMostrarInformacionBancaria }) => {
  return (
    <div className="bg-[rgba(32,31,34,1)] rounded-xl shadow-md px-8 py-10">
      <button
        onClick={onMostrarInformacionBancaria}
        className="flex text-xxl w-full text-[#c1fd35] justify-between">

        <div className="flex items-center">
          <img src="/user.svg" alt="plus" />
          <h2 className="ml-2">Transfernecia Bancaria</h2>
        </div>
        <img className="imgFlechaVerde" alt="flecha" />
      </button>
    </div>
  );
};

export default AgragarTarjetas;