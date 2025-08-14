"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { TbAlertCircle, TbHotelService } from "react-icons/tb";
import { CiMail } from "react-icons/ci";
import { IoLockClosedOutline } from "react-icons/io5";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image'

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setErrorMsg("");

      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Login inválido");

      const data = await res.json();
      login(data.access_token);
    } catch (err) {
      console.error(err);
      setErrorMsg("Usuário ou senha incorretos");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <div className="hidden md:flex flex-col items-center justify-center gap-12 text-center w-2/5 text-[var(--sunshine)] bg-[var(--navy)] min-h-screen">
        <Image
          src="/oikos-logo.png"
          width={256}
          height={256}
          alt="Logo"
          className="w-64 h-64 rounded-full border-2 border-[var(--sunshine)] shadow-2xl p-2 bg-white"
        />
        <h2 className="text-5xl">Gerenciador de Hospedagens</h2>
      </div>

      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center bg-[var(--sunshine)] p-6 shadow-lg min-h-screen w-full md:w-3/5"
      >
        <div className="flex flex-col gap-8 w-full max-w-md">
          <Image
            src="/oikos-pousada.png"
            width={456}
            height={265}
            alt="Logo"
            className="border-2 border-[var(--sunshine)]"
          />

          <div className="flex flex-col gap-3">
            <label htmlFor="username" className="text-3xl font-bold text-[var(--navy)]">E-mail</label>
            <div className="flex">
              <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-2xl">
                <CiMail className="text-[var(--navy)] text-3xl" />
              </div>
              <input
                id="username"
                type="text"
                placeholder="Digite seu e-mail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-2 py-5 border border-gray-100 rounded-r-2xl bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="password" className="text-3xl font-bold text-[var(--navy)]">
              Senha
            </label>
            <div className="flex">
              <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-2xl">
                <IoLockClosedOutline className="text-[var(--navy)] text-3xl" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-5 border-t border-b border-gray-100 bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center justify-center bg-gray-100 px-3 rounded-r-2xl cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {showPassword ? (
                    <motion.div
                      key="eye-open"
                      initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RiEyeLine className="text-[var(--navy)] text-3xl" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="eye-closed"
                      initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: -15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RiEyeCloseLine className="text-[var(--navy)] text-3xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="inline-flex items-center text-lg text-red-600 mb-4"><TbAlertCircle /> {errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--seaBlue)] text-[var(--sunshine)] text-3xl font-bold py-4 rounded shadow-xl hover:bg-[var(--navy)] cursor-pointer transition-colors duration-300"
          >
            ENTRAR
          </button>
        </div>
      </form>
    </div>
  );
}
