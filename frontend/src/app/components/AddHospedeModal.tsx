import { useState, useEffect } from "react";
import { createHospede } from "../services/hospedesService";
import { useAuth } from "../contexts/AuthContext";

interface AddHospedeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddHospedeModal({ isOpen, onClose }: AddHospedeModalProps) {
    const { token } = useAuth();
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [profissao, setProfissao] = useState("");
    const [bairro, setBairro] = useState("");
    const [rua, setRua] = useState("");
    const [complemento, setComplemento] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
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
        if (!token) {
            console.error("Token não encontrado");
            return;
        }

        const camposObrigatorios = { nome, cpf, email, telefone, profissao, rua, bairro, cidade, estado };
        const camposVazios = Object.entries(camposObrigatorios).filter(([_, valor]) => !valor.trim());
        if (camposVazios.length > 0) {
            setErrorMsg("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await createHospede(token, {
                nome,
                cpf: cpf.replace(/\D/g, ""),
                email,
                telefone: telefone.replace(/\D/g, ""),
                profissao,
                rua,
                bairro,
                cidade,
                estado,
                complemento,
            });

            if (!response.success) {
                setErrorMsg(response.message);
                return;
            }

            onClose();
        } catch (error) {
            console.error("Erro ao salvar hóspede:", error);
            setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setTelefone(formatTelefone(rawValue));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            const numbersOnly = telefone.replace(/\D/g, "");
            setTelefone(numbersOnly.slice(0, -1));
            e.preventDefault();
        }
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-gray-100 border-t-8 border-[var(--navy)] p-6 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Adicionar Hóspede</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Nome</label>
                        <input
                            type="text"
                            placeholder="ex.: João Neto"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">CPF</label>
                        <input
                            type="text"
                            placeholder="xxx.xxx.xxx-xx"
                            value={cpf}
                            onChange={(e) => setCpf(formatCPF(e.target.value))}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">E-mail</label>
                        <input
                            type="email"
                            placeholder="exemplo@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Telefone</label>
                        <input
                            type="tel"
                            placeholder="(99) 99999-9999"
                            value={formatTelefone(telefone)}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Profissão</label>
                    <input
                        type="text"
                        placeholder="ex.: Engenheiro"
                        value={profissao}
                        onChange={(e) => setProfissao(e.target.value)}
                        className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Bairro</label>
                        <input
                            type="text"
                            placeholder="ex.: Centro"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Rua</label>
                        <input
                            type="text"
                            placeholder="ex.: Rua das Flores"
                            value={rua}
                            onChange={(e) => setRua(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Complemento</label>
                        <input
                            type="text"
                            placeholder="ex.: Apartamento 101"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Cidade</label>
                        <input
                            type="text"
                            placeholder="ex.: São Paulo"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Estado</label>
                        <input
                            type="text"
                            placeholder="ex.: SP"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
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
