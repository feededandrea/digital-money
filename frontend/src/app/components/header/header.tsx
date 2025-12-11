'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()

  const [nombreUsuario, setNombreUsuario] = useState('')
  const [variant, setVariant] = useState('')

  const goToLogin = () => router.push('/login')
  const goToRegister = () => router.push('/signup')

  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }

  const getVariantFromPath = () => {
    if (pathname === '/login') return 'none';
    if (pathname === '/signup') return 'login-only';
    if (pathname === '/') return 'login-register';
    return 'authenticated';
  };

  const fetchAndStoreUser = async () => {
    const userId = localStorage.getItem('user_id')
    const token = localStorage.getItem('auth_token')

    if (!userId || !token) {
      console.log("No hay Token o es incorrecto");
      router.push('/login')
      return null;
    } 

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/verificarTokenUsuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token }),
      })

      if (!response.ok) throw new Error('Error al obtener el usuario'); router.push('/login');

      const data = await response.json()
      const user = data.user

      setNombreUsuario(user.nombre)
      localStorage.setItem('userData', JSON.stringify(user))

      return user
    } catch (err) {
      router.push('/login')
      console.error('Error al traer el usuario:', err)
      return null
    }
  }

  useEffect(() => {
    const setup = async () => {
      const tipo = getVariantFromPath()
      console.log(tipo);
      setVariant(tipo)

      if (tipo === 'authenticated') {
        const userData = localStorage.getItem('userData')

        if (userData) {
          const user = JSON.parse(userData)
          setNombreUsuario(user.nombre)
        } else {
          await fetchAndStoreUser()
        }
      }
    }

    setup()
  }, [pathname])
  
  return (
    <header className={`flex items-center justify-between ${getVariantFromPath() == 'authenticated' ? 'usuarioIniciado' : ''} h-16 px-4 bg-background text-foreground border-b border-gray-300 dark:border-gray-700`}>
      <div className="flex items-center">
        <img src={`${ getVariantFromPath() == 'authenticated' ? "./logoDHM-verde.svg" : "./logoDHM.png"}`} alt="Logo" className="w-[83px] h-[33px]" />
      </div>

      <div className="flex items-center space-x-4">
        {variant === 'login-only' && (
          <button
            onClick={goToLogin}
            className="px-4 py-2 rounded bg-blue-600 text-white">
            Ingresar
          </button>
        )}

        {variant === 'login-register' && (
          <>
            <button
              onClick={goToLogin}
              className="px-4 py-2 rounded bg-blue-600 text-white">
              Ingresar
            </button>
            <button
              onClick={goToRegister}
              className="px-4 py-2 rounded bg-green-600 text-white">
              Crear Cuenta
            </button>
          </>
        )}

        {variant === 'authenticated' && nombreUsuario && (
          <div className="flex items-center">
            <div className="bg-[#c1fd35] text-[rgba(32,31,34,1)] rounded-md w-10 h-10 flex items-center justify-center font-bold">
              {getInitials(nombreUsuario)}
            </div>
            <span className="ml-2 text-white hidden md:inline">Hola, {nombreUsuario}</span>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header