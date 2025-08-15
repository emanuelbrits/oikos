"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getHospedagens, Hospedagem } from "../services/hospedagensService";
import { getHospedes, Hospede } from "../services/hospedesService";
import { getReservas, Reserva } from "../services/reservasService";

export default function DashboardPage() {
  const { token } = useAuth();
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    if (token) {
      getHospedagens(token).then(setHospedagens).catch(console.error);
      getHospedes(token).then(setHospedes).catch(console.error);
      getReservas(token).then(setReservas).catch(console.error);
    }
  }, [token]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[var(--sunshine)]">
        <Sidebar title="Oikos"/>

        <main className="flex-1 ml-0 p-6">
          <h1 className="text-4xl font-bold mb-6">Bem-vindo</h1>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white shadow-xl rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Hospedagens recentes</h2>
              <p className="text-gray-600 mb-4">
                Últimas hospedagens realizadas.
              </p>

              {hospedagens.length > 0 ? (
                <ul className="space-y-2">
                  {hospedagens.slice(0, 5).map((h) => (
                    <li key={h.id} className="border-b pb-2">
                      <span className="font-medium">{h.hospede.nome}</span> - Quarto{" "}
                      {h.quarto.numero} - Entrada:{" "}
                      {new Date(h.dataHoraEntrada).toLocaleDateString("pt-BR")}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhuma hospedagem encontrada.</p>
              )}

              <div className="flex justify-end">
                <button className="mt-4 bg-[var(--navy)] hover:bg-[var(--seaBlue)] text-[var(--sunshine)] font-bold rounded-md px-4 py-2 justify-end cursor-pointer">
                  Ver todos
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-xl rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Hóspedes</h2>
                <p className="text-gray-600 mb-4">
                  Últimos hóspedes cadastrados.
                </p>

                {hospedes.length > 0 ? (
                  <ul className="space-y-2">
                    {hospedes.slice(0, 5).map((h) => (
                      <li key={h.id} className="border-b pb-2">
                        {h.nome} - {h.cidade}/{h.estado}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhum hóspede encontrado.</p>
                )}

                <div className="flex justify-end">
                  <button className="mt-4 bg-[var(--navy)] hover:bg-[var(--seaBlue)] text-[var(--sunshine)] font-bold rounded-md px-4 py-2 justify-end cursor-pointer">
                    Ver todos
                  </button>
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Reservas</h2>
                <p className="text-gray-600 mb-4">
                  Informações sobre as reservas mais recentes.
                </p>

                {reservas.length > 0 ? (
                  <ul className="space-y-2">
                    {reservas.slice(0, 5).map((r) => (
                      <li key={r.id} className="border-b pb-2">
                        <span className="font-medium">{r.hospede.nome}</span> - Quarto{" "}
                        {r.quarto.numero} - Entrada:{" "}
                        {new Date(r.dataHoraInicial).toLocaleDateString("pt-BR")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhuma reserva encontrada.</p>
                )}

                <div className="flex justify-end">
                  <button onClick={() => {}} className="mt-4 bg-[var(--navy)] hover:bg-[var(--seaBlue)] text-[var(--sunshine)] font-bold rounded-md px-4 py-2 justify-end cursor-pointer">
                    Ver todos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
