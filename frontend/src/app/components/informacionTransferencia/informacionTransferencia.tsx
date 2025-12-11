import React from "react";


const InformacionTransferencia = () => {

  return (
    <div className="bg-[rgba(32,31,34,1)] text-white rounded-xl shadow-md px-8 py-10">
      <h2 className="text-xl font-bold mb-4  pb-3">
        Copia tu cvu o alias para ingresar o transferir dinero desde otra cuenta
      </h2>

        <button className="flex text-xxl w-full justify-between mb-2 items-center">
            <div className="flex flex-col items-start ">
                <h2 className=" text-[#c1fd35] font-bold">CVU</h2>
                <h2 className=" text-[rgba(238,234,234,1)]">0000002100075320000000</h2>
            </div>
            <img src="/iconCopiar.svg" className=""/>
        </button>


        <button className="flex text-xxl w-full justify-between  mb-2 items-center">
            <div className="flex flex-col items-start ">
                <h2 className=" text-[#c1fd35] font-bold">Alias</h2>
                <h2 className=" text-[rgba(238,234,234,1)]">estealiasapareceaca</h2>
            </div>
            <img src="/iconCopiar.svg" className=""/>
        </button>
    </div>
  );
};

export default InformacionTransferencia;