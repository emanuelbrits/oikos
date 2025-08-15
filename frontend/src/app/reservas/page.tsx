"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createReserva, getReservas, Reserva } from "../services/reservasService";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/loadingScreen";
import ProtectedRoute from "../components/ProtectedRoute";
import CalendarioReservas from "../components/CalendarioReservas";
import { getQuartos, Quarto } from "../services/quartosService";
import { getHospedes, Hospede } from "../services/hospedesService"; // Novo serviço

export default function ReservasPage() {
    const { token } = useAuth();

    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [quartos, setQuartos] = useState<Quarto[]>([]);
    const [hospedes, setHospedes] = useState<Hospede[]>([]);

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string>("");

    const [quartoSelecionado, setQuartoSelecionado] = useState<number | null>(null);
    const [hospedeId, setHospedeId] = useState<number | null>(null);
    const [formaPagamento, setFormaPagamento] = useState<string>("Dinheiro");
    const [entrada, setEntrada] = useState<string>("");
    const [saida, setSaida] = useState<string>("");

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
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />

                <main className="flex-1 p-4 md:p-6 flex gap-4">
                    {/* Coluna Esquerda */}
                    <div className="flex-[0.4] flex flex-col gap-4">
                        {/* Lista de quartos */}
                        <div className="bg-white p-4 rounded-xl shadow">
                            <h2 className="font-semibold mb-2">Quartos</h2>
                            <ul className="grid grid-cols-5 divide-y divide-x divide-gray-200">
                                {quartos.map((q) => (
                                    <li
                                        key={q.id}
                                        className={`p-2 cursor-pointer hover:bg-gray-100 ${q.id === quartoSelecionado ? "bg-gray-200 font-bold" : ""
                                            }`}
                                        onClick={() => setQuartoSelecionado(q.id!)}
                                    >
                                        {q.numero}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {quartoSelecionado && (
                            <div className="bg-white p-4 rounded-xl shadow">
                                <h2 className="font-semibold mb-3">Nova Reserva</h2>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (!hospedeId || !entrada || !saida) return;

                                        await createReserva(token!, {
                                            idHospede: hospedeId,
                                            quartoId: quartoSelecionado,
                                            dataHoraInicial: entrada,
                                            dataHoraFinal: saida,
                                            formaPagamento,
                                            status: "PENDENTE",
                                        });
                                    }}
                                >
                                    {/* Select Hóspede */}
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium">Hóspede</label>
                                        <select
                                            value={hospedeId ?? ""}
                                            onChange={(e) => setHospedeId(Number(e.target.value))}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="">Selecione</option>
                                            {hospedes.map((h) => (
                                                <option key={h.id} value={h.id}>
                                                    {h.nome} - {formatCPF(h.cpf)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Entrada */}
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium">Entrada</label>
                                        <input
                                            type="datetime-local"
                                            value={entrada}
                                            onChange={(e) => setEntrada(e.target.value)}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>

                                    {/* Saída */}
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium">Saída</label>
                                        <input
                                            type="datetime-local"
                                            value={saida}
                                            onChange={(e) => setSaida(e.target.value)}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>

                                    {/* Forma de Pagamento */}
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium">Forma de Pagamento</label>
                                        <select
                                            value={formaPagamento}
                                            onChange={(e) => setFormaPagamento(e.target.value)}
                                            className="w-full p-2 border rounded"
                                        >
                                            {["Dinheiro", "Cartão", "Pix"].map((fp) => (
                                                <option key={fp} value={fp}>
                                                    {fp}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[var(--navy)] text-white py-2 rounded"
                                    >
                                        Reservar
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Coluna Direita */}
                    <div className="flex-[0.6]">
                        {quartoSelecionado ? (
                            <CalendarioReservas reservas={reservas.filter(r => r.quarto.id === quartoSelecionado)} />
                        ) : (
                            <div className="text-gray-500 p-4">
                                Selecione um quarto para ver as reservas
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
