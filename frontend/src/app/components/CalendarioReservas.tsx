"use client";
import { useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/pt-br";
import { Reserva } from "../services/reservasService";

dayjs.extend(isBetween);

interface CalendarioReservasProps {
  reservas: Reserva[];
  isQuartoSelecionado: boolean;
}

export default function CalendarioReservas({ reservas, isQuartoSelecionado }: CalendarioReservasProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const daysInMonth = currentMonth.daysInMonth();
  const startOfMonth = currentMonth.startOf("month").day();

  const datesArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const coresReservas = [
    "bg-[var(--seaBlue)] text-[var(--sunshine)]",
    "bg-[var(--navy)] text-[var(--sunshine)]",
    "bg-[var(--spray)] text-[var(--navy)]",
    "bg-[var(--sunshine)] text-[var(--navy)]",
    "bg-[var(--geranium)] text-[var(--navy)]",
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow h-full flex flex-col">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded">
          {"<"}
        </button>
        <h2 className="font-bold text-lg capitalize">
          {currentMonth.locale("pt-br").format("MMMM YYYY")}
        </h2>
        <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded">
          {">"}
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7  flex-1">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="text-center font-medium py-1 bg-gray-50">
            {d}
          </div>
        ))}

        {/* Espaços vazios até o 1º dia */}
        {Array.from({ length: startOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-50" />
        ))}

        {/* Dias do mês */}
        {datesArray.map((day) => {
          const date = currentMonth.date(day);

          // filtrar reservas que incluem este dia
          const reservasDoDia = reservas.filter((r) => {
            const inicio = dayjs(r.dataHoraInicial);
            const fim = dayjs(r.dataHoraFinal);
            return date.isBetween(inicio, fim, "day", "[]"); // [] inclui início e fim
          });

          return (
            <div
              key={day}
              className="border border-gray-200  text-xs flex flex-col min-h-[60px] h-auto"
            >
              <div className="font-bold text-gray-700 text-center">{day}</div>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {reservasDoDia.map((res, idx) => {
                  const cor = coresReservas[idx % coresReservas.length];
                  const dataInicial = dayjs(res.dataHoraInicial).format("YYYY-MM-DD");
                  const dataFinal = dayjs(res.dataHoraFinal).format("YYYY-MM-DD");
                  const mostrarTexto = date.format("YYYY-MM-DD") === dataInicial || date.format("YYYY-MM-DD") === dataFinal;
                  const handleClick = () => {
                    
                  };

                  return (
                    <div
                      key={idx}
                      className={`px-1 ${cor} text-center text-sm overflow-hidden cursor-pointer`}
                      style={{ height: "18px" }}
                      onClick={handleClick}
                    >
                      {mostrarTexto
                        ? `${isQuartoSelecionado ? "" : `Quarto ${res.quarto.numero} - `}${res.hospede?.nome ?? "Reserva"}`
                        : null}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
