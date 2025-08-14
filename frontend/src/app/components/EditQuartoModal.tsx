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
        tipo: string;
        status: string;
    };
}

export default function EditQuartoModal({ isOpen, onClose, quarto }: EditQuartoModalProps) {
    const { token } = useAuth();
    const [numero, setNumero] = useState(quarto.numero.toString());
    const [tipo, setTipo] = useState(quarto.tipo);
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

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!token || !quarto.id) return;

        const camposObrigatorios = { numero, tipo, valorDiaria };
        const camposVazios = Object.entries(camposObrigatorios).filter(([_, valor]) => !valor.trim());

        if (camposVazios.length > 0) {
            setErrorMsg("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await updateQuarto(token, quarto.id, {
                numero: Number(numero),
                tipo: tipo,
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
                        <label className="block mb-1 text-sm font-medium">Tipo</label>
                        <div className="flex gap-4">
                            {["Standard", "Luxo", "Suíte"].map((opcao) => (
                                <label key={opcao} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="tipo"
                                        value={opcao}
                                        checked={tipo === opcao}
                                        onChange={(e) => setTipo(e.target.value)}
                                        className="accent-[var(--navy)]"
                                    />
                                    <span className="text-gray-700">{opcao}</span>
                                </label>
                            ))}
                        </div>
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
                        <div className="flex gap-4">
                            {["Disponível", "Ocupado", "Manutenção"].map((opcao) => (
                                <label key={opcao} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={opcao}
                                        checked={status === opcao}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="accent-[var(--navy)]"
                                    />
                                    <span className="text-gray-700">{opcao}</span>
                                </label>
                            ))}
                        </div>
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
