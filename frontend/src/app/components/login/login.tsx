"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Para redirigir a otra página después del login exitoso

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.includes("@")) {
      setError("Correo inválido. Inténtalo de nuevo.");
      setLoading(false);
      return;
    }

    try {
      console.log(process.env.NEXT_PUBLIC_API_URL)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/verificar-usuario?email=${email}`);
      const data = await res.json();

      if (!data.existe) {
        setError("Usuario inexistente. Vuelve a intentarlo.");
        setLoading(false);
        return;
      }

      setStep("password");
    } catch (err) {
      setError("Error al verificar usuario.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, contrasena: password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Credenciales inválidas.");
      } else {
        const data = await res.json();
        console.log("Login exitoso:", data);

        // Guardar el token en localStorage
        localStorage.setItem("auth_token", data.Token);
        localStorage.setItem("user_id", data.UserId);

        // Redirigir al usuario después del login exitoso
        router.push("/dashboard"); // Cambia a la ruta de tu aplicación
      }
    } catch (err) {
      setError("Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="boxLogin">
      <form onSubmit={step === "email" ? handleEmailSubmit : handleLoginSubmit}>
        {step === "email" ? (
          <label htmlFor="email" className="text-white font-bold text-lg mb-2 block">
            ¡Hola! Ingresá tu e-mail
          </label>
        ) : (
          <label className="text-white font-bold text-lg mb-2 block">Iniciar sesión</label>
        )}

        <input
          id="email"
          className="loginEmailInput"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={step === "password"}
          required
        />

        {step === "password" && (
          <input
            id="password"
            className="loginEmailInput"
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        <button type="submit" className="loginEmailContinueButton" disabled={loading}>
          {loading ? "Cargando..." : "Ingresar"}
        </button>

        {step === "password" && (
          <button type="submit" className="loginContinuarGoogleButton" disabled={loading}>
            Continuar con Google <span className="ml-1">→</span>
          </button>
        )}

        {step === "email" && (
          <button onClick={() => router.push("/signup")} type="button" className="loginEmailRegisterButton">
            Crear Cuenta
          </button>
        )}
      </form>

      {error && (
        <p className="loginEmailStatusText mt-2 text-red-500" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;