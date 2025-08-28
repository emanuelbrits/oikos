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
import HospedeSaveModal from "../components/hospedeSaveModal";
import { useRouter } from "next/navigation";
import AddHospedagemModal from "../components/AddHospedagemModal";

export default function HospedesPage() {
    const [hospedes, setHospedes] = useState<Hospede[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isHospedeModalOpen, setIsHospedeModalOpen] = useState(false);
    const [isHospedeSaveModalOpen, setIsHospedeSaveModalOpen] = useState(false);
    const [isAddHospedagemModalOpen, setIsAddHospedagemModalOpen] = useState(false);
    const [hospedeSelecionado, setHospedeSelecionado] = useState<Hospede | null>(null);
    const [hospedeCriado, setHospedeCriado] = useState<Hospede | null>(null);
    const [buscaNome, setBuscaNome] = useState("");
    const [buscaCPF, setBuscaCPF] = useState("");
    const [maxButtons, setMaxButtons] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const { token } = useAuth();
    const router = useRouter();

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
    const currentHospedes = hospedes.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(hospedes.length / ITEMS_PER_PAGE);

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
        carregarHospedes()
    }, [token]);

    const buscarPorNome = async () => {
        setBuscaCPF("");
        if (!buscaNome.trim() || !token) {
            // Se não digitou nada, carrega todos
            await carregarHospedes();
            return;
        }

        setLoading(true);
        try {
            const resultados = await getHospedesByName(token, buscaNome);
            setHospedes(resultados);
            setCurrentPage(1);
        } catch (error) {
            console.error("Erro na busca por nome:", error);
        } finally {
            setLoading(false);
        }
    };

    const buscarPorCPF = async () => {
        setBuscaNome("");
        const cpfLimpo = buscaCPF.replace(/\D/g, "");
        if (!cpfLimpo || !token) {
            await carregarHospedes();
            return;
        }

        setLoading(true);
        try {
            const resultados = await getHospedesByCPF(token, cpfLimpo);
            setHospedes(resultados);
            setCurrentPage(1);
        } catch (error) {
            console.error("Erro na busca por CPF:", error);
        } finally {
            setLoading(false);
        }
    };

    const carregarHospedes = async () => {
        if (token)
            try {
                setLoading(true);
                const data = await getHospedes(token);
                setHospedes(data);
            } catch (error) {
                console.error("Erro ao buscar hóspedes:", error);
            } finally {
                setLoading(false);
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
                    <h1 className="text-5xl text-[var(--navy)] font-semibold mb-6">Hóspedes</h1>

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

                            <div className="flex flex-col flex-1 gap-2">
                                <label htmlFor="cpf">Buscar pelo CPF</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={buscaCPF}
                                        name="cpf"
                                        onChange={(e) => setBuscaCPF(formatCPF(e.target.value))}
                                        className="bg-gray-100 border border-[var(--navy)]/50 rounded-lg py-2 px-4 w-full"
                                    />
                                    <button
                                        onClick={buscarPorCPF}
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
                                    <MdAdd size={24} /> Hóspede
                                </button>
                            </div>

                        </div>
                        <AddHospedeModal
                            isOpen={isAddModalOpen}
                            onClose={() => { setIsAddModalOpen(false); }}
                            onSave={(novoHospede) => {

                                setHospedeCriado(novoHospede);
                                setIsHospedeSaveModalOpen(true);
                                setIsAddModalOpen(false);
                                carregarHospedes();
                            }}
                        />

                        <HospedeSaveModal
                            isOpen={isHospedeSaveModalOpen}
                            onClose={() => { setIsHospedeSaveModalOpen(false); }}
                            onOpenHospedagem={() => { setIsAddHospedagemModalOpen(true) }}
                            onOpenReserva={() => { router.push(`/reservas?hospedeId=${hospedeCriado?.id}`) }}
                        />

                        {isAddHospedagemModalOpen && (
                            <AddHospedagemModal
                                isOpen={isAddHospedagemModalOpen}
                                onClose={() => setIsAddHospedagemModalOpen(false)}
                                onSave={() => {
                                    setIsAddHospedagemModalOpen(false);
                                    router.push('/hospedagens');
                                }}
                                initialHospedeId={hospedeCriado?.id}
                            />
                        )}

                    </div>

                    {hospedes.length === 0 ? (
                        <p className="text-6xl text-[var(--navy)]">Nenhum hóspede encontrado.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                                <thead className="bg-[var(--navy)] text-[var(--sunshine)]">
                                    <tr>
                                        <th className="text-center px-4 py-2">Nome</th>
                                        <th className="text-center px-4 py-2">CPF</th>
                                        <th className="text-center px-4 py-2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentHospedes.map((hospede) => (
                                        <tr key={hospede.id}>
                                            <td className="px-4 text-center py-2">{hospede.nome}</td>
                                            <td className="px-4 text-center py-2">{formatCPF(hospede.cpf)}</td>
                                            <td className="px-4 text-center py-2">
                                                <button
                                                    onClick={() => {
                                                        if (typeof hospede.id === "number") setHospedeSelecionado(hospede);
                                                        else setHospedeSelecionado(null);
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

                            {hospedeSelecionado && (
                                <HospedeModal
                                    isOpen={isHospedeModalOpen}
                                    onClose={(edited, deleted, hospede) => {
                                        setIsHospedeModalOpen(false);
                                        if (edited)
                                            setHospedes([
                                                ...hospedes.filter((h) => h.id !== hospede.id),
                                                hospede,
                                            ]);
                                        if (deleted)
                                            setHospedes(hospedes.filter((h) => h.id !== hospede.id));
                                    }}
                                    hospede={hospedeSelecionado}
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
