import React, { useEffect } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenHospedagem: () => void;
    onOpenReserva: () => void;
}

export default function HospedeSaveModal({
    isOpen,
    onClose,
    onOpenHospedagem,
    onOpenReserva
}: ConfirmModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Hóspede Criado com sucesso.</h2>
                <p className="text-gray-600 mb-6">Deseja criar uma hospedagem ou reserva?</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            onOpenHospedagem();
                            onClose();
                        }}
                        className="px-4 py-2 rounded-lg bg-[var(--navy)]/80 hover:bg-[var(--navy)] text-white transition-colors duration-200 cursor-pointer"
                    >
                        Criar Hospedagem
                    </button>
                    <button
                        onClick={() => {
                            onOpenReserva();
                            onClose();
                        }}
                        className="px-4 py-2 rounded-lg bg-[var(--navy)]/80 hover:bg-[var(--navy)] text-white transition-colors duration-200 cursor-pointer"
                    >
                        Criar Reserva
                    </button>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
