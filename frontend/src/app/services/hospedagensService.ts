const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Hospedagem {
  id: string;
  hospedeId: string;
  numeroQuarto: number;
  dataHoraEntrada: string;
  dataHoraSaida: string;
  valorDiaria: number;
  formaPagamento: string;
  createdAt: string;
  hospede: {
    id: string;
    nome: string;
    cidade: string;
    estado: string;
  };
  quarto: {
    numero: number;
    tipo: string;
  };
}

export async function getHospedagens(token: string): Promise<Hospedagem[]> {
  const res = await fetch(`${API_URL}/hospedagem`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar hospedagens");
  }

  return res.json();
}
