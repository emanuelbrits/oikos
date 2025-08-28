'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ConfirmModal from "./ConfirmModal";
import { MdContactPage, MdDelete, MdEdit } from "react-icons/md";
import EditHospedeModal from "./EditHospedeModal";
import { FaInfo } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { deleteHospede } from "../services/hospedesService";
import AddHospedagemModal from "./AddHospedagemModal";
import { useRouter } from "next/navigation";

export interface Hospede {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    telefone?: string;
    cep?: string;
    profissao: string;
    rua: string;
    bairro: string;
    cidade: string;
    numero: string;
    estado: string;
    complemento: string;
    criadoEm?: string;
}

interface HospedeModalProps {
    isOpen: boolean;
    onClose: (isEdited: boolean, isDeleted: boolean, hospede: Hospede) => void;
    hospede: Hospede;
}

export default function HospedeModal({ isOpen, onClose, hospede }: HospedeModalProps) {
    const { token } = useAuth();
    const [hospedeEditSelecionado, setHospedeEditSelecionado] = useState<Hospede | null>(null);
    const [hospedeSelecionado, setHospedeSelecionado] = useState<Hospede | null>(null);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [hospedeRemoveSelecionado, setHospedeRemoveSelecionado] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [edited, setEdited] = useState(false);
    const [deleted] = useState(false);
    const router = useRouter();
    const [isAddHospedagemModalOpen, setIsAddHospedagemModalOpen] = useState(false);

    useEffect(() => {
        setHospedeSelecionado(hospede);
    }, [hospede]);

    if (!isOpen) return null;

    const removerHospede = (id: number) => {
        deleteHospede(token!, id)
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

    const formatCEP = (value: string) => {
        let v = value.replace(/\D/g, "");
        if (v.length > 8) v = v.slice(0, 8);
        if (v.length === 8) {
            return `${v.slice(0, 5)}-${v.slice(5)}`;
        }
        return v;
    };

    if (!hospedeSelecionado) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 p-4">
            <div
                key={hospedeSelecionado?.id}
                className="bg-gray-100 shadow-lg rounded-xl p-6 pt-4 flex flex-col justify-between border-t-4 border-[var(--navy)]"
            >
                <div>
                    <div className="flex justify-between items-center p-2 bg-[var(--sunshine)]/20 rounded-2xl border-1 border-[var(--navy)]/20">
                        <h2 className="text-xl text-[var(--navy)] font-semibold mb-2 truncate">{hospedeSelecionado.nome}</h2>
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
                                    onClose={() => { setIsEditingModalOpen(false) }}
                                    onSave={(hospede) => {
                                        setIsEditingModalOpen(false);
                                        setEdited(true);
                                        setHospedeSelecionado(hospede);
                                    }}
                                    hospede={hospedeEditSelecionado}
                                />
                            )}
                            <button
                                onClick={() => {
                                    if (typeof hospede.id === "number") {
                                        setHospedeRemoveSelecionado(hospede.id);
                                    } else {
                                        setHospedeRemoveSelecionado(null);
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
                                onConfirm={() => { hospedeRemoveSelecionado && removerHospede(hospedeRemoveSelecionado); onClose(edited, true, hospedeSelecionado); }}
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
                                <p className="text-gray-600">{hospedeSelecionado.email}</p>
                                <p className="text-gray-600">{formatTelefone(hospedeSelecionado.telefone || "")}</p>
                            </div>
                        </div>
                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaInfo className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2>Informações</h2>
                                <p className="text-gray-600">CPF: {formatCPF(hospedeSelecionado.cpf)}</p>
                                <p className="text-gray-600"> Profissão: {hospedeSelecionado.profissao}</p>
                            </div>
                        </div>
                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaMapLocationDot className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2>Endereço</h2>
                                <p className="text-gray-600">{hospedeSelecionado.rua}, {hospedeSelecionado.numero} {hospedeSelecionado.complemento ? `- ${hospedeSelecionado.complemento}` : ""} - {hospedeSelecionado.bairro}, {hospedeSelecionado.cidade}-{hospedeSelecionado.estado} {hospedeSelecionado.cep ? `- ${formatCEP(hospedeSelecionado.cep)}` : ""}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 mt-4 justify-center">
                        <button
                            onClick={() => setIsAddHospedagemModalOpen(true)}
                            className="bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            Criar Hospedagem
                        </button>

                        <button
                            onClick={() => router.push(`/reservas?hospedeId=${hospedeSelecionado?.id}`)}
                            className="bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            Criar Reserva
                        </button>
                    </div>
                    {isAddHospedagemModalOpen && (
                        <AddHospedagemModal
                            isOpen={isAddHospedagemModalOpen}
                            onClose={() => setIsAddHospedagemModalOpen(false)}
                            onSave={() => {
                                setIsAddHospedagemModalOpen(false);
                                router.push('/hospedagens');
                            }}
                            initialHospedeId={hospedeSelecionado?.id}
                        />
                    )}
                    <div
                        onClick={() => onClose(edited, deleted, hospedeSelecionado)}
                        className="flex mt-2 justify-center">
                        <button className="bg-[var(--navy)] text-[var(--sunshine)] px-4 py-2 rounded-lg hover:bg-[var(--navy)]/90 transition-colors cursor-pointer w-full md:w-auto h-[3.125rem] flex items-center justify-center">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}