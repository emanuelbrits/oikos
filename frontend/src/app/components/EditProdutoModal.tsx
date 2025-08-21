import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Produto, updateProduto } from "../services/produtosService";

interface EditProdutoeModalProps {
    isOpen: boolean;
    onClose: () => void;
    produto: Produto;
    onSave: (produto: Produto) => void;
}

export default function EditProdutoModal({ isOpen, onClose, onSave, produto }: EditProdutoeModalProps) {
    const { token } = useAuth();
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState(0);
    const [quantidade, setQuantidade] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (isOpen && produto) {
            setNome(produto.nome);
            setDescricao(produto.descricao);
            setPreco(produto.preco);
            setQuantidade(produto.quantidade);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setErrorMsg("");
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, produto]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!token || !produto.id) return;

        const camposObrigatorios = { nome, preco, quantidade };
        const camposVazios = Object.entries(camposObrigatorios).filter(
            ([_, valor]) =>
                (typeof valor === "string" ? valor.trim() === "" : valor === 0 || valor === null || valor === undefined)
        );

        if (camposVazios.length > 0) {
            setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const response = await updateProduto(token, produto.id, {
                nome,
                descricao,
                preco,
                quantidade
            });

            if (!response.success) {
                setErrorMsg(response.message);
                return;
            }

            onSave({
                id: produto.id,
                nome,
                descricao,
                preco,
                quantidade
            });
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 p-4">
            <div className="bg-gray-100 border-t-8 border-[var(--navy)] p-6 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Editar Produto</h2>

                <div className="grid grid-cols-1  gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                    </div>
                </div>

                <div className="grid grid-cols-1  gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Descrição</label>
                        <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Preço</label>
                    <input type="number" value={preco} onChange={(e) => setPreco(parseFloat(e.target.value))} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                </div>
                
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Quantidade</label>
                    <input type="number" value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value))} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                </div>

                {errorMsg && <p className="text-red-600 font-semibold mb-4">{errorMsg}</p>}

                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[var(--navy)] text-white hover:bg-[var(--navy)]/90 transition-colors cursor-pointer">Salvar</button>
                </div>
            </div>
        </div>
    );
}