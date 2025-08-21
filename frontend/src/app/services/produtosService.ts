const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
}

export async function getProdutos(token: string): Promise<Produto[]> {
  const res = await fetch(`${API_URL}/produto`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  const produtos: Produto[] = await res.json();
  return produtos;
}

export async function getProdutosByName(token: string, nome: string): Promise<Produto[]> {
  const res = await fetch(`${API_URL}/produto/buscar/nome?nome=${nome}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar produto");
  }

  return res.json();
}

export async function createProduto(token: string, produtoData: any) {
  try {
    const response = await fetch(`${API_URL}/produto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(produtoData),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao criar produto",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao criar produto:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}

export async function deleteProduto(token: string, id: number): Promise<Produto[]> {
  const res = await fetch(`${API_URL}/produto/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao remover produto");
  }

  return res.json();
}

export async function updateProduto(token: string, id: number, produtoData: any) {
  try {
    const res = await fetch(`${API_URL}/produto/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produtoData),
    });

    const data = await res.json().catch(() => ({}));

    return {
      success: data?.success ?? false,
      message: data?.message || "Erro desconhecido ao atualizar produto",
      data: data?.data || null,
    };
  } catch (error: any) {
    console.error("Erro ao atualizar produto:", error);
    return {
      success: false,
      message: error?.message || "Erro de conexão com o servidor",
    };
  }
}