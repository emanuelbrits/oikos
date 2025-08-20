"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createReserva, getReservas, Reserva } from "../services/reservasService";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/loadingScreen";
import ProtectedRoute from "../components/ProtectedRoute";
import CalendarioReservas from "../components/CalendarioReservas";
import { getQuartos, Quarto } from "../services/quartosService";
import { getHospedes, Hospede } from "../services/hospedesService";
import QuadroReservas from "../components/QuadroReservas";

export default function ReservasPage() {
    const { token } = useAuth();

    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [quartos, setQuartos] = useState<Quarto[]>([]);
    const [hospedes, setHospedes] = useState<Hospede[]>([]);

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string>("");
    const [calendarVisible, setCalendarVisible] = useState<boolean>(false);

    const [quartoSelecionado, setQuartoSelecionado] = useState<number | null>(null);
    const [hospedeId, setHospedeId] = useState<number | null>(null);
    const [formaPagamento, setFormaPagamento] = useState<string>("Dinheiro");
    const [entrada, setEntrada] = useState<string>("");
    const [saida, setSaida] = useState<string>("");
    const [observacao, setObservacao] = useState<string>("");

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        setErro("");

        Promise.all([getQuartos(token), getReservas(token), getHospedes(token)])
            .then(([quartosRes, reservasRes, hospedesRes]) => {
                setQuartos(quartosRes);
                setReservas(reservasRes);
                setHospedes(hospedesRes);
            })
            .catch(() => setErro("Erro ao carregar dados."))
            .finally(() => setLoading(false));
    }, [token]);

    const formatCPF = (value: string) => {
        let v = value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 9) {
            return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
        } else if (v.length > 6) {
            return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
        } else if (v.length > 3) {
            return `${v.slice(0, 3)}.${v.slice(3)}`;
        } else {
            return v;
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-[var(--sunshine)]">
                <Sidebar />

                <main className="flex-1 p-4 md:p-6 flex gap-4">
                    <div className="flex-[0.4] flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="font-semibold mb-4 text-lg">Quartos</h2>
                            <ul className="grid grid-cols-5 gap-2">
                                {quartos.map((q) => (
                                    <li
                                        key={q.id}
                                        className={`flex items-center justify-center h-10 border border-gray-200 cursor-pointer rounded-lg hover:bg-gray-100 ${q.id === quartoSelecionado ? "bg-gray-200 font-bold" : ""
                                            }`}
                                        onClick={() =>
                                            setQuartoSelecionado(q.id === quartoSelecionado ? null : (q.id ?? null))
                                        }
                                    >
                                        {q.numero}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow flex-1">
                            <h2 className="font-semibold mb-4 text-lg">Nova Reserva</h2>
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!quartoSelecionado || !hospedeId || !entrada || !saida) return;

                                    if (new Date(saida) <= new Date(entrada)) {
                                        alert("A data de saída deve ser posterior à data de entrada.");
                                        return;
                                    }

                                    const reservasDoQuarto = (await getReservas(token!)).filter(reserva => reserva.quarto.id === quartoSelecionado);

                                    const conflito = reservasDoQuarto.some(reserva => {
                                        if (reserva.status !== "Reservado") return false;

                                        const inicioExistente = new Date(reserva.dataHoraInicial);
                                        const fimExistente = new Date(reserva.dataHoraFinal);
                                        const novaEntrada = new Date(entrada);

                                        // Se a data inicial da nova reserva estiver dentro do intervalo existente
                                        return novaEntrada >= inicioExistente && novaEntrada < fimExistente;
                                    });

                                    // 3. Definir status de acordo com o conflito
                                    const statusReserva = conflito ? "Na fila" : "Reservado";

                                    // 4. Criar a reserva
                                    await createReserva(token!, {
                                        idHospede: hospedeId,
                                        quartoId: quartoSelecionado,
                                        dataHoraInicial: entrada,
                                        dataHoraFinal: saida,
                                        formaPagamento,
                                        status: statusReserva,
                                        observacoes: observacao,
                                    });

                                    // 5. Atualizar reservas e limpar formulário
                                    const reservasAtualizadas = await getReservas(token!);
                                    setReservas(reservasAtualizadas);

                                    setHospedeId(null);
                                    setEntrada("");
                                    setSaida("");
                                    setObservacao("");
                                }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Hóspede</label>
                                        <select
                                            value={hospedeId ?? ""}
                                            onChange={(e) => setHospedeId(Number(e.target.value))}
                                            className="w-full p-3 border rounded-lg"
                                            disabled={!quartoSelecionado}
                                        >
                                            <option value="">Selecione</option>
                                            {hospedes.map((h) => (
                                                <option key={h.id} value={h.id}>
                                                    {h.nome} - {formatCPF(h.cpf)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
                                        <select
                                            value={formaPagamento}
                                            onChange={(e) => setFormaPagamento(e.target.value)}
                                            className="w-full p-3 border rounded-lg"
                                            disabled={!quartoSelecionado}
                                        >
                                            {["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Pix"].map((fp) => (
                                                <option key={fp} value={fp}>
                                                    {fp}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Entrada</label>
                                        <input
                                            type="datetime-local"
                                            value={entrada}
                                            onChange={(e) => setEntrada(e.target.value)}
                                            className="w-full p-3 border rounded-lg"
                                            disabled={!quartoSelecionado}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Saída</label>
                                        <input
                                            type="datetime-local"
                                            value={saida}
                                            onChange={(e) => setSaida(e.target.value)}
                                            className="w-full p-3 border rounded-lg"
                                            disabled={!quartoSelecionado}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Observação</label>
                                    <textarea
                                        value={observacao}
                                        onChange={(e) => setObservacao(e.target.value)}
                                        className="w-full p-3 border rounded-lg"
                                        rows={3}
                                        placeholder="Ex: Necessita de berço, check-in antecipado..."
                                        disabled={!quartoSelecionado}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-3 rounded-lg font-semibold text-white cursor-pointer ${quartoSelecionado ? "bg-[var(--navy)] hover:bg-[var(--seaBlue)] transition-colors duration-300" : "bg-gray-300 cursor-not-allowed"
                                        }`}
                                    disabled={!quartoSelecionado}
                                >
                                    Reservar
                                </button>
                            </form>
                        </div>

                    </div>


                    {calendarVisible ?
                        <div className="flex-[0.6] bg-white rounded-xl shadow h-full p-4 flex flex-col">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setCalendarVisible(false)}
                                    className="px-3 py-1.5 text-lg rounded-md bg-[var(--navy)] text-[var(--sunshine)] hover:bg-[var(--navy)]/90 transition-colors cursor-pointer"
                                >
                                    Ver em Quadro
                                </button>
                            </div>

                            <div className="flex-1 min-h-0">
                                {quartoSelecionado ? (
                                    <CalendarioReservas
                                        reservas={reservas.filter(r => r.quarto.id === quartoSelecionado)}
                                        token={token!}
                                        onReservasChange={(novas) => setReservas(novas)}
                                    />
                                ) : (
                                    <CalendarioReservas
                                        reservas={reservas}
                                        token={token!}
                                        onReservasChange={(novas) => setReservas(novas)}
                                    />
                                )}
                            </div>
                        </div>
                        :
                        <div className="flex-[0.6] bg-white rounded-xl shadow min-h-0 p-4 flex flex-col">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setCalendarVisible(true)}
                                    className="px-3 py-1.5 text-lg rounded-md bg-[var(--navy)] text-[var(--sunshine)] hover:bg-[var(--navy)]/90 transition-colors cursor-pointer"
                                >
                                    Ver em Calendário
                                </button>
                            </div>
                            <div className="flex-1 min-h-0">
                                {quartoSelecionado ? (
                                    <QuadroReservas
                                        reservas={reservas.filter(r => r.quarto.id === quartoSelecionado)}
                                        token={token!}
                                        onReservasChange={(novas) => setReservas(novas)}
                                    />
                                ) : (
                                    <QuadroReservas
                                        reservas={reservas}
                                        token={token!}
                                        onReservasChange={(novas) => setReservas(novas)}
                                    />
                                )}
                            </div>
                        </div>
                    }

                </main>
            </div>
        </ProtectedRoute>
    );
}