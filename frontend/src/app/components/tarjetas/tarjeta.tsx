import ReactCreditCards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { useState } from 'react';

type TarjetaFormProps = {
  onVolver: () => void;
  onSubmit: (formData: {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
  }) => void;
};

const TarjetaForm = ({ onVolver, onSubmit }: TarjetaFormProps) => {
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focused: undefined as 'number' | 'name' | 'expiry' | 'cvc' | undefined,
  });

  const isFormValid =
    formData.number.trim() !== '' &&
    formData.name.trim() !== '' &&
    formData.expiry.trim() !== '' &&
    formData.cvc.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSubmit(formData); 
  };

  return (
    <div className="p-4 bg-white w-full rounded-xl text-white">
      <button
        onClick={onVolver}
        className="mb-4 text-[#c1fd35] hover:underline"
      >
        ← Volver
      </button>

      <ReactCreditCards
        number={formData.number}
        name={formData.name}
        expiry={formData.expiry}
        cvc={formData.cvc}
        focused={formData.focused}
      />

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-wrap justify-around"
      >
        <input name="number" type="text" placeholder="Número de tarjeta"
          value={formData.number}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/\D/g, '');
            const formattedValue =
              rawValue.match(/.{1,4}/g)?.join('-').slice(0, 19) || '';
            setFormData({ ...formData, number: formattedValue });
          }}
          onFocus={(e) =>
            setFormData({ ...formData, focused: e.target.name as any })
          }
          className="px-3 py-4 w-[40%] m-2 rounded-[10px] shadow-md text-black border focus:border-[rgba(210,255,236,1)]"
        />

        <input name="name" type="text" placeholder="Nombre completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onFocus={(e) =>
            setFormData({ ...formData, focused: e.target.name as any })
          }
          className="px-3 py-4 w-[40%] m-2 rounded-[10px]  shadow-md text-black border focus:border-[rgba(210,255,236,1)]"
        />

        <input name="expiry" type="text" placeholder="MM/YY"
          value={formData.expiry}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/\D/g, '');
            const formattedValue =
              rawValue.length >= 3
                ? `${rawValue.slice(0, 2)}/${rawValue.slice(2, 4)}`
                : rawValue;
            setFormData({ ...formData, expiry: formattedValue });
          }}
          onFocus={(e) =>
            setFormData({ ...formData, focused: e.target.name as any })
          }
          className="px-3 py-4 w-[40%]  m-2 rounded-[10px] shadow-md text-black border focus:border-[rgba(210,255,236,1)]"
        />

        <input
          name="cvc"
          type="text"
          placeholder="CVC"
          value={formData.cvc}
          onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
          onFocus={(e) =>
            setFormData({ ...formData, focused: e.target.name as any })
          }
          className="px-3  py-4 w-[40%] m-2 rounded-[10px] shadow-md text-black border focus:border-[rgba(210,255,236,1)]"
        />

        <button
          type="submit"
          disabled={!isFormValid}
          className={`flex justify-center items-center shadow-md rounded-xl text-black font-bold h-[64px] w-[40%] ml-auto mt-4 mb-2 text-center mr-9 transition-opacity ${
            !isFormValid ? 'bg-[rgba(206,206,206,1)]' : 'bg-[#c1fd35]'
          }`}
        >
          Continuar
        </button>
      </form>
    </div>
  );
};

export default TarjetaForm;