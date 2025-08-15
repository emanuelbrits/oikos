import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Hospedagem, updateHospedagem } from "../services/hospedagensService";
import { getQuartos, Quarto } from "../services/quartosService";
import { getHospedes, Hospede } from "../services/hospedesService";
import { data } from "framer-motion/client";

interface EditHospedagemModalProps {
    isOpen: boolean;
    onClose: () => void;
    hospedagem: Hospedagem;
    onSave: (hospedagem: Hospedagem) => void;
}

export default function EditHospedagemModal({
    isOpen,
    onClose,
    onSave,
    hospedagem,
}: EditHospedagemModalProps) {
    const { token } = useAuth();

    const [quartos, setQuartos] = useState<Quarto[]>([]);
    const [hospedes, setHospedes] = useState<Hospede[]>([]);

    const [quartoId, setQuartoId] = useState(hospedagem.quarto.id);
    const [hospedeId, setHospedeId] = useState(hospedagem.hospede.id);

    const [dataHoraEntrada, setDataHoraEntrada] = useState(() => {
        const date = new Date(hospedagem.dataHoraEntrada);
        date.setHours(date.getHours() - 3);
        return date.toISOString().slice(0, 16);
    });

    const [dataHoraSaidaPrevista, setDataHoraSaidaPrevista] = useState(() => {
        const date = new Date(hospedagem.dataHoraSaidaPrevista);
        date.setHours(date.getHours() - 3);
        return date.toISOString().slice(0, 16);
    });

    const [dataHoraSaida, setDataHoraSaida] = useState(() => {
        if (!hospedagem.dataHoraSaida) return "";
        const date = new Date(hospedagem.dataHoraSaida);
        date.setHours(date.getHours() - 3);
        return date.toISOString().slice(0, 16);
    });

    const [valorDiaria, setValorDiaria] = useState(hospedagem.valorDiaria);
    const [formaPagamento, setFormaPagamento] = useState(hospedagem.formaPagamento);
    const [descontos, setDescontos] = useState(hospedagem.descontos);
    const [acrescimos, setAcrescimos] = useState(hospedagem.acrescimos);
    const [observacoes, setObservacoes] = useState(hospedagem.observacoes || "");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (isOpen && token) {
            Promise.all([getHospedes(token), getQuartos(token)]).then(([hospedesRes, quartosRes]) => {
                setHospedes(hospedesRes);
                setQuartos(
                    quartosRes.filter(
                        (q) => q.status === "Disponível" || q.id === hospedagem.quarto.id
                    )
                );
            });

            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, token]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!token || !hospedagem.id) return;

        if (!quartoId || !hospedeId || !dataHoraEntrada || !dataHoraSaidaPrevista || !valorDiaria || !formaPagamento) {
            setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        let dataHoraSaidaAux: string | null = dataHoraSaida

        if (dataHoraSaidaAux === "") {
            dataHoraSaidaAux = null;
        }

        try {
            const response = await updateHospedagem(token, hospedagem.id, {
                quartoId,
                idHospede: hospedeId,
                dataHoraEntrada,
                dataHoraSaidaPrevista,
                dataHoraSaida: dataHoraSaidaAux,
                valorDiaria,
                formaPagamento,
                descontos,
                acrescimos,
                observacoes,
            });

            if (!response.success) {
                setErrorMsg(response.message);
                return;
            }

            onSave({
                id: hospedagem.id,
                hospedeId: hospedeId,
                numeroQuarto: quartos.find((q) => q.id === quartoId)?.numero!,
                dataHoraEntrada,
                dataHoraSaidaPrevista,
                dataHoraSaida,
                valorDiaria,
                formaPagamento,
                descontos,
                acrescimos,
                observacoes,
                hospede: hospedes.find((h) => h.id === hospedeId)!,
                quarto: quartos.find((q) => q.id === quartoId)!,
                createdAt: hospedagem.createdAt
            });

        } catch (error) {
            console.error("Erro ao atualizar hospedagem:", error);
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 p-4">
            <div className="bg-gray-100 border-t-8 border-[var(--navy)] p-6 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Editar Hospedagem</h2>

                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Hóspede</label>
                        <select
                            value={hospedeId}
                            onChange={(e) => setHospedeId(Number(e.target.value))}
                            className="w-full p-2 bg-[var(--sunshine)]/50 border border-[var(--navy)]/20"
                        >
                            <option value="">Selecione um hóspede</option>
                            {hospedes.map((h) => (
                                <option key={h.id} value={h.id}>
                                    {h.nome} - {formatCPF(h.cpf)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Quarto</label>
                        <select
                            value={quartoId}
                            onChange={(e) => setQuartoId(Number(e.target.value))}
                            className="w-full p-2 bg-[var(--sunshine)]/50 border border-[var(--navy)]/20"
                        >
                            <option value="">Selecione um quarto</option>
                            {quartos.map((q) => (
                                <option key={q.id} value={q.id}>
                                    Nº {q.numero}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Data/Hora Entrada</label>
                        <input
                            type="datetime-local"
                            value={dataHoraEntrada}
                            onChange={(e) => setDataHoraEntrada(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Data/Hora Saída Prevista</label>
                        <input
                            type="datetime-local"
                            value={dataHoraSaidaPrevista}
                            onChange={(e) => setDataHoraSaidaPrevista(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Data/Hora Saída</label>
                        <input
                            type="datetime-local"
                            value={dataHoraSaida}
                            onChange={(e) => setDataHoraSaida(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Valor Diária</label>
                        <input
                            type="number"
                            value={valorDiaria}
                            onChange={(e) => setValorDiaria(Number(e.target.value))}
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
                            {["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Pix"].map((q) => (
                                <option key={q} value={q}>
                                    {q}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Descontos</label>
                        <input
                            type="number"
                            value={descontos}
                            onChange={(e) => setDescontos(Number(e.target.value))}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Acréscimos</label>
                        <input
                            type="number"
                            value={acrescimos}
                            onChange={(e) => setAcrescimos(Number(e.target.value))}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Observações</label>
                    <textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border border-[var(--navy)]/20"
                    />
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
