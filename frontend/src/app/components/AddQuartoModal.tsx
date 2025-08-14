"use client";

import { useState, useEffect } from "react";
import { createQuarto } from "../services/quartosService";
import { useAuth } from "../contexts/AuthContext";

interface AddQuartoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddQuartoModal({ isOpen, onClose }: AddQuartoModalProps) {
    const { token } = useAuth();
    const [numero, setNumero] = useState("");
    const [valorDiaria, setValorDiaria] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setErrorMsg("");
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!token) return;

        const camposObrigatorios = { numero, valorDiaria };
        const camposVazios = Object.entries(camposObrigatorios).filter(([_, valor]) => !valor.trim());

        if (camposVazios.length > 0) {
            setErrorMsg("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await createQuarto(token, {
                numero,
                valorDiaria: Number(valorDiaria),
                status: "Disponível"
            });

            if (response.success) {
                onClose();
            } else {
                setErrorMsg(response.message || "Não foi possível salvar o quarto. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao salvar quarto:", error);
            setErrorMsg("Ocorreu um erro ao salvar. Tente novamente.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-gray-100 border-t-8 border-[var(--navy)] p-6 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Adicionar Quarto</h2>

                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Número</label>
                        <input
                            type="text"
                            placeholder="ex.: 10"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Preço da diária</label>
                        <input
                            type="number"
                            placeholder="ex.: 150"
                            value={valorDiaria}
                            onChange={(e) => setValorDiaria(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                {errorMsg && (
                    <p className="text-red-600 font-semibold mb-4">{errorMsg}</p>
                )}

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-[var(--navy)] text-white hover:bg-[var(--navy)]/90 transition-colors cursor-pointer"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
