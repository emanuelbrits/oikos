const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Hospede {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  profissao: string;
  cep?: string;
  rua: string;
  bairro: string;
  cidade: string;
  numero: string;
  estado: string;
  complemento: string;
  criadoEm?: string;
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

export async function getHospedesByName(token: string, nome: string): Promise<Hospede[]> {
  const res = await fetch(`${API_URL}/hospedes/buscar/nome?nome=${nome}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar hóspede");
  }

  return res.json();
}

export async function getHospedesByCPF(token: string, cpf: string): Promise<Hospede[]> {
  const res = await fetch(`${API_URL}/hospedes/buscar/cpf?cpf=${cpf}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar hóspede");
  }

  return res.json();
}

export async function deleteHospede(token: string, id: number): Promise<Hospede[]> {
  const res = await fetch(`${API_URL}/hospedes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao remover hóspede");
  }

  return res.json();
}

export async function createHospede(token: string, hospedeData: any) {
  try {
    const response = await fetch(`${API_URL}/hospedes`, {
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
      message: data?.message || "Erro desconhecido ao criar hóspede",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao criar hóspede:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}

export async function updateHospede(token: string, id: number, hospedeData: any) {
  try {
    const res = await fetch(`${API_URL}/hospedes/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hospedeData),
    });

    const data = await res.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao atualizar hóspede",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao atualizar hóspede:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}