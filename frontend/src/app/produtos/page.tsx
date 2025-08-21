"use client";

import { useEffect, useState } from "react";
import { getHospedes, getHospedesByCPF, getHospedesByName, Hospede } from "../services/hospedesService";
import { useAuth } from "../contexts/AuthContext";
import { MdAdd } from "react-icons/md";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import AddHospedeModal from "../components/AddHospedeModal";
import LoadingScreen from "../components/loadingScreen";
import HospedeModal from "../components/hospedeModal";
import { getProdutos, getProdutosByName, Produto } from "../services/produtosService";
import AddProdutoModal from "../components/AddProdutoModal";
import ProdutoModal from "../components/produtoModal";

export default function ProdutosPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isProdutoModalOpen, setIsProdutoModalOpen] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [buscaNome, setBuscaNome] = useState("");
    const [maxButtons, setMaxButtons] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const { token } = useAuth();

    useEffect(() => {
        const updateMaxButtons = () => {
            const width = window.innerWidth;
            if (width < 424) setMaxButtons(3);
            else if (width < 768) setMaxButtons(4);
            else if (width < 1024) setMaxButtons(8);
            else setMaxButtons(12);
        };

        updateMaxButtons();
        window.addEventListener("resize", updateMaxButtons);

        return () => window.removeEventListener("resize", updateMaxButtons);
    }, []);

    const ITEMS_PER_PAGE = 20;

    const indexOfLast = currentPage * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    const currentProdutos = produtos.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(produtos.length / ITEMS_PER_PAGE);

    const half = Math.floor(maxButtons / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) endPage = Math.min(totalPages, maxButtons);
    if (currentPage + half > totalPages) startPage = Math.max(1, totalPages - maxButtons + 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        carregarProdutos();
    }, [token]);

    const buscarPorNome = () => {
        carregarProdutos();
        if (!buscaNome.trim() || !token) return;
        getProdutosByName(token, buscaNome).then(setProdutos);
        setCurrentPage(1);
    };

    const carregarProdutos = async () => {
        if (token)
            try {
                setLoading(true);
                const data = await getProdutos(token);
                setProdutos(data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setLoading(false);
            }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-[var(--sunshine)]">
                <Sidebar title="Oikos" />

                <main className="flex-1 ml-0 p-6">
                    <h1 className="text-5xl text-[var(--navy)] font-semibold mb-6">Produtos</h1>

                    <div>
                        <div className="flex flex-col md:flex-row gap-4 mb-6 text-[var(--navy)] text-2xl w-full">
                            <div className="flex flex-col flex-1 gap-2">
                                <label htmlFor="nome">Buscar pelo nome</label>
                                <div className="flex gap-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Buscar..."
                                        name="nome"
                                        value={buscaNome}
                                        onChange={(e) => setBuscaNome(e.target.value)}
                                        className="bg-gray-100 border border-[var(--navy)]/50 rounded-lg py-2 px-4 w-full"
                                    />
                                    <button
                                        onClick={buscarPorNome}
                                        className="bg-[var(--navy)] text-[var(--sunshine)] px-4 rounded-lg hover:bg-[var(--seaBlue)] transition-colors cursor-pointer h-[3.125rem]"
                                    >
                                        Buscar
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col justify-end w-full md:w-auto">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-[var(--navy)] text-[var(--sunshine)] px-4 py-2 rounded-lg hover:bg-[var(--seaBlue)] transition-colors cursor-pointer w-full md:w-auto h-[3.125rem] flex items-center justify-center"
                                >
                                    <MdAdd size={24} /> Produto
                                </button>
                            </div>

                        </div>
                        <AddProdutoModal
                            isOpen={isAddModalOpen}
                            onClose={() => { setIsAddModalOpen(false); }}
                            onSave={() => {
                                setIsAddModalOpen(false);
                                carregarProdutos();
                            }}
                        />

                    </div>

                    {produtos.length === 0 ? (
                        <p className="text-gray-500">Nenhum produto encontrado.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                                <thead className="bg-[var(--navy)] text-[var(--sunshine)]">
                                    <tr>
                                        <th className="text-center px-4 py-2">Produto</th>
                                        <th className="text-center px-4 py-2">Preço</th>
                                        <th className="text-center px-4 py-2">Quantidade</th>
                                        <th className="text-center px-4 py-2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentProdutos.map((produto) => (
                                        <tr key={produto.id}>
                                            <td className="px-4 text-center py-2">{produto.nome}</td>
                                            <td className="px-4 text-center py-2">{formatCurrency(produto.preco)}</td>
                                            <td className="px-4 text-center py-2">{produto.quantidade}</td>
                                            <td className="px-4 text-center py-2">
                                                <button
                                                    onClick={() => {
                                                        if (typeof produto.id === "number") setProdutoSelecionado(produto);
                                                        else setProdutoSelecionado(null);
                                                        setIsProdutoModalOpen(true);
                                                    }}
                                                    className="bg-[var(--navy)] text-[var(--sunshine)] px-4 py-2 rounded-lg hover:bg-[var(--seaBlue)] transition-colors cursor-pointer"
                                                >
                                                    Ver detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {produtoSelecionado && (
                                <ProdutoModal
                                    isOpen={isProdutoModalOpen}
                                    onClose={(edited, deleted, produto) => {
                                        setIsProdutoModalOpen(false);
                                        if (edited) {
                                            const novos = produtos.map((p) => (p.id === produto.id ? produto : p));
                                            setProdutos(novos);
                                        }

                                        if (deleted) {
                                            const novos = produtos.filter((p) => p.id !== produto.id);

                                            setProdutos(novos);
                                        }
                                    }}
                                    produto={produtoSelecionado}
                                />
                            )}

                            <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                                >
                                    Anterior
                                </button>

                                {pageNumbers.map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setCurrentPage(num)}
                                        className={`px-3 py-1 rounded-lg cursor-pointer ${currentPage === num
                                            ? "bg-[var(--navy)] text-[var(--sunshine)]"
                                            : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
