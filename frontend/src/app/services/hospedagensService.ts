import { Hospede } from "./hospedesService";
import { Quarto } from "./quartosService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Hospedagem {
  id: number;
  hospedeId: number;
  numeroQuarto: number;
  dataHoraEntrada: string;
  dataHoraSaidaPrevista: string;
  dataHoraSaida?: string | null;
  valorDiaria: number;
  formaPagamento: string;
  descontos: number;
  acrescimos: number;
  observacoes?: string;
  createdAt: string;
  hospede: Hospede;
  quarto: Quarto;
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

export async function getHospedagensByHospede(token: string, hospedeId: number): Promise<Hospedagem[]> {
  const res = await fetch(`${API_URL}/hospedagem?hospedeId=${hospedeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar hospedagens pelo hóspede");
  }

  return res.json();
}

export async function deleteHospedagem(token: string, id: number): Promise<Hospedagem[]> {
  const res = await fetch(`${API_URL}/hospedagem/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao remover hospedagem");
  }

  return res.json();
}

export async function createHospedagem(token: string, hospedeData: any) {
  try {
    const response = await fetch(`${API_URL}/hospedagem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hospedeData),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao criar hospedagem",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao criar hospedagem:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}

export async function updateHospedagem(token: string, id: number, hospedagemData: any) {
  try {
    const res = await fetch(`${API_URL}/hospedagem/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hospedagemData),
    });

    const data = await res.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao atualizar hospedagem",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao atualizar hospedagem:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}
