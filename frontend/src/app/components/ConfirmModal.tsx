import React, { useEffect } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
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
                <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 rounded-lg bg-[var(--mulberry)]/80 hover:bg-[var(--mulberry)] text-white transition-colors duration-200 cursor-pointer"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
