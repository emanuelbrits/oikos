"use client";

import { useEffect, useState } from "react";
import { deleteQuarto, getQuartos, getQuartosByNumber, Quarto } from "../services/quartosService";
import { useAuth } from "../contexts/AuthContext";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import AddQuartoModal from "../components/AddQuartoModal";
import EditQuartoModal from "../components/EditQuartoModal";
import LoadingScreen from "../components/loadingScreen";

export default function QuartosPage() {
    const [quartos, setQuartos] = useState<Quarto[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [quartoSelecionado, setQuartoSelecionado] = useState<number | null>(null);
    const [quartoEditSelecionado, setQuartoEditSelecionado] = useState<Quarto | null>(null);
    const [busca, setBusca] = useState("");
    const { token, logout } = useAuth();

    useEffect(() => {
        carregarQuartos();
    }, [token]);

    useEffect(() => {
        if (busca.trim() && token) {
            getQuartosByNumber(token, busca).then(setQuartos);
        } else {
            carregarQuartos();
        }
    }, [busca]);

    const carregarQuartos = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await getQuartos(token);
            setQuartos(data);
        } catch (error) {
            console.error("Erro ao buscar quartos:", error);
        } finally {
            setLoading(false);
        }
    };

    const removerQuarto = async (id: number) => {
        if (!token) return;
        await deleteQuarto(token, id);
        carregarQuartos();
    };

    if (loading) return <LoadingScreen />;

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-[var(--sunshine)]">
                <Sidebar title="Oikos" />

                <main className="flex-1 ml-0 p-6">
                    <h1 className="text-5xl text-[var(--navy)] font-semibold mb-6">Quartos</h1>

                    <div className="flex justify-end gap-2 mb-6">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[var(--navy)] text-[var(--sunshine)] px-4 py-2 rounded-lg flex items-center justify-center hover:bg-[var(--navy)]/90 transition-colors cursor-pointer"
                        >
                            <MdAdd size={24} /> Quarto
                        </button>
                        <AddQuartoModal
                            isOpen={isAddModalOpen}
                            onClose={() => { carregarQuartos(); setIsAddModalOpen(false); }}
                        />
                    </div>

                    {quartos.length === 0 ? (
                        <p className="text-gray-500">Nenhum hóspede encontrado.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                                <thead className="bg-[var(--navy)] text-[var(--sunshine)]">
                                    <tr>
                                        <th className="text-center px-4 py-2">Número</th>
                                        <th className="text-center px-4 py-2">Status</th>
                                        <th className="text-center px-4 py-2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {quartos.map((quarto) => (
                                        <tr key={quarto.id}>
                                            <td className="px-4 text-center py-2">{quarto.numero}</td>
                                            <td className="px-4 text-center py-2">
                                                <span
                                                    className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full w-[8rem] ${quarto.status === "Disponível"
                                                        ? "bg-green-100 text-green-800 border-1 border-green-800 dark:bg-green-900 dark:text-green-300"
                                                        : quarto.status === "Ocupado"
                                                            ? "bg-yellow-100 text-yellow-800 border-1 border-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                            : quarto.status === "Manutenção"
                                                                ? "bg-red-100 text-red-800 border-1 border-red-800 dark:bg-red-900 dark:text-red-300"
                                                                : "bg-gray-100 text-gray-800 border-1 border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                                        }`}
                                                >
                                                    <span className={`w-2 h-2 me-1 rounded-full ${quarto.status === "Disponível"
                                                        ? "bg-green-500"
                                                        : quarto.status === "Ocupado"
                                                            ? "bg-yellow-500"
                                                            : quarto.status === "Manutenção"
                                                                ? "bg-red-500"
                                                                : "bg-gray-500"
                                                        }`}></span>
                                                    {quarto.status}
                                                </span>
                                            </td>
                                            <td className="flex flex-wrap justify-center px-4 py-2 gap-2">
                                                <button
                                                    onClick={() => {
                                                        setQuartoEditSelecionado(quarto);
                                                        setIsEditingModalOpen(true);
                                                    }}
                                                    className=" bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <MdEdit />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setQuartoSelecionado(quarto.id || null);
                                                        setModalOpen(true);
                                                    }}
                                                    className="bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <MdDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {quartoEditSelecionado && (
                                <EditQuartoModal
                                    isOpen={isEditingModalOpen}
                                    onClose={() => { carregarQuartos(); setIsEditingModalOpen(false); }}
                                    quarto={quartoEditSelecionado}
                                />
                            )}

                            <ConfirmModal
                                isOpen={modalOpen}
                                onClose={() => setModalOpen(false)}
                                onConfirm={() => quartoSelecionado && removerQuarto(quartoSelecionado)}
                                title="Excluir quarto"
                                message="Tem certeza que deseja remover este quarto? Essa ação não poderá ser desfeita."
                            />
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
