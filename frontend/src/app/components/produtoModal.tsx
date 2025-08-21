import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ConfirmModal from "./ConfirmModal";
import { MdDelete, MdDescription, MdEdit } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";
import { FaBrazilianRealSign } from "react-icons/fa6";
import { deleteProduto, Produto } from "../services/produtosService";
import EditProdutoModal from "./EditProdutoModal";

interface ProdutoModalProps {
    isOpen: boolean;
    onClose: (isEdited: boolean, isDeleted: boolean, produto: Produto) => void;
    produto: Produto;
}

export default function ProdutoModal({ isOpen, onClose, produto }: ProdutoModalProps) {
    const { token } = useAuth();
    const [produtoEditSelecionado, setProdutoEditSelecionado] = useState<Produto | null>(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [produtoRemoveSelecionado, setProdutoRemoveSelecionado] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [edited, setEdited] = useState(false);
    const [deleted] = useState(false);

    useEffect(() => {
        setProdutoSelecionado(produto);
    }, [produto]);

    if (!isOpen) return null;

    const removerProduto = (id: number) => {
        deleteProduto(token!, id)
    };

    if (!produtoSelecionado) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 p-4">
            <div
                key={produtoSelecionado?.id}
                className="bg-gray-100 shadow-lg rounded-xl p-6 pt-4 flex flex-col justify-between border-t-4 border-[var(--navy)]"
            >
                <div>
                    <div className="flex justify-between items-center p-2 bg-[var(--sunshine)]/20 rounded-2xl border-1 border-[var(--navy)]/20">
                        <h2 className="text-xl text-[var(--navy)] font-semibold mb-2 mr-4 truncate">{produtoSelecionado.nome}</h2>
                        <div className="flex justify-between items-center gap-2">
                            <button
                                onClick={() => {
                                    if (typeof produtoSelecionado.id === "number") {
                                        setProdutoEditSelecionado(produtoSelecionado);
                                    } else {
                                        setProdutoEditSelecionado(null);
                                    }
                                    setIsEditingModalOpen(true);
                                }}
                                className="w-full bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                            >
                                <MdEdit />
                            </button>
                            {produtoEditSelecionado && (
                                <EditProdutoModal
                                    isOpen={isEditingModalOpen}
                                    onClose={() => { setIsEditingModalOpen(false) }}
                                    onSave={(produto) => {
                                        setIsEditingModalOpen(false);
                                        setEdited(true);
                                        setProdutoSelecionado(produto);
                                    }}
                                    produto={produtoEditSelecionado}
                                />
                            )}
                            <button
                                onClick={() => {
                                    if (typeof produtoSelecionado.id === "number") {
                                        setProdutoRemoveSelecionado(produtoSelecionado.id);
                                    } else {
                                        setProdutoRemoveSelecionado(null);
                                    }
                                    setModalOpen(true);
                                }}
                                className="w-full bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                            >
                                <MdDelete />
                            </button>
                            <ConfirmModal
                                isOpen={modalOpen}
                                onClose={() => setModalOpen(false)}
                                onConfirm={() => {produtoRemoveSelecionado && removerProduto(produtoRemoveSelecionado); onClose(edited, true, produtoSelecionado); }}
                                title="Excluir produto"
                                message="Tem certeza que deseja remover este produto? Essa ação não poderá ser desfeita."
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-3 mt-2">
                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <MdDescription className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2>Descrição</h2>
                                <p className="text-gray-600">{produtoSelecionado.descricao}</p>
                            </div>
                        </div>
                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaBrazilianRealSign className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2>Preço</h2>
                                <p className="text-gray-600">R$ {produtoSelecionado.preco.toFixed(2).replace(".", ",")}</p>
                            </div>
                        </div>
                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaWarehouse className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2>Quantidade</h2>
                                <p className="text-gray-600">{produtoSelecionado.quantidade}</p>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => onClose(edited, deleted, produtoSelecionado)}
                        className="flex mt-2 justify-center">
                        <button className="bg-[var(--navy)] text-[var(--sunshine)] px-4 py-2 rounded-lg hover:bg-[var(--navy)]/90 transition-colors cursor-pointer w-full md:w-auto h-[3.125rem] flex items-center justify-center">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}