"use client";

import { useEffect, useState } from "react";
import { deleteQuarto, getQuartos, getQuartosByNumber, Quarto } from "../services/quartosService";
import { useAuth } from "../contexts/AuthContext";
import { FiHome, FiLogOut } from "react-icons/fi";
import { MdAdd, MdBedroomParent, MdDelete, MdEdit } from "react-icons/md";
import { TbHotelService } from "react-icons/tb";
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
                <Sidebar title="Oikos"/>

                <main className="flex-1 ml-0 p-6">
                    <h1 className="text-5xl text-[var(--navy)] font-semibold mb-6">Quartos</h1>

                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Buscar quartos..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="bg-gray-100 border-1 border-[var(--navy)]/50 rounded-lg py-2 px-4 w-full"
                        />
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[var(--navy)] text-[var(--sunshine)] px-4 rounded-lg flex items-center justify-center hover:bg-[var(--navy)]/90 transition-colors cursor-pointer"
                        >
                            <MdAdd size={24} /> Quarto
                        </button>
                        <AddQuartoModal
                            isOpen={isAddModalOpen}
                            onClose={() => { carregarQuartos(); setIsAddModalOpen(false); }}
                        />
                    </div>

                    {quartos.length === 0 ? (
                        <p className="text-gray-500">Nenhum quarto encontrado.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {quartos.map((quarto) => (
                                <div
                                    key={quarto.id}
                                    className="bg-gray-100 shadow-lg rounded-xl p-6 pt-4 flex flex-col justify-between border-t-4 border-[var(--navy)]"
                                >
                                    <div className="flex justify-between items-center p-2 bg-[var(--sunshine)]/20 rounded-2xl border-1 border-[var(--navy)]/20">
                                        <h2 className="text-xl text-[var(--navy)] font-semibold mb-2 truncate">
                                            Quarto {quarto.numero}
                                        </h2>
                                        <div className="flex justify-between items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setQuartoEditSelecionado(quarto);
                                                    setIsEditingModalOpen(true);
                                                }}
                                                className="w-full bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <MdEdit />
                                            </button>
                                            {quartoEditSelecionado && (
                                                <EditQuartoModal
                                                    isOpen={isEditingModalOpen}
                                                    onClose={() => { carregarQuartos(); setIsEditingModalOpen(false); }}
                                                    quarto={quartoEditSelecionado}
                                                />
                                            )}
                                            <button
                                                onClick={() => {
                                                    setQuartoSelecionado(quarto.id || null);
                                                    setModalOpen(true);
                                                }}
                                                className="w-full bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <MdDelete />
                                            </button>
                                            <ConfirmModal
                                                isOpen={modalOpen}
                                                onClose={() => setModalOpen(false)}
                                                onConfirm={() => quartoSelecionado && removerQuarto(quartoSelecionado)}
                                                title="Excluir quarto"
                                                message="Tem certeza que deseja remover este quarto? Essa ação não poderá ser desfeita."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-3 mt-2">
                                        <p className="text-gray-600">Tipo: {quarto.tipo}</p>
                                        <p className="text-gray-600">Preço: R$ {quarto.valorDiaria}</p>
                                        <p
                                            className={`px-2 py-1 rounded-full text-white font-semibold ${quarto.status === "Disponível"
                                                ? "bg-green-600"
                                                : quarto.status === "Ocupado"
                                                    ? "bg-yellow-500"
                                                    : quarto.status === "Manutenção"
                                                        ? "bg-red-600"
                                                        : "bg-gray-400"
                                                }`}
                                        >
                                            Status: {quarto.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
