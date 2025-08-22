"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/loadingScreen";
import { deleteHospedagem, getHospedagens, Hospedagem } from "../services/hospedagensService";
import AddHospedagemModal from "../components/AddHospedagemModal";
import { getHospedes, Hospede } from "../services/hospedesService";
import { FaCalendarAlt, FaInfo, FaMoneyBillWave, FaSave } from "react-icons/fa";
import { FaPerson, FaX } from "react-icons/fa6";
import { getQuartos, Quarto } from "../services/quartosService";
import EditHospedagemModal from "../components/EditHospedagem";
import ConfirmModal from "../components/ConfirmModal";
import React from "react";
import { getProdutos, Produto } from "../services/produtosService";
import { createConsumoDiario, deleteConsumoDiario, updateConsumoDiario } from "../services/consumosDiario.Service";

export default function HospedagensPage() {
    const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
    const [hospedes, setHospedes] = useState<Hospede[]>([]);
    const [quartos, setQuartos] = useState<Quarto[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [hospedeId, setHospedeId] = useState("");
    const [quartoId, setQuartoId] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [maxButtons, setMaxButtons] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const { token } = useAuth();
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [hospedagemSelecionada, setHospedagemSelecionada] = useState<Hospedagem | null>(null);
    const [hospedagemEditSelecionada, setHospedagemEditSelecionada] = useState<Hospedagem | null>(null);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [edited, setEdited] = useState(false);
    const [hospedagemRemoveSelecionada, setHospedagemRemoveSelecionada] = useState<number | null>(null);
    const [consumoRemoveSelecionado, setConsumoRemoveSelecionado] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [novoProdutoId, setNovoProdutoId] = useState<number | null>(null);
    const [novoValorUnitario, setNovoValorUnitario] = useState("0,00");
    const [novaQuantidade, setNovaQuantidade] = useState("0");
    const [novaFormaPagamento, setNovaFormaPagamento] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedValues, setEditedValues] = useState<any>({});

    const adicionarProduto = async (idHospedagem: number) => {
        if (!token) return;

        const data = await createConsumoDiario(token, {
            hospedagemId: idHospedagem,
            produtoId: novoProdutoId,
            valorUnitario: parseFloat(novoValorUnitario),
            quantidade: parseInt(novaQuantidade),
            formaPagamento: novaFormaPagamento,
        });

        const novoConsumo = data.data;

        setNovoProdutoId(null);
        setNovoValorUnitario("0,00");
        setNovaQuantidade("0");
        setNovaFormaPagamento("");

        setHospedagens(hospedagens.map((h) => h.id === idHospedagem ? { ...h, Consumo_diario: [...h.Consumo_diario, novoConsumo] } : h));
    };

    const toggleRow = (id: number) => {
        setExpandedRow(prev => (prev === id ? null : id));
    };

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

    const filteredHospedagens = hospedeId === ""
        ? hospedagens
        : hospedagens.filter(h => h.hospede.id === Number(hospedeId));

    const indexOfLast = currentPage * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    const currentHospedagens = filteredHospedagens.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredHospedagens.length / ITEMS_PER_PAGE);

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
        carregarHospedagens();
        if (token) {
            Promise.all([getHospedes(token), getQuartos(token), getProdutos(token)]).then(([hospedesRes, quartosRes, produtoRes]) => {
                setHospedes(hospedesRes);
                setQuartos(quartosRes);
                setProdutos(produtoRes);
            });
        }
    }, [token]);

    const carregarHospedagens = async () => {
        if (token) {
            try {
                setLoading(true);
                const data = await getHospedagens(token);
                setHospedagens(data);
            } catch (error) {
                console.error("Erro ao buscar hospedagens:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const removerHospedagem = (id: number) => {
        deleteHospedagem(token!, id)
    };

    const removerConsumo = (id: number) => {
        deleteConsumoDiario(token!, id)
        setHospedagens(hospedagens.map((h) => ({
            ...h,
            Consumo_diario: h.Consumo_diario.filter(c => c.id !== id)
        })));
    };

    const salvarEdicao = async (id: number) => {
        try {
            const { id: _id, criadoEm, produto, ...valoresFiltrados } = editedValues;

            await updateConsumoDiario(token!, id, valoresFiltrados);

            setHospedagens(hospedagens.map(h => ({
                ...h,
                Consumo_diario: h.Consumo_diario.map(c =>
                    c.id === id ? { ...c, ...valoresFiltrados, produto: { ...c.produto, ...produtos.find(p => p.id === valoresFiltrados.produtoId) } } : c
                )
            })));

            setEditingId(null);
            setEditedValues({});
        } catch (error) {
            console.error("Erro ao salvar edição:", error);
        }
    };



    useEffect(() => {
        setNovoValorUnitario((produtos.find(p => p.id === novoProdutoId)?.preco || 0).toString());
    }, [novoProdutoId]);

    if (loading) return <LoadingScreen />;

    const formatCPF = (value: string) => {
        let v = value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
        else if (v.length > 6) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
        else if (v.length > 3) return `${v.slice(0, 3)}.${v.slice(3)}`;
        else return v;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-[var(--sunshine)]">
                <Sidebar title="Oikos" />

                <main className="flex-1 ml-0 p-6">
                    <h1 className="text-5xl text-[var(--navy)] font-semibold mb-6">Hospedagens</h1>

                    <div className="flex flex-col md:flex-row gap-4 mb-6 text-[var(--navy)] text-2xl w-full">
                        <div className="flex flex-col justify-end w-full md:w-auto">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-[var(--navy)] text-[var(--sunshine)] px-4 py-2 rounded-lg hover:bg-[var(--seaBlue)] transition-colors cursor-pointer w-full md:w-auto h-[3.125rem] flex items-center justify-center"
                            >
                                <MdAdd size={24} /> Hospedagem
                            </button>
                        </div>
                    </div>

                    <AddHospedagemModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onSave={() => {
                            setIsAddModalOpen(false);
                            carregarHospedagens();
                        }}
                    />

                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium">Hóspede</label>
                        <select
                            value={hospedeId}
                            onChange={(e) => { setHospedeId(e.target.value); setCurrentPage(1); }}
                            className="w-full p-2 bg-white border border-[var(--navy)]/20 mb-4"
                        >
                            <option value="">Todos</option>
                            {hospedes.map((h) => (
                                <option key={h.id} value={h.id}>
                                    {h.nome} - {formatCPF(h.cpf)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium">Quarto</label>
                        <select
                            value={quartoId}
                            onChange={(e) => { setQuartoId(e.target.value); setCurrentPage(1); }}
                            className="w-full p-2 bg-white border border-[var(--navy)]/20 mb-4"
                        >
                            <option value="">Todos</option>
                            {quartos.map((q) => (
                                <option key={q.id} value={q.id}>
                                    {q.numero}
                                </option>
                            ))}
                        </select>
                    </div>

                    {currentHospedagens.length === 0 ? (
                        <p className="text-6xl text-[var(--navy)]">Nenhuma hospedagem encontrada.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                                <thead className="bg-[var(--navy)] text-[var(--sunshine)]">
                                    <tr>
                                        <th className="text-center px-4 py-2">Quarto</th>
                                        <th className="text-center px-4 py-2">Data Entrada</th>
                                        <th className="text-center px-4 py-2">Data Saída prevista</th>
                                        <th className="text-center px-4 py-2">Data Saída</th>
                                        <th className="text-center px-4 py-2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {hospedagens.map((hospedagem) => (
                                        <React.Fragment key={hospedagem.id}>
                                            <tr>
                                                <td className="px-4 text-center py-2">{hospedagem.quarto.numero}</td>
                                                <td className="px-4 text-center py-2">
                                                    {new Date(hospedagem.dataHoraEntrada).toLocaleString("pt-BR")}
                                                </td>
                                                <td className="px-4 text-center py-2">
                                                    {new Date(hospedagem.dataHoraSaidaPrevista).toLocaleString("pt-BR")}
                                                </td>
                                                <td className="px-4 text-center py-2">
                                                    {hospedagem.dataHoraSaida
                                                        ? new Date(hospedagem.dataHoraSaida).toLocaleString("pt-BR")
                                                        : ""}
                                                </td>
                                                <td className="px-4 text-center py-2">
                                                    <button
                                                        onClick={() => toggleRow(hospedagem.id)}
                                                        className="bg-[var(--navy)] text-[var(--sunshine)] px-4 py-2 rounded-lg hover:bg-[var(--seaBlue)] transition-colors cursor-pointer"
                                                    >
                                                        {expandedRow === hospedagem.id ? "Ocultar" : "Ver detalhes"}
                                                    </button>
                                                </td>
                                            </tr>

                                            {expandedRow === hospedagem.id && (
                                                <tr>
                                                    <td colSpan={5} className="p-4 bg-gray-50">

                                                        <div className="flex justify-between">
                                                            <h3 className="font-semibold mb-2 text-lg">Detalhes da Hospedagem</h3>

                                                            <div className="flex justify-end gap-4 mb-4">
                                                                <button
                                                                    onClick={() => {
                                                                        if (typeof hospedagem.id === "number") {
                                                                            setHospedagemEditSelecionada(hospedagem);
                                                                        } else {
                                                                            setHospedagemEditSelecionada(null);
                                                                        }
                                                                        setIsEditingModalOpen(true);
                                                                    }}
                                                                    className="bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                                                >
                                                                    <MdEdit />
                                                                </button>
                                                                {hospedagemEditSelecionada && (
                                                                    <EditHospedagemModal
                                                                        isOpen={isEditingModalOpen}
                                                                        onClose={() => { setIsEditingModalOpen(false), setHospedagemEditSelecionada(null) }}
                                                                        onSave={(hospedagem) => {
                                                                            setIsEditingModalOpen(false);
                                                                            setHospedagens(hospedagens.map((h) => h.id === hospedagem.id ? hospedagem : h));
                                                                            setHospedagemSelecionada(hospedagem);
                                                                        }}
                                                                        hospedagem={hospedagemEditSelecionada}
                                                                    />
                                                                )}
                                                                <button
                                                                    onClick={() => {
                                                                        if (typeof hospedagem.id === "number") {
                                                                            setHospedagemRemoveSelecionada(hospedagem.id);
                                                                        } else {
                                                                            setHospedagemRemoveSelecionada(null);
                                                                        }
                                                                        setModalOpen(true);
                                                                    }}
                                                                    className="bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                                <ConfirmModal
                                                                    isOpen={modalOpen}
                                                                    onClose={() => setModalOpen(false)}
                                                                    onConfirm={() => { hospedagemRemoveSelecionada && removerHospedagem(hospedagemRemoveSelecionada); }}
                                                                    title="Excluir hospedagem"
                                                                    message="Tem certeza que deseja remover esta hospedagem? Essa ação não poderá ser desfeita."
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                                                                <FaInfo className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                                                                <div className="flex flex-col">
                                                                    <h2 className="text-xl text-[var(--navy)] font-semibold mb-2 truncate">Hospedagem {hospedagem.id}</h2>
                                                                </div>
                                                            </div>

                                                            <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                                                                <FaPerson className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                                                                <div className="flex flex-col">
                                                                    <h2 className="text-xl text-[var(--navy)] font-semibold mb-2 truncate">{hospedagem.hospede.nome}</h2>
                                                                </div>
                                                            </div>

                                                            <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                                                                <FaCalendarAlt className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                                                                <div className="flex flex-col">
                                                                    <h2>Datas</h2>
                                                                    <p className="text-gray-600">
                                                                        Entrada: {new Date(hospedagem.dataHoraEntrada).toLocaleString("pt-BR")}
                                                                    </p>
                                                                    <p className="text-gray-600">
                                                                        Saída prevista: {new Date(hospedagem.dataHoraSaidaPrevista).toLocaleString("pt-BR")}
                                                                    </p>
                                                                    {hospedagem.dataHoraSaida && (
                                                                        <p className="text-gray-600">
                                                                            Saída: {new Date(hospedagem.dataHoraSaida).toLocaleString("pt-BR")}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                                                                <FaMoneyBillWave className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                                                                <div className="flex flex-col">
                                                                    <h2>Valores</h2>
                                                                    <p className="text-gray-600">
                                                                        Valor diária: {Number(hospedagem.valorDiaria).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                                    </p>
                                                                    <p className="text-gray-600">
                                                                        Forma de pagamento: {hospedagem.formaPagamento}
                                                                    </p>
                                                                    <p className="text-gray-600">
                                                                        Descontos: {Number(hospedagem.descontos).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                                    </p>
                                                                    <p className="text-gray-600">
                                                                        Acréscimos: {Number(hospedagem.acrescimos).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {hospedagem.Consumo_diario && hospedagem.Consumo_diario.length > 0 ? (
                                                            <>
                                                                <h2 className="text-2xl font-bold text-[var(--navy)] mt-4">Consumo Diário</h2>
                                                                <table className="min-w-full border border-gray-200 rounded-lg mt-4">
                                                                    <thead className="bg-gray-200">
                                                                        <tr>
                                                                            <th className="text-center px-2 py-1">Produto</th>
                                                                            <th className="text-center px-2 py-1">Valor Unitário</th>
                                                                            <th className="text-center px-2 py-1">Qtd</th>
                                                                            <th className="text-center px-2 py-1">Forma Pagamento</th>
                                                                            <th className="text-center px-2 py-1">Data</th>
                                                                            <th className="text-center px-2 py-1">Ações</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {hospedagem.Consumo_diario.map((c) => (
                                                                            <tr key={c.id}>
                                                                                <td className="px-2 py-1 text-center">
                                                                                    {editingId === c.id ? (
                                                                                        <select
                                                                                            value={editedValues.produtoId ?? c.produto.id}
                                                                                            onChange={(e) =>
                                                                                                setEditedValues({ ...editedValues, produtoId: Number(e.target.value) })
                                                                                            }
                                                                                            className="border px-2 py-1 rounded w-full"
                                                                                        >
                                                                                            {produtos.map((p) => (
                                                                                                <option key={p.id} value={p.id}>
                                                                                                    {p.nome}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                    ) : (
                                                                                        c.produto.nome
                                                                                    )}
                                                                                </td>

                                                                                <td className="px-2 py-1 text-center">
                                                                                    {editingId === c.id ? (
                                                                                        <input
                                                                                            type="number"
                                                                                            value={editedValues.valorUnitario ?? c.valorUnitario}
                                                                                            onChange={(e) =>
                                                                                                setEditedValues({ ...editedValues, valorUnitario: Number(e.target.value) })
                                                                                            }
                                                                                            className="border rounded px-2 py-1 w-full"
                                                                                        />
                                                                                    ) : (
                                                                                        c.valorUnitario.toLocaleString("pt-BR", {
                                                                                            style: "currency",
                                                                                            currency: "BRL",
                                                                                        })
                                                                                    )}
                                                                                </td>

                                                                                <td className="px-2 py-1 text-center">
                                                                                    {editingId === c.id ? (
                                                                                        <input
                                                                                            type="number"
                                                                                            value={editedValues.quantidade ?? c.quantidade}
                                                                                            onChange={(e) =>
                                                                                                setEditedValues({ ...editedValues, quantidade: Number(e.target.value) })
                                                                                            }
                                                                                            className="border rounded px-2 py-1 w-full"
                                                                                        />
                                                                                    ) : (
                                                                                        c.quantidade
                                                                                    )}
                                                                                </td>

                                                                                <td className="px-2 py-1 text-center">
                                                                                    {editingId === c.id ? (
                                                                                        <select
                                                                                            value={editedValues.formaPagamento ?? c.formaPagamento}
                                                                                            onChange={(e) =>
                                                                                                setEditedValues({ ...editedValues, formaPagamento: e.target.value })
                                                                                            }
                                                                                            className="border rounded px-2 py-1 w-full"
                                                                                        >
                                                                                            <option value="Dinheiro">Dinheiro</option>
                                                                                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                                                                                            <option value="Cartão de Débito">Cartão de Débito</option>
                                                                                            <option value="Pix">Pix</option>
                                                                                        </select>
                                                                                    ) : (
                                                                                        c.formaPagamento
                                                                                    )}
                                                                                </td>

                                                                                <td className="px-2 py-1 text-center">
                                                                                    {new Date(new Date(c.criadoEm).getTime() + 3 * 60 * 60 * 1000).toLocaleString("pt-BR")}
                                                                                </td>

                                                                                <td className="px-2 py-1 text-center flex gap-2 justify-center">
                                                                                    {editingId === c.id ? (
                                                                                        <>
                                                                                            <button
                                                                                                onClick={() => salvarEdicao(c.id)}
                                                                                                className="bg-green-500 hover:bg-green-600 text-white py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                                                                            >
                                                                                                <FaSave />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    setEditingId(null);
                                                                                                    setEditedValues({});
                                                                                                }}
                                                                                                className="bg-gray-300 hover:bg-gray-500 text-black py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                                                                            >
                                                                                                <FaX />
                                                                                            </button>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    setEditingId(c.id);
                                                                                                    setEditedValues(c);
                                                                                                }}
                                                                                                className="bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                                                                            >
                                                                                                <MdEdit />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    if (typeof c.id === "number") {
                                                                                                        setConsumoRemoveSelecionado(c.id);
                                                                                                    } else {
                                                                                                        setConsumoRemoveSelecionado(null);
                                                                                                    }
                                                                                                    setModalOpen(true);
                                                                                                }}
                                                                                                className="bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                                                                            >
                                                                                                <MdDelete />
                                                                                            </button>
                                                                                            <ConfirmModal
                                                                                                isOpen={modalOpen}
                                                                                                onClose={() => setModalOpen(false)}
                                                                                                onConfirm={() => { consumoRemoveSelecionado && removerConsumo(consumoRemoveSelecionado); }}
                                                                                                title="Excluir Consumo"
                                                                                                message="Tem certeza que deseja remover este consumo? Essa ação não poderá ser desfeita."
                                                                                            />
                                                                                        </>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ))}

                                                                        <tr>
                                                                            <td className="px-2 py-1 text-center">
                                                                                <select
                                                                                    value={novoProdutoId ?? ""}
                                                                                    onChange={(e) => setNovoProdutoId(e.target.value ? Number(e.target.value) : null)}
                                                                                    className="border rounded px-2 py-1 w-full"
                                                                                >
                                                                                    <option value="">Selecione um produto</option>
                                                                                    {produtos.map((p) => (
                                                                                        <option key={p.id} value={p.id}>
                                                                                            {p.nome}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </td>
                                                                            <td className="px-2 py-1 text-center">
                                                                                <input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    value={novoValorUnitario}
                                                                                    onChange={(e) => setNovoValorUnitario(e.target.value)}
                                                                                    className="border rounded px-2 py-1 w-full text-center"
                                                                                    placeholder="R$"
                                                                                />
                                                                            </td>
                                                                            <td className="px-2 py-1 text-center">
                                                                                <input
                                                                                    type="number"
                                                                                    value={novaQuantidade}
                                                                                    onChange={(e) => setNovaQuantidade(e.target.value)}
                                                                                    className="border rounded px-2 py-1 w-full text-center"
                                                                                    placeholder="Qtd"
                                                                                />
                                                                            </td>
                                                                            <td className="px-2 py-1 text-center">
                                                                                <select
                                                                                    value={novaFormaPagamento}
                                                                                    onChange={(e) => setNovaFormaPagamento(e.target.value)}
                                                                                    className="border rounded px-2 py-1 w-full"
                                                                                >
                                                                                    <option value="">Forma de Pagamento</option>
                                                                                    <option value="Dinheiro">Dinheiro</option>
                                                                                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                                                                                    <option value="Cartão de Débito">Cartão de Débito</option>
                                                                                    <option value="Pix">Pix</option>
                                                                                </select>
                                                                            </td>
                                                                            <td className="px-2 py-1 text-center">
                                                                                <button
                                                                                    onClick={() => adicionarProduto(hospedagem.id)}
                                                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                                                                                >
                                                                                    Adicionar
                                                                                </button>
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td className="text-center font-semibold">Total:</td>
                                                                            <td className="text-center font-semibold">{formatCurrency(hospedagem.Consumo_diario
                                                                                .reduce(
                                                                                    (sum, c) => sum + c.valorUnitario * c.quantidade,
                                                                                    0
                                                                                ))}</td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </>
                                                        ) : (
                                                            null
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}

