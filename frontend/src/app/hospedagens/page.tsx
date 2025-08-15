"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MdAdd } from "react-icons/md";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/loadingScreen";
import { getHospedagens, Hospedagem } from "../services/hospedagensService";
import AddHospedagemModal from "../components/AddHospedagemModal";
import HospedagemModal from "../components/hospedagemModal";

export default function HospedagensPage() {
    const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isHospedeModalOpen, setIsHospedeModalOpen] = useState(false);
    const [hospedagemSelecionada, setHospedagemSelecionada] = useState<Hospedagem | null>(null);
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
    const currentHospedagens = hospedagens.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(hospedagens.length / ITEMS_PER_PAGE);

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
        carregarHospedagens()
    }, [token]);

    const carregarHospedagens = async () => {
        if (token)
            try {
                setLoading(true);
                const data = await getHospedagens(token);
                setHospedagens(data);
            } catch (error) {
                console.error("Erro ao buscar hospedagens:", error);
            } finally {
                setLoading(false);
            }
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
                    <h1 className="text-5xl text-[var(--navy)] font-semibold mb-6">Hospedagens</h1>

                    <div>
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
                            onClose={() => { setIsAddModalOpen(false); }}
                            onSave={() => {
                                setIsAddModalOpen(false);
                                carregarHospedagens();
                            }}
                        />

                    </div>

                    {hospedagens.length === 0 ? (
                        <p className="text-gray-500">Nenhuma hospedagem encontrada.</p>
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
                                    {currentHospedagens.map((hospedagem) => (
                                        <tr key={hospedagem.id}>
                                            <td className="px-4 text-center py-2">{hospedagem.quarto.numero}</td>
                                            <td className="px-4 text-center py-2">{new Date(hospedagem.dataHoraEntrada).toLocaleString("pt-BR")}</td>
                                            <td className="px-4 text-center py-2">{new Date(hospedagem.dataHoraSaidaPrevista).toLocaleString("pt-BR")}</td>
                                            <td className="px-4 text-center py-2">
                                                {hospedagem.dataHoraSaida ? (
                                                    new Date(hospedagem.dataHoraSaida).toLocaleString("pt-BR")
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                            <td className="px-4 text-center py-2">
                                                <button
                                                    onClick={() => {
                                                        if (typeof hospedagem.id === "number") setHospedagemSelecionada(hospedagem);
                                                        else setHospedagemSelecionada(null);
                                                        setIsHospedeModalOpen(true);
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

                            {hospedagemSelecionada && (
                                <HospedagemModal
                                    isOpen={isHospedeModalOpen}
                                    onClose={(edited, deleted, hospedagem) => {
                                        setIsHospedeModalOpen(false);
                                        if (edited)
                                            setHospedagens([
                                                ...hospedagens.filter((h) => h.id !== hospedagem.id),
                                                hospedagem,
                                            ]);
                                        if (deleted)
                                            setHospedagens(hospedagens.filter((h) => h.id !== hospedagem.id));
                                    }}
                                    hospedagem={hospedagemSelecionada}
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
