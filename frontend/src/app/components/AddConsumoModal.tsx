import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createProduto, Produto } from "../services/produtosService";
import { Hospedagem } from "../services/hospedagensService";
import { createConsumoDiario } from "../services/consumosDiario.Service";

interface AddConsumoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function AddConsumoModal({ isOpen, onClose, onSave }: AddConsumoModalProps) {
    const { token } = useAuth();
    const [hospedagem, setHospedagem] = useState<Hospedagem | null>(null);
    const [produto, setProduto] = useState<Produto | null>(null);
    const [quantidade, setQuantidade] = useState(0);
    const [valorUnitario, setValorUnitario] = useState(0);
    const [formaPagamento, setFormaPagamento] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setErrorMsg("");
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!token) {
            console.error("Token não encontrado");
            return;
        }

        const camposObrigatorios = { hospedagem, produto, quantidade, valorUnitario, formaPagamento };
        const camposVazios = Object.entries(camposObrigatorios).filter(
            ([_, valor]) =>
                (typeof valor === "string" ? valor.trim() === "" : valor === 0)
        );
        if (camposVazios.length > 0) {
            setErrorMsg("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await createConsumoDiario(token, {
                hospedagemId: hospedagem?.id,
                produtoId: produto?.id,
                quantidade,
                valorUnitario,
                formaPagamento
            });

            if (!response.success) {
                setErrorMsg(response.message);
                return;
            }

            onSave();
        } catch (error) {
            console.error("Erro ao salvar Consumo:", error);
            setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-gray-100 border-t-8 border-[var(--navy)] p-6 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Adicionar Consumo</h2>

                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Hospedagem</label>
                        <input
                            type="text"
                            placeholder="ex.: Quarto 101"
                            value={hospedagem}
                            onChange={(e) => setHospedagem(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Descrição</label>
                        <input
                            type="text"
                            placeholder="ex.: Refrigerante 400ml"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Preço</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={preco}
                            onChange={(e) => setPreco(parseFloat(e.target.value))}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Quantidade</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={quantidade}
                            onChange={(e) => setQuantidade(parseInt(e.target.value))}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                {errorMsg && (
                    <p className="text-red-600 font-semibold mb-4">{errorMsg}</p>
                )}

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
