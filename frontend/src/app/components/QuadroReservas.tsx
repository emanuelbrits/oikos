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
  };

  const statusColors: Record<string, string> = {
    "Reservado": "bg-[var(--navy)] text-[var(--sunshine)]",
    "Na fila": "bg-[var(--sunshine)] text-[var(--navy)]",
    "Cancelado": "bg-red-600 text-white",
    "Expirado": "bg-orange-400 text-[var(--navy)]",
    "Finalizado": "bg-gray-500 text-white",
  };

  useEffect(() => {
    setReservasState(reservas);
  }, [reservas]);

  return (
    <div className="bg-[var(--sunshine)]/10 p-4 rounded-xl shadow flex flex-col max-h-[80vh] min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        {[...reservasState]
          .sort((a, b) => {
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
                  <div className="font-bold">
                    {dayjs(res.dataHoraInicial).format("DD/MM")}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-base">Data de Saída</h2>
                  <div className="font-bold">
                    {dayjs(res.dataHoraFinal).format("DD/MM")}
                  </div>
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
          onClose={async (isEdited, deleted) => {
            setIsModalOpen(false);
            setReservaSelecionada(null);
            if (isEdited || deleted) {
              const novas = await getReservas(token);
              setReservasState(novas);
              onReservasChange?.(novas);
            }
          }}
        />
      )}
    </div>
  );

}
