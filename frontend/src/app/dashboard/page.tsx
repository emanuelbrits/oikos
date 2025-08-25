"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getHospedagens, Hospedagem } from "../services/hospedagensService";
import { getReservas, Reserva } from "../services/reservasService";
import CalendarioReservas from "../components/CalendarioReservas";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { token } = useAuth();
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    if (token) {
      getHospedagens(token).then(setHospedagens).catch(console.error);
      getReservas(token).then(setReservas).catch(console.error);
    }
  }, [token]);

  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[var(--sunshine)]">
        <Sidebar title="Oikos" />

        <main className="flex-1 ml-0 p-6">
          <h1 className="text-4xl text-[var(--navy)] font-bold mb-6">Bem-vindo</h1>

          <div className="grid grid-cols-1 gap-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-xl rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Hospedagens Ativas</h2>

                {hospedagens.length > 0 ? (
                  <ul className="space-y-2">
                    {hospedagens
                      .filter((h) => !h.dataHoraSaida)
                      .sort(
                        (a, b) =>
                          new Date(a.dataHoraEntrada).getTime() -
                          new Date(b.dataHoraEntrada).getTime()
                      )
                      .slice(0, 8)
                      .map((h) => (
                        <li
                          key={h.id}
                          className="grid grid-cols-3 p-2 rounded-xl border-3 text-center text-xl cursor-pointer mb-1 bg-[var(--navy)] text-[var(--sunshine)]"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className="font-bold">Quarto {h.quarto?.numero ?? "Reserva"}</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="font-bold">{h.hospede?.nome ?? "Reserva"}</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            Entrada: {new Date(h.dataHoraEntrada).toLocaleDateString("pt-BR")}
                          </div>
                        </li>
                      ))}

                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhuma hospedagem encontrada.</p>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => router.push("/hospedagens")}
                    className="mt-4 bg-[var(--navy)] hover:bg-[var(--seaBlue)] text-[var(--sunshine)] font-bold rounded-md px-4 py-2 justify-end cursor-pointer"
                  >
                    Ver todos
                  </button>
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Reservas</h2>

                <div className="w-full h-[500px] overflow-hidden">
                  {reservas.length > 0 ? (
                    <CalendarioReservas token={token!} reservas={reservas} />
                  ) : (
                    <p className="text-gray-500">Nenhuma reserva encontrada.</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => router.push("/reservas")}
                    className="mt-4 bg-[var(--navy)] hover:bg-[var(--seaBlue)] text-[var(--sunshine)] font-bold rounded-md px-4 py-2 justify-end cursor-pointer"
                  >
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
