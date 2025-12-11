import React from 'react';

interface AlertaProps {
  mensaje: string;
  imagen: string; 
}

const Alerta: React.FC<AlertaProps> = ({ mensaje, imagen }) => {
  return (

    <div className="bg-[#c1fd35] flex flex-col items-center justify-center text-center rounded-xl shadow-md px-8 py-7 m-12">
      
      <img alt="Alerta" className={`w-[60px] h-[60px] bg-[rgba(32,31,34,1)] mask ${imagen}`}/>
      
      <h3 className="p-2 mt-2 rounded-xl font-bold text-xl">{mensaje}</h3>
    </div>
  );
};

export default Alerta;