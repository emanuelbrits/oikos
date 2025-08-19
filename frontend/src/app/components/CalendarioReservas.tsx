// CalendarioReservas.tsx
"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/pt-br";
import { getReservas, Reserva } from "../services/reservasService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReservaModal from "./reservaModal";

dayjs.extend(isBetween);

interface CalendarioReservasProps {
  reservas: Reserva[];
  token: string;
  onReservasChange?: (reservas: Reserva[]) => void;
}

export default function CalendarioReservas({
  reservas,
  token,
  onReservasChange,
}: CalendarioReservasProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

  const [reservasState, setReservasState] = useState<Reserva[]>(reservas);
  const [laneMap, setLaneMap] = useState<Record<number, number>>({}); 
  const [maxLanes, setMaxLanes] = useState(0);

  useEffect(() => {
    setReservasState(reservas);
  }, [reservas]);

  useEffect(() => {
    computeLanes();
  }, [reservasState, currentMonth]);

  const computeLanes = () => {
    const monthStart = currentMonth.startOf("month").startOf("day");
    const monthEnd = currentMonth.endOf("month").endOf("day");

    const visible = reservasState.filter((r) => {
      const start = dayjs(r.dataHoraInicial).startOf("day");
      const end = dayjs(r.dataHoraFinal).endOf("day");
      return !(end.isBefore(monthStart) || start.isAfter(monthEnd));
    });

    visible.sort((a, b) => {
      const aStart = dayjs(a.dataHoraInicial).valueOf();
      const bStart = dayjs(b.dataHoraInicial).valueOf();
      if (aStart !== bStart) return aStart - bStart;
      const aDur = dayjs(a.dataHoraFinal).diff(dayjs(a.dataHoraInicial), "day");
      const bDur = dayjs(b.dataHoraFinal).diff(dayjs(b.dataHoraInicial), "day");
      return bDur - aDur;
    });

    const lanes: Array<Reserva[]> = [];
    const map: Record<number, number> = {};

    const overlaps = (rA: Reserva, rB: Reserva) => {
      const aStart = dayjs(rA.dataHoraInicial).startOf("day");
      const aEnd = dayjs(rA.dataHoraFinal).endOf("day");
      const bStart = dayjs(rB.dataHoraInicial).startOf("day");
      const bEnd = dayjs(rB.dataHoraFinal).endOf("day");
      // se intersectam no intervalo de dias (inclusive)
      return !(aEnd.isBefore(bStart) || aStart.isAfter(bEnd));
    };

    visible.forEach((r) => {
      let assignedLane = -1;
      for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i];
        const conflict = lane.some((lr) => overlaps(lr, r));
        if (!conflict) {
          assignedLane = i;
          lane.push(r);
          break;
        }
      }
      if (assignedLane === -1) {
        lanes.push([r]);
        assignedLane = lanes.length - 1;
      }
      if (r.id != null) map[r.id] = assignedLane;
    });

    setLaneMap(map);
    setMaxLanes(lanes.length);
  };

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const daysInMonth = currentMonth.daysInMonth();
  const startOfMonth = currentMonth.startOf("month").day();
  const datesArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const coresReservas = [
    "bg-[var(--seaBlue)] text-[var(--sunshine)]",
    "bg-[var(--spray)] text-[var(--navy)]",
    "bg-[var(--navy)] text-[var(--sunshine)]",
    "bg-[var(--sunshine)] text-[var(--navy)]",
    "bg-[var(--geranium)] text-[var(--navy)]",
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-2 py-2 bg-[var(--navy)] hover:bg-[var(--seaBlue)] transition-colors duration-300 rounded cursor-pointer">
          <FaChevronLeft className="text-[var(--sunshine)] text-xl" />
        </button>
        <h2 className="text-[var(--navy)] font-bold text-2xl capitalize">
          {currentMonth.locale("pt-br").format("MMMM YYYY")}
        </h2>
        <button onClick={nextMonth} className="px-2 py-2 bg-[var(--navy)] hover:bg-[var(--seaBlue)] transition-colors duration-300 rounded cursor-pointer">
          <FaChevronRight className="text-[var(--sunshine)] text-xl" />
        </button>
      </div>

      <div className="grid grid-cols-7 flex-1">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="text-center font-medium py-1 bg-gray-50">{d}</div>
        ))}

        {Array.from({ length: startOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-50" />
        ))}

        {datesArray.map((day) => {
          const date = currentMonth.date(day);

          const reservasDoDia = reservasState
            .filter((r) => {
              const inicio = dayjs(r.dataHoraInicial).startOf("day");
              const fim = dayjs(r.dataHoraFinal).endOf("day");
              return !(fim.isBefore(date.startOf("day")) || inicio.isAfter(date.endOf("day")));
            })
            .sort((a, b) => {
              const la = a.id != null ? (laneMap[a.id] ?? 9999) : 9999;
              const lb = b.id != null ? (laneMap[b.id] ?? 9999) : 9999;
              return la - lb;
            });

          return (
            <div key={day} className="border border-gray-200 text-xs flex flex-col min-h-[60px] h-auto">
              <div className="font-bold text-gray-700 text-center">{day}</div>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {reservasDoDia.map((res) => {
                  const lane = res.id != null ? (laneMap[res.id] ?? 0) : 0;
                  const cor = coresReservas[lane % coresReservas.length];

                  const dataInicial = dayjs(res.dataHoraInicial).format("YYYY-MM-DD");
                  const dataFinal = dayjs(res.dataHoraFinal).format("YYYY-MM-DD");
                  const mostrarTexto = date.format("YYYY-MM-DD") === dataInicial || date.format("YYYY-MM-DD") === dataFinal;

                  return (
                    <div
                      key={res.id}
                      className={`px-1 ${cor} text-center text-sm overflow-hidden cursor-pointer mb-1`}
                      style={{ height: "18px" }}
                      onClick={() => {
                        setReservaSelecionada(res);
                        setIsModalOpen(true);
                      }}
                    >
                      {mostrarTexto ? `${res.hospede?.nome ?? "Reserva"}` : null}
                    </div>
                  );
                })}
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
