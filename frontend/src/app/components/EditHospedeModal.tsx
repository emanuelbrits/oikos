import { useState, useEffect } from "react";
import { updateHospede } from "../services/hospedesService";
import { useAuth } from "../contexts/AuthContext";

export interface Hospede {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    telefone?: string;
    profissao: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento: string;
    criadoEm?: string;
}

interface EditHospedeModalProps {
    isOpen: boolean;
    onClose: () => void;
    hospede: Hospede;
}

export default function EditHospedeModal({ isOpen, onClose, hospede }: EditHospedeModalProps) {
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

    // Preenche os campos quando o modal abrir
    useEffect(() => {
        if (isOpen && hospede) {
            setNome(hospede.nome);
            setCpf(hospede.cpf);
            setEmail(hospede.email);
            setTelefone(hospede.telefone || "");
            setProfissao(hospede.profissao);
            setBairro(hospede.bairro);
            setRua(hospede.rua);
            setComplemento(hospede.complemento || "");
            setCidade(hospede.cidade);
            setEstado(hospede.estado);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setErrorMsg("");
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, hospede]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!token || !hospede.id) return;

        const camposObrigatorios = { nome, cpf, email, telefone, profissao, rua, bairro, cidade, estado };
        const camposVazios = Object.entries(camposObrigatorios).filter(([_, valor]) => !valor.trim());

        if (camposVazios.length > 0) {
            setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const response = await updateHospede(token, hospede.id, {
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
            console.error("Erro ao atualizar hóspede:", error);
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

    const handleChangeTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 p-4">
            <div className="bg-gray-100 border-t-8 border-[var(--navy)] p-6 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Editar Hóspede</h2>

                {/* Inputs - igual ao modal de adicionar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">CPF</label>
                        <input
                            type="text"
                            placeholder="xxx.xxx.xxx-xx"
                            value={formatCPF(cpf)}
                            onChange={(e) => setCpf(formatCPF(e.target.value))}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">E-mail</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Telefone</label>
                        <input
                            type="tel"
                            placeholder="(99) 99999-9999"
                            value={formatTelefone(telefone)}
                            onChange={handleChangeTelefone}
                            onKeyDown={handleKeyDown}
                            className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20"
                        />
                    </div>
                </div>

                {/* Demais campos */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Profissão</label>
                    <input type="text" value={profissao} onChange={(e) => setProfissao(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Bairro</label>
                        <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Rua</label>
                        <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Complemento</label>
                    <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Cidade</label>
                        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Estado</label>
                        <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full p-2 bg-[var(--sunshine)]/50 rounded-2xl border-1 border-[var(--navy)]/20" />
                    </div>
                </div>

                {errorMsg && <p className="text-red-600 font-semibold mb-4">{errorMsg}</p>}

                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[var(--navy)] text-white hover:bg-[var(--navy)]/90 transition-colors cursor-pointer">Salvar</button>
                </div>
            </div>
        </div>
    );
}