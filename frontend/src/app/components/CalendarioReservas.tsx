// CalendarioReservas.tsx
"use client";
import { useState } from "react";
import dayjs from "dayjs";

export default function CalendarioReservas({ reservas }: { reservas: any[] }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const daysInMonth = currentMonth.daysInMonth();
  const startOfMonth = currentMonth.startOf("month").day(); // dia da semana do primeiro dia

  const datesArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      {/* Cabeçalho com navegação */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded">{"<"}</button>
        <h2 className="font-bold text-lg">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded">{">"}</button>
      </div>

      {/* Grade do calendário */}
      <div className="grid grid-cols-7 gap-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="text-center font-medium">{d}</div>
        ))}

        {/* Espaços em branco antes do primeiro dia */}
        {Array.from({ length: startOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {datesArray.map((day) => {
          const dateStr = currentMonth.date(day).format("YYYY-MM-DD");
          const reservasDoDia = reservas.filter(r =>
            dayjs(r.dataHoraInicial).format("YYYY-MM-DD") === dateStr
          );

          return (
            <div key={day} className="border p-2 rounded text-sm">
              <div className="font-bold">{day}</div>
              {reservasDoDia.map((res, idx) => (
                <div key={idx} className="text-xs text-blue-600 truncate">
                  {res.hospede?.nome ?? "Reserva"}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
