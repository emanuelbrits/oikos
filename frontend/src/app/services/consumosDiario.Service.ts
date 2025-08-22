import { Hospedagem } from "./hospedagensService";
import { Produto } from "./produtosService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Consumo_diario {
  id: number;
  hospedagemId: number;
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
  formaPagamento: string;
  hospedagem: Hospedagem;
  produto: Produto;
  criadoEm: string;
}

export async function getConsumosDiarios(token: string): Promise<Consumo_diario[]> {
  const res = await fetch(`${API_URL}/consumo-diario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar consumos diários");
  }

  const consumosDiarios: Consumo_diario[] = await res.json();
  console.log(consumosDiarios);
  
  return consumosDiarios;
}

export async function createConsumoDiario(token: string, consumoData: any) {
  try {
    const response = await fetch(`${API_URL}/consumo-diario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(consumoData),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao criar consumo diário",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao criar consumo diário:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}

export async function deleteConsumoDiario(token: string, id: number): Promise<Consumo_diario[]> {
  const res = await fetch(`${API_URL}/consumo-diario/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao remover consumo diário");
  }

  return res.json();
}

export async function updateConsumoDiario(token: string, id: number, consumoData: any) {
  try {
    const res = await fetch(`${API_URL}/consumo-diario/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consumoData),
    });

    const data = await res.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao atualizar consumo diário",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao atualizar consumo diário:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}