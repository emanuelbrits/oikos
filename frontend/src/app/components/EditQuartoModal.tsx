"use client";

import { useState, useEffect } from "react";
import { updateQuarto } from "../services/quartosService";
import { useAuth } from "../contexts/AuthContext";

interface EditQuartoModalProps {
    isOpen: boolean;
    onClose: () => void;
    quarto: {
        id?: number;
        numero: number;
        valorDiaria: number;
        status: string;
    };
}

export default function EditQuartoModal({ isOpen, onClose, quarto }: EditQuartoModalProps) {
    const { token } = useAuth();
    const [numero, setNumero] = useState(quarto.numero.toString());
    const [valorDiaria, setValorDiaria] = useState(quarto.valorDiaria.toString());
    const [status, setStatus] = useState(quarto.status);
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

    // Sincroniza o estado ao abrir o modal, mantendo o status inicial
    useEffect(() => {
        if (isOpen) {
            setNumero(quarto.numero.toString());
            setValorDiaria(quarto.valorDiaria.toString());
            setStatus(quarto.status);
        }
    }, [isOpen, quarto]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!token || !quarto.id) return;

        const camposObrigatorios = { numero, valorDiaria };
        const camposVazios = Object.entries(camposObrigatorios).filter(([_, valor]) => !valor.trim());

        if (camposVazios.length > 0) {
            setErrorMsg("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await updateQuarto(token, quarto.id, {
                numero: Number(numero),
                valorDiaria: Number(valorDiaria),
                status: status
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
                <h2 className="text-lg font-bold text-gray-800 mb-4">Editar Quarto</h2>

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

                    <div>
                        <label className="block mb-1 text-sm font-medium">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50  border-1 border-[var(--navy)]/20"
                        >
                            <option value="Disponível">Disponível</option>
                            <option value="Ocupado">Ocupado</option>
                            <option value="Manutenção">Manutenção</option>
                        </select>
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
