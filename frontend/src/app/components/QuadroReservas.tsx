"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/pt-br";
import { getReservas, Reserva } from "../services/reservasService";
import ReservaModal from "./reservaModal";

dayjs.extend(isBetween);

interface QuadroReservasProps {
  reservas: Reserva[];
  token: string;
  onReservasChange?: (reservas: Reserva[]) => void;
}

export default function QuadroReservas({
  reservas,
  token,
  onReservasChange,
}: QuadroReservasProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

  const [reservasState, setReservasState] = useState<Reserva[]>(reservas);

  const statusOrder: Record<string, number> = {
    "Reservado": 1,
    "Na fila": 2,
    "Expirado": 3,
    "Cancelado": 4,
    "Finalizado": 5,
  };

  const statusColors: Record<string, string> = {
    "Reservado": "bg-[var(--navy)] text-[var(--sunshine)]",
    "Na fila": "bg-[var(--sunshine)] text-[var(--navy)]",
    "Cancelado": "bg-red-600 text-white",
    "Expirado": "bg-orange-400 text-[var(--navy)]",
    "Finalizado": "bg-gray-500 text-white",
  };

  const allStatuses = Object.keys(statusOrder);
  const [statusFilter, setStatusFilter] = useState<Record<string, boolean>>(
    Object.fromEntries(allStatuses.map((s) => [s, true]))
  );

  const [hospedeId, setHospedeId] = useState<string>("");

  useEffect(() => {
    setReservasState(reservas);
  }, [reservas]);

  const reservasFiltradas = reservasState.filter((res) => {
    const statusOk = statusFilter[res.status ?? ""];
    const hospedeOk = hospedeId ? res.hospede?.id === Number(hospedeId) : true;
    return statusOk && hospedeOk;
  });

  return (
    <div className="bg-[var(--sunshine)]/10 p-4 rounded-xl shadow flex flex-col max-h-[80vh] min-h-0">

      <div className="flex flex-wrap gap-4 mb-4">
        <h2 className="text-[var(--navy)] font-bold text-lg">Exibir:</h2>
        {allStatuses.map((status) => (
          <label key={status} className="flex items-center gap-2 text-lg cursor-pointer">
            <input
              type="checkbox"
              checked={statusFilter[status]}
              onChange={() =>
                setStatusFilter((prev) => ({
                  ...prev,
                  [status]: !prev[status],
                }))
              }
            />
            {status}
          </label>
        ))}

        <select
          value={hospedeId}
          onChange={(e) => setHospedeId(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos os hóspedes</option>
          {[...new Map(reservasState.map((r) => [r.hospede?.id, r.hospede]))]
            .filter(([id, h]) => id && h)
            .sort((a, b) => a[1].nome.localeCompare(b[1].nome))
            .map(([id, h]) => (
              <option key={id} value={id}>
                {h?.nome}
              </option>
            ))}
        </select>

      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        {[...reservasFiltradas]
          .sort((a, b) => {
            if (a.status === "Na fila" && b.status === "Na fila") {
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }

            const startA = dayjs(a.dataHoraInicial).valueOf();
            const startB = dayjs(b.dataHoraInicial).valueOf();
            if (startA !== startB) return startA - startB;

            const endA = dayjs(a.dataHoraFinal).valueOf();
            const endB = dayjs(b.dataHoraFinal).valueOf();

            const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 99;
            const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 99;
            if (statusA !== statusB) return statusA - statusB;

            return endA - endB;
          })
          .map((res) => {
            const statusClass =
              statusColors[res.status ?? ""] ?? "bg-[var(--navy)] text-[var(--sunshine)]";

            return (
              <div
                key={res.id}
                className={`grid grid-cols-5 p-2 rounded-xl border-3 text-center text-xl cursor-pointer mb-1 ${statusClass}`}
                onClick={() => {
                  setReservaSelecionada(res);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-base">Número do Quarto</h2>
                  <div className="font-bold">{res.quarto?.numero ?? "Reserva"}</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-base">Data de Início</h2>
                  <div className="font-bold">{dayjs(res.dataHoraInicial).format("DD/MM")}</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-base">Data de Saída</h2>
                  <div className="font-bold">{dayjs(res.dataHoraFinal).format("DD/MM")}</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-base">Hóspede</h2>
                  <div className="font-bold">{res.hospede?.nome ?? "Reserva"}</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-base">Status</h2>
                  <div className="font-bold">{res.status ?? "Reserva"}</div>
                </div>
              </div>
            );
          })}
      </div>

      {reservaSelecionada && (
        <ReservaModal
          isOpen={isModalOpen}
          reserva={reservaSelecionada}
          onClose={async (isEdited, deleted, reserva) => {
            setIsModalOpen(false);
            setReservaSelecionada(null);

            if (isEdited) {
              const index = reservasState.findIndex((r) => r.id === reserva?.id);
              if (index !== -1) {
                const updated = [...reservasState];
                updated[index] = { ...updated[index], ...reserva };
                setReservasState(updated);
              }
            }

            if (deleted) {
              const novas = reservasState.filter((r) => r.id !== reserva?.id);
              setReservasState(novas);
              if (onReservasChange) {
                onReservasChange(novas);
              }
            }
          }}
        />
      )}
    </div>
  );
}
