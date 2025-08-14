"use client";

import { useEffect, useState } from "react";
import { deleteHospede, getHospedes, getHospedesByName, Hospede } from "../services/hospedesService";
import { useAuth } from "../contexts/AuthContext";
import { FiHome, FiLogOut, FiX } from "react-icons/fi";
import { IoIosPerson } from "react-icons/io";
import { LuClock4, LuCupSoda } from "react-icons/lu";
import { MdAdd, MdBedroomParent, MdContactPage, MdDelete, MdEdit, MdOutlineShoppingCart } from "react-icons/md";
import { TbHotelService } from "react-icons/tb";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import { FaInfo } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import ConfirmModal from "../components/ConfirmModal";
import AddHospedeModal from "../components/AddHospedeModal";
import EditHospedeModal from "../components/EditHospedeModal";
import LoadingScreen from "../components/loadingScreen";

export default function HospedesPage() {
    const [hospedes, setHospedes] = useState<Hospede[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [hospedeSelecionado, setHospedeSelecionado] = useState<number | null>(null);
    const [hospedeEditSelecionado, setHospedeEditSelecionado] = useState<Hospede | null>(null);
    const [busca, setBusca] = useState("");
    const { token, logout } = useAuth();

    useEffect(() => {
        carregarHospedes()
    }, [token]);

    useEffect(() => {
        if (busca.trim() && token) {
            getHospedesByName(token, busca).then(setHospedes);
        } else {
            carregarHospedes();
        }
    }, [busca]);

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

    const removerHospede = (id: number) => {
        deleteHospede(token!, id)
        carregarHospedes();
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

    const formatTelefone = (value: string) => {
        let v = value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);

        if (v.length > 6) {
            return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
        } else if (v.length > 2) {
            return `(${v.slice(0, 2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
            return `(${v}`;
        }
        return "";
    };

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-[var(--sunshine)]">
                <Sidebar title="Oikos"/>

                <main className="flex-1 ml-0 p-6">
                    <h1 className="text-5xl text-[var(--navy)] font-semibold mb-6">Hóspedes</h1>

                    <div>
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                placeholder="Buscar hóspedes..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="bg-gray-100 border-1 border-[var(--navy)]/50 rounded-lg py-2 px-4 w-full"
                            />

                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-[var(--navy)] text-[var(--sunshine)] px-4 rounded-lg flex items-center justify-center hover:bg-[var(--navy)]/90 transition-colors cursor-pointer"
                            >
                                <MdAdd size={24} /> Hóspede
                            </button>
                        </div>

                        <AddHospedeModal
                            isOpen={isAddModalOpen}
                            onClose={() => { carregarHospedes(); setIsAddModalOpen(false); }}
                        />
                    </div>

                    {hospedes.length === 0 ? (
                        <p className="text-gray-500">Nenhum hóspede encontrado.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {hospedes.map((hospede) => (
                                <div
                                    key={hospede.id}
                                    className="bg-gray-100 shadow-lg rounded-xl p-6 pt-4 flex flex-col justify-between border-t-4 border-[var(--navy)]"
                                >
                                    <div>
                                        <div className="flex justify-between items-center p-2 bg-[var(--sunshine)]/20 rounded-2xl border-1 border-[var(--navy)]/20">
                                            <h2 className="text-xl text-[var(--navy)] font-semibold mb-2 truncate">{hospede.nome}</h2>
                                            <div className="flex justify-between items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (typeof hospede.id === "number") {
                                                            setHospedeEditSelecionado(hospede);
                                                        } else {
                                                            setHospedeEditSelecionado(null);
                                                        }
                                                        setIsEditingModalOpen(true);
                                                    }}
                                                    className="w-full bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <MdEdit />
                                                </button>
                                                {hospedeEditSelecionado && (
                                                    <EditHospedeModal
                                                        isOpen={isEditingModalOpen}
                                                        onClose={() => { carregarHospedes(); setIsEditingModalOpen(false) }}
                                                        hospede={hospedeEditSelecionado}
                                                    />
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (typeof hospede.id === "number") {
                                                            setHospedeSelecionado(hospede.id);
                                                        } else {
                                                            setHospedeSelecionado(null);
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
                                                    onConfirm={() => hospedeSelecionado && removerHospede(hospedeSelecionado)}
                                                    title="Excluir hóspede"
                                                    message="Tem certeza que deseja remover este hóspede? Essa ação não poderá ser desfeita."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-3 mt-2">
                                            <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                                                <MdContactPage className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                                                <div className="flex flex-col">
                                                    <h2>Contato</h2>
                                                    <p className="text-gray-600">{hospede.email}</p>
                                                    <p className="text-gray-600">{formatTelefone(hospede.telefone || "")}</p>
                                                </div>
                                            </div>
                                            <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                                                <FaInfo className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                                                <div className="flex flex-col">
                                                    <h2>Informações</h2>
                                                    <p className="text-gray-600">CPF: {formatCPF(hospede.cpf)}</p>
                                                    <p className="text-gray-600"> Profissão: {hospede.profissao}</p>
                                                </div>
                                            </div>
                                            <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                                                <FaMapLocationDot className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                                                <div className="flex flex-col">
                                                    <h2>Endereço</h2>
                                                    <p className="text-gray-600">{hospede.bairro}, {hospede.rua}, {hospede.complemento} - {hospede.cidade}/{hospede.estado}</p>
                                                </div>
                                            </div>
                                        </div>
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
