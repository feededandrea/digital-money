"use client";

import React, { useState } from "react";

const RegisterPage = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [telefono, setTelefono] = useState("");
  const [cuit, setCuit] = useState("");

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validación de los campos
    if (!nombre || !email || !contrasena || !confirmarContrasena) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    // Verificar formato de email
    if (!email.includes("@")) {
      setError("email inválido.");
      setLoading(false);
      return;
    }

    // Llamar al backend para crear el usuario
    try {
      console.log(process.env.NEXT_PUBLIC_API_URL)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          contrasena,
          cuit,
          telefono
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Usuario creado:", data);
        // Redirigir o mostrar mensaje de éxito
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al crear usuario.");
      }
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      setError("Error al registrar usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gray-100">
      <div className="boxLogin">
        <form onSubmit={handleRegisterSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">Crear cuenta</h2>

          <input
            id="nombre"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="text"
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            id="email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="email"
            placeholder="Tu email electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            id="contrasena"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="password"
            placeholder="Tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <input
            id="confirmarContrasena"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="password"
            placeholder="Confirma tu contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
          />

          <input
            id="telefono"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />

          <input
            id="cuit"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="text"
            placeholder="CUIT"
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
            required
          />

          {/* Error */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full registerButton p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Crear cuenta"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;