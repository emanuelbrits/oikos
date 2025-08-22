"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MdAdd, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/loadingScreen";
import AddProdutoModal from "../components/AddProdutoModal";
import { Consumo_diario, getConsumosDiarios } from "../services/consumosDiario.Service";
import React from "react";

export default function ConsumosPage() {
    const [consumos, setConsumos] = useState<Consumo_diario[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [maxButtons, setMaxButtons] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const { token } = useAuth();
    const [expanded, setExpanded] = useState<number | null>(null);

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
    const currentConsumos = consumos.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(consumos.length / ITEMS_PER_PAGE);

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
        carregarConsumos();
    }, [token]);

    const carregarConsumos = async () => {
        if (token)
            try {
                setLoading(true);
                const data = await getConsumosDiarios(token);
                console.log(data);

                setConsumos(data);
            } catch (error) {
                console.error("Erro ao buscar consumos diários:", error);
            } finally {
                setLoading(false);
            }
    };

    const agruparPorHospedagem = (consumos: Consumo_diario[]) => {
        const mapa = new Map<number, { hospedagem: any; consumos: Consumo_diario[], total: number }>();

        consumos.forEach((c) => {
            const hospId = c.hospedagem.id;
            if (!mapa.has(hospId)) {
                mapa.set(hospId, { hospedagem: c.hospedagem, consumos: [], total: 0 });
            }
            mapa.get(hospId)!.consumos.push(c);
            mapa.get(hospId)!.total += c.quantidade * c.valorUnitario;
        });

        return Array.from(mapa.values()).map((item) => ({
            ...item,
            ultimoConsumo: item.consumos
                .map((c) => new Date(c.criadoEm))
                .sort((a, b) => b.getTime() - a.getTime())[0],
        }));
    };

    const grupos = agruparPorHospedagem(consumos);

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
                    <h1 className="text-5xl text-[var(--navy)] font-semibold mb-6">Consumos diários</h1>

                    {consumos.length === 0 ? (
                        <p className="text-6xl text-[var(--navy)]">Nenhum consumo encontrado.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                                <thead className="bg-[var(--navy)] text-[var(--sunshine)]">
                                    <tr>
                                        <th className="text-center px-4 py-2">Hospedagem</th>
                                        <th className="text-center px-4 py-2">Quarto</th>
                                        <th className="text-center px-4 py-2">Hóspede</th>
                                        <th className="text-center px-4 py-2">Último consumo</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {grupos.map(({ hospedagem, consumos, total, ultimoConsumo }) => (
                                        <React.Fragment key={hospedagem.id}>
                                            <tr className="cursor-pointer" onClick={() => setExpanded(expanded === hospedagem.id ? null : hospedagem.id)}>
                                                <td className="px-4 text-center py-2">{hospedagem.id}</td>
                                                <td className="px-4 text-center py-2">{hospedagem.quarto.numero}</td>
                                                <td className="px-4 text-center py-2">{hospedagem.hospede.nome}</td>
                                                <td className="px-4 text-center py-2">{new Date(ultimoConsumo.getTime() + 3 * 60 * 60 * 1000).toLocaleString("pt-BR")}</td>
                                                <td className="px-2 text-center">
                                                    <button className="cursor-pointer" onClick={() => setExpanded(expanded === hospedagem.id ? null : hospedagem.id)}>
                                                        {expanded === hospedagem.id ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                                    </button>
                                                </td>
                                            </tr>

                                            {expanded === hospedagem.id && (
                                                <tr>
                                                    <td colSpan={5} className="bg-gray-50">
                                                        <div className="p-4">
                                                            <h3 className="font-semibold text-[var(--navy)] mb-2">Consumos:</h3>
                                                            <table className="w-full border border-gray-200">
                                                                <thead className="bg-gray-200">
                                                                    <tr>
                                                                        <th className="px-2 py-1">Produto</th>
                                                                        <th className="px-2 py-1">Preço</th>
                                                                        <th className="px-2 py-1">Quantidade</th>
                                                                        <th className="px-2 py-1">Forma de pagamento</th>
                                                                        <th className="px-2 py-1">Data</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {consumos.map((c) => (
                                                                        <tr key={c.id}>
                                                                            <td className="px-2 py-1 text-center">{c.produto.nome}</td>
                                                                            <td className="px-2 py-1 text-center">{formatCurrency(c.valorUnitario)}</td>
                                                                            <td className="px-2 py-1 text-center">{c.quantidade}</td>
                                                                            <td className="px-2 py-1 text-center">{c.formaPagamento}</td>
                                                                            <td className="px-2 py-1 text-center">
                                                                                {new Date(new Date(c.criadoEm).getTime() + 3 * 60 * 60 * 1000).toLocaleString("pt-BR")}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    <tr>
                                                                        <td className="text-center font-semibold">Total:</td>
                                                                        <td className="text-center font-semibold">{formatCurrency(total)}</td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>

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
            </div >
        </ProtectedRoute >
    );
}