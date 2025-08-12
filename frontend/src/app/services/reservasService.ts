const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Reserva {
  id: string;
  hospedeId: string;
  numeroQuarto: number;
  dataHoraInicial: string;
  dataHoraFinal: string;
  status: string;
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

export async function getReservas(token: string): Promise<Reserva[]> {
  const res = await fetch(`${API_URL}/reserva`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar reservas");
  }

  return res.json();
}