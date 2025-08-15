import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Hospede } from "./EditHospedeModal";
import { Quarto } from "../services/quartosService";
import { createHospedagem } from "../services/hospedagensService";
import { getHospedes } from "../services/hospedesService";
import { getQuartos } from "../services/quartosService";

interface AddHospedagemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function AddHospedagemModal({ isOpen, onClose, onSave }: AddHospedagemModalProps) {
    const { token } = useAuth();
    const [hospedes, setHospedes] = useState<Hospede[]>([]);
    const [quartos, setQuartos] = useState<Quarto[]>([]);

    const [hospedeId, setHospedeId] = useState("");
    const [quartoId, setQuartoId] = useState("");
    const [dataHoraEntrada, setDataHoraEntrada] = useState("");
    const [dataHoraSaidaPrevista, setDataHoraSaidaPrevista] = useState("");
    const [valorDiaria, setValorDiaria] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("");
    const [observacoes, setObservacoes] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (isOpen && token) {
            Promise.all([getHospedes(token), getQuartos(token)]).then(([hospedesRes, quartosRes]) => {
                setHospedes(hospedesRes);
                setQuartos(quartosRes);
            });
        }
    }, [isOpen, token]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!token) return;

        if (!hospedeId || !quartoId || !dataHoraEntrada || !dataHoraSaidaPrevista || !valorDiaria || !formaPagamento) {
            setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const response = await createHospedagem(token, {
                idHospede: hospedeId,
                quartoId,
                dataHoraEntrada: new Date(dataHoraEntrada),
                dataHoraSaidaPrevista: new Date(dataHoraSaidaPrevista),
                valorDiaria: parseFloat(valorDiaria),
                formaPagamento,
                observacoes
            });

            if (!response.success) {
                setErrorMsg(response.message);
                return;
            }

            onSave();
        } catch (error) {
            console.error("Erro ao salvar hospedagem:", error);
            setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
        }
    };

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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-gray-100 border-t-8 border-[var(--navy)] p-6 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Adicionar Hospedagem</h2>

                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Hóspede</label>
                        <select
                            value={hospedeId}
                            onChange={(e) => setHospedeId(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50  border border-[var(--navy)]/20"
                        >
                            <option value="">Selecione um hóspede</option>
                            {hospedes.map((h) => (
                                <option key={h.id} value={h.id}>{h.nome} - {formatCPF(h.cpf)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Quarto</label>
                        <select
                            value={quartoId}
                            onChange={(e) => setQuartoId(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 border border-[var(--navy)]/20"
                        >
                            <option value="">Selecione um quarto</option>
                            {quartos.map((q) => (
                                <option key={q.id} value={q.id}>{q.numero}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Data/Hora de Entrada</label>
                        <input
                            type="datetime-local"
                            value={dataHoraEntrada}
                            onChange={(e) => setDataHoraEntrada(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Data/Hora de Saída Prevista</label>
                        <input
                            type="datetime-local"
                            value={dataHoraSaidaPrevista}
                            onChange={(e) => setDataHoraSaidaPrevista(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Valor da Diária</label>
                        <input
                            type="number"
                            step="0.01"
                            value={valorDiaria}
                            onChange={(e) => setValorDiaria(e.target.value)}
                            placeholder="0,00"
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Forma de Pagamento</label>
                        <select
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 border border-[var(--navy)]/20"
                        >
                            <option value="">Selecione</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Cartão de Débito">Cartão de Débito</option>
                            <option value="Pix">Pix</option>
                            <option value="Transferência">Transferência</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Observações</label>
                        <textarea
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            rows={3}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                {errorMsg && <p className="text-red-600 font-semibold mb-4">{errorMsg}</p>}

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-[var(--navy)] text-white hover:bg-[var(--navy)]/90 transition-colors cursor-pointer"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
