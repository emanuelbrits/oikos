const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Reserva {
  id: number;
  hospedeId: number;
  numeroQuarto: number;
  dataHoraInicial: string;
  dataHoraFinal: string;
  status: string;
  createdAt: string;
  formaPagamento: string;
  observacoes?: string;
  hospede: {
    id: number;
    nome: string;
    cidade: string;
    estado: string;
  };
  quarto: {
    id: number;
    numero: number;
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

export async function createReserva(token: string, reservaData: any) {
  try {
    const response = await fetch(`${API_URL}/reserva`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservaData),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao criar reserva",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao criar reserva:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}

export async function deleteReserva(token: string, id: number): Promise<Reserva[]> {
  const res = await fetch(`${API_URL}/reserva/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao remover reserva");
  }

  return res.json();
}

export async function updateReserva(token: string, id: number, reservaData: any) {
  try {
    const res = await fetch(`${API_URL}/reserva/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservaData),
    });

    const data = await res.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao atualizar reserva",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao atualizar reserva:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}