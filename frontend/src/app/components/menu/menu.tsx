'use client'

import React from "react";
import { useRouter, usePathname } from "next/navigation";

const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const hiddenPaths = ['/login', '/signup'];
  if (hiddenPaths.includes(pathname)) return null;

  const items = [
    { label: 'Inicio', path: '/dashboard' },
    { label: 'Actividad', path: '/actividad' },
    { label: 'Tu perfil', path: '/tuperfil' },
    { label: 'Cargar dinero', path: '/cargar' },
    { label: 'Pagar Servicios', path: '/servicios' },
    { label: 'Tarjetas', path: '/tarjetas' },
  ];

  const baseButtonClass = " text-[rgba(32,31,34,1)] text-left  m-1";

  return (
    <div className="bg-[#c1fd35] w-[276px] top-0  relative shadow-md px-8 py-9 mb-2 flex flex-col justify-start">
      {items.map(({ label, path }) => {
        const isActive = pathname.startsWith(path);
        return (
          <button
            key={path}
            className={`${baseButtonClass} ${isActive ? "font-bold" : ""}`}
            onClick={() => router.push(path)}>
            {label}
          </button>
        );
      })}
      <button
        className={ `${baseButtonClass} opacity-50`}
        onClick={() => {
          localStorage.clear();
          router.push("/login");
        }} >
            Cerrar sesión
      </button>
    </div>
  );
};

export default Menu;