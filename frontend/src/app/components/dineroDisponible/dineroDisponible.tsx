import React from "react";

interface DineroDisponibleProps {
  saldo: number;
}

const DineroDisponible: React.FC<DineroDisponibleProps> = ({ saldo }) => {
  // Formatear saldo a moneda local, ejemplo en pesos argentinos:
  const saldoFormateado = saldo.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  return (
    <>
      <div className="bg-[rgba(32,31,34,1)] rounded-xl shadow-md px-8 py-9 mb-2">
        <div className="flex items-center justify-end text-[rgba(238,234,234,1)] ">
          <button className="flex underline text-xxl justify-between mb-2 mr-4 items-center">
            Ver tarjetas
          </button>
          <button className="flex underline text-xxl justify-between mb-2 mr-4 items-center">
            Ver CVU
          </button>
        </div>
        <h2 className="text-m font-bold mb-4 text-white pb-3">Dinero disponible</h2>

        <h2 className="text-[35px] text-[rgba(238,234,234,1)] font-bold border border-[#c1fd35] px-4 py-2 w-fit rounded-[40px]">
          {saldoFormateado}
        </h2>
      </div>

      <div className="flex items-center justify-end  mb-2">
        <button className="flex justify-center items-center shadow-md rounded-xl text-black font-bold text-2xl h-[106px] w-full bg-[#c1fd35] mb-2 text-center mr-2">
          Cargar dinero
        </button>
        <button className="flex justify-center items-center shadow-md rounded-xl text-black font-bold text-2xl h-[106px] w-full bg-[#c1fd35] mb-2 text-center ml-2">
          Pago de servicios
        </button>
      </div>
    </>
  );
};

export default DineroDisponible;