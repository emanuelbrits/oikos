const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Quarto {
  id?: number;
  numero: number;
  valorDiaria: number;
  status: string;
}

export async function getQuartos(token: string): Promise<Quarto[]> {
  const res = await fetch(`${API_URL}/quarto`, {
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

export async function getQuartosByNumber(token: string, numero: string): Promise<Quarto[]> {
  const res = await fetch(`${API_URL}/quarto?numero=${numero}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar quarto");
  }

  return res.json();
}

export async function createQuarto(token: string, quartoData: any) {
  try {
    const response = await fetch(`${API_URL}/quarto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(quartoData),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao criar quarto",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao criar quarto:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}

export async function updateQuarto(token: string, id: number, quartoData: any) {
  try {
    const response = await fetch(`${API_URL}/quarto/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(quartoData),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao atualizar quarto",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao atualizar quarto:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}

export async function deleteQuarto(token: string, id: number) {
  try {
    const response = await fetch(`${API_URL}/quarto/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao deletar quarto",
    };
  } catch (error: any) {
    console.error("Erro ao deletar quarto:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}