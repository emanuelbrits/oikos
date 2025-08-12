const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Hospede {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  createdAt: string;
  cidade: string;
  estado: string;
}

export async function getHospedes(token: string): Promise<Hospede[]> {
  const res = await fetch(`${API_URL}/hospedes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar hóspedes");
  }

  return res.json();
}