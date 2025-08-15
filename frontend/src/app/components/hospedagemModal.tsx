import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ConfirmModal from "./ConfirmModal";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaBed, FaCalendarAlt, FaInfo, FaMoneyBillWave } from "react-icons/fa";
import { deleteHospedagem, Hospedagem } from "../services/hospedagensService";
import EditHospedagemModal from "./EditHospedagem";

interface HospedagemModalProps {
    isOpen: boolean;
    onClose: (isEdited: boolean, isDeleted: boolean, hospedagem: Hospedagem) => void;
    hospedagem: Hospedagem;
}

export default function HospedagemModal({ isOpen, onClose, hospedagem }: HospedagemModalProps) {
    const { token } = useAuth();
    const [hospedagemEditSelecionada, setHospedagemEditSelecionada] = useState<Hospedagem | null>(null);
    const [hospedagemSelecionada, setHospedagemSelecionada] = useState<Hospedagem | null>(null);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [hospedagemRemoveSelecionada, setHospedagemRemoveSelecionada] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [edited, setEdited] = useState(false);
    const [deleted] = useState(false);

    useEffect(() => {
        setHospedagemSelecionada(hospedagem);
    }, [hospedagem]);

    if (!isOpen) return null;

    const removerHospedagem = (id: number) => {
        deleteHospedagem(token!, id)
    };

    if (!hospedagemSelecionada) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 p-4 text-bold">
            <div
                key={hospedagemSelecionada?.id}
                className="bg-gray-100 shadow-lg rounded-xl p-6 pt-4 flex flex-col justify-between border-t-4 border-[var(--navy)]"
            >
                <div>
                    <div className="flex justify-between items-center p-2 bg-[var(--sunshine)]/20 rounded-2xl border-1 border-[var(--navy)]/20">
                        <h2 className="text-xl text-[var(--navy)] font-semibold mb-2 truncate">{hospedagemSelecionada.hospede.nome}</h2>
                        <div className="flex justify-between items-center gap-2">
                            <button
                                onClick={() => {
                                    if (typeof hospedagemSelecionada.id === "number") {
                                        setHospedagemEditSelecionada(hospedagemSelecionada);
                                    } else {
                                        setHospedagemEditSelecionada(null);
                                    }
                                    setIsEditingModalOpen(true);
                                }}
                                className="w-full bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                            >
                                <MdEdit />
                            </button>
                            {hospedagemEditSelecionada && (
                                <EditHospedagemModal
                                    isOpen={isEditingModalOpen}
                                    onClose={() => { setIsEditingModalOpen(false) }}
                                    onSave={(hospedagem) => {
                                        setIsEditingModalOpen(false);
                                        setEdited(true);
                                        setHospedagemSelecionada(hospedagem);
                                    }}
                                    hospedagem={hospedagemEditSelecionada}
                                />
                            )}
                            <button
                                onClick={() => {
                                    if (typeof hospedagemSelecionada.id === "number") {
                                        setHospedagemRemoveSelecionada(hospedagemSelecionada.id);
                                    } else {
                                        setHospedagemRemoveSelecionada(null);
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
                                onConfirm={() => { hospedagemRemoveSelecionada && removerHospedagem(hospedagemRemoveSelecionada); onClose(edited, true, hospedagemSelecionada); }}
                                title="Excluir hospedagem"
                                message="Tem certeza que deseja remover esta hospedagem? Essa ação não poderá ser desfeita."
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-3 mt-2">
                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaBed className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2>Quarto</h2>
                                <p className="text-gray-600">Número: {hospedagemSelecionada.quarto.numero}</p>
                            </div>
                        </div>

                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaCalendarAlt className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2>Datas</h2>
                                <p className="text-gray-600">
                                    Entrada: {new Date(hospedagemSelecionada.dataHoraEntrada).toLocaleString("pt-BR")}
                                </p>
                                <p className="text-gray-600">
                                    Saída prevista: {new Date(hospedagemSelecionada.dataHoraSaidaPrevista).toLocaleString("pt-BR")}
                                </p>
                                {hospedagemSelecionada.dataHoraSaida && (
                                    <p className="text-gray-600">
                                        Saída: {new Date(hospedagemSelecionada.dataHoraSaida).toLocaleString("pt-BR")}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaMoneyBillWave className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2>Valores</h2>
                                <p className="text-gray-600">
                                    Valor diária: {Number(hospedagemSelecionada.valorDiaria).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>
                                <p className="text-gray-600">
                                    Forma de pagamento: {hospedagemSelecionada.formaPagamento}
                                </p>
                                {hospedagemSelecionada.descontos > 0 && (
                                    <p className="text-gray-600">
                                        Descontos: {Number(hospedagemSelecionada.descontos).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </p>
                                )}
                                {hospedagemSelecionada.acrescimos > 0 && (
                                    <p className="text-gray-600">
                                        Acréscimos: {Number(hospedagemSelecionada.acrescimos).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </p>
                                )}
                            </div>
                        </div>

                        {hospedagemSelecionada.observacoes && (
                            <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                                <FaInfo className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                                <div className="flex flex-col">
                                    <h2>Observações</h2>
                                    <p className="text-gray-600">{hospedagemSelecionada.observacoes}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        onClick={() => onClose(edited, deleted, hospedagemSelecionada)}
                        className="flex mt-2 justify-center">
                        <button className="bg-[var(--navy)] text-[var(--sunshine)] px-4 py-2 rounded-lg hover:bg-[var(--navy)]/90 transition-colors cursor-pointer w-full md:w-auto h-[3.125rem] flex items-center justify-center">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}