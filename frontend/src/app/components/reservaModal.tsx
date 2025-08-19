import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ConfirmModal from "./ConfirmModal";
import { FaBed, FaCalendarAlt, FaCreditCard, FaInfo, FaStickyNote } from "react-icons/fa";
import { deleteReserva, Reserva } from "../services/reservasService";
import { MdDelete, MdEdit } from "react-icons/md";
import EditReservaModal from "./EditReserva";
import { set } from "date-fns";

interface ReservaModalProps {
    isOpen: boolean;
    onClose: (isEdited: boolean, isDeleted: boolean, reserva: Reserva) => void;
    reserva: Reserva;
}

export default function ReservaModal({ isOpen, onClose, reserva }: ReservaModalProps) {
    const { token } = useAuth();
    const [reservaEditSelecionada, setReservaEditSelecionada] = useState<Reserva | null>(null);
    const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [reservaRemoveSelecionada, setReservaRemoveSelecionada] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [edited, setEdited] = useState(false);

    useEffect(() => {
        setReservaSelecionada(reserva);
    }, [reserva]);

    if (!isOpen) return null;

    const removeReserva = (id: number) => {
        deleteReserva(token!, id)
    };

    const formatarData = (dataString: string | Date): string => {
        if (!dataString) return "";

        const data = typeof dataString === "string" ? new Date(dataString) : dataString;

        if (isNaN(data.getTime())) return "";

        return data.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }


    if (!reservaSelecionada) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
            <div
                key={reservaSelecionada?.id}
                className="bg-gray-100 rounded-xl p-6 pt-4 flex flex-col justify-between border-t-4 border-[var(--navy)]"
            >
                <div>
                    <div className="flex justify-between items-center p-2 bg-[var(--sunshine)]/20 rounded-2xl border-1 border-[var(--navy)]/20">
                        <h2 className="text-2xl text-[var(--navy)] font-semibold mb-2 mr-3 truncate">
                            Reserva de {reservaSelecionada.hospede.nome}
                        </h2>
                        <div className="flex justify-between items-center gap-2">
                            <button
                                onClick={() => {
                                    if (typeof reservaSelecionada.id === "number") {
                                        setReservaEditSelecionada(reservaSelecionada);
                                    } else {
                                        setReservaEditSelecionada(null);
                                    }
                                    setIsEditingModalOpen(true);
                                }}
                                className="w-full bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                            >
                                <MdEdit />
                            </button>
                            {reservaEditSelecionada && (
                                <EditReservaModal
                                    isOpen={isEditingModalOpen}
                                    onClose={(edited) => {
                                        setEdited(edited);
                                        setIsEditingModalOpen(false);
                                    }}
                                    onSave={(reserva, edited) => {
                                        setEdited(edited);
                                        setReservaSelecionada(reserva);
                                        setIsEditingModalOpen(false);
                                    }}
                                    reserva={reservaEditSelecionada}
                                />
                            )}
                            <button
                                onClick={() => {
                                    if (typeof reservaSelecionada.id === "number") {
                                        setReservaRemoveSelecionada(reservaSelecionada.id);
                                    } else {
                                        setReservaRemoveSelecionada(null);
                                    }
                                    setModalOpen(true);
                                }}
                                className="w-full bg-[var(--sunshine)]/60 hover:bg-[var(--sunshine)] text-[var(--navy)] py-3 px-3 rounded-lg transition-colors cursor-pointer"
                            >
                                <MdDelete />
                            </button>
                            <ConfirmModal
                                isOpen={modalOpen}
                                onConfirm={() => {
                                    reservaRemoveSelecionada &&
                                        removeReserva(reservaRemoveSelecionada);
                                    onClose(edited, true, reservaSelecionada);
                                }}
                                onClose={() => setModalOpen(false)}
                                title="Excluir reserva"
                                message="Tem certeza que deseja remover esta reserva? Essa ação não poderá ser desfeita."
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3 mt-2">

                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaBed className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2 className="text-lg">Quarto {reservaSelecionada.quarto.numero}</h2>
                            </div>
                        </div>

                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaCalendarAlt className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2 className="text-lg">Data e hora de entrada</h2>
                                <p className="text-gray-600 text-base">
                                    {formatarData(reservaSelecionada.dataHoraInicial)}
                                </p>
                                <h2 className="mt-2 text-lg">Data e hora de saída</h2>
                                <p className="text-gray-600 text-base">
                                    {formatarData(reservaSelecionada.dataHoraFinal)}
                                </p>
                            </div>
                        </div>

                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaCreditCard className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2 className="text-lg">Forma de pagamento</h2>
                                <p className="text-gray-600 text-base">{reservaSelecionada.formaPagamento}</p>
                            </div>
                        </div>

                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaInfo className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2 className="text-lg">Status</h2>
                                <p className="text-gray-600 text-base">{reservaSelecionada.status}</p>
                            </div>
                        </div>

                        <div className="flex bg-[var(--sunshine)]/20 p-2 items-center gap-4 rounded-2xl border-1 border-[var(--navy)]/20">
                            <FaStickyNote className="text-5xl p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                            <div className="flex flex-col">
                                <h2 className="text-lg">Observações</h2>
                                <p className="text-gray-600 text-base">
                                    {reservaSelecionada.observacoes || "Sem observações"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => onClose(edited, false, reservaSelecionada)}
                        className="flex mt-2 justify-center"
                    >
                        <button className="bg-[var(--navy)] text-[var(--sunshine)] text-lg px-4 py-2 rounded-lg hover:bg-[var(--navy)]/90 transition-colors cursor-pointer w-full md:w-auto h-[3.125rem] flex items-center justify-center">
                            Fechar
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}