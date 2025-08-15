import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HospedeService {
  constructor(private prisma: PrismaService) { }

  async criar(data: Prisma.HospedeCreateInput) {
    try {
      const hospede = await this.prisma.hospede.create({ data });
      return {
        success: true,
        data: hospede,
      };
    } catch (error: any) {
      console.error("Erro ao criar hóspede:", error);

      let message = "Erro ao salvar o hóspede.";

      if (error.code === "P2002" && error.meta?.target) {
        const campos = Array.isArray(error.meta.target)
          ? error.meta.target.join(", ")
          : error.meta.target;

        message = `O valor informado para ${campos} já está cadastrado.`;
      }

      return {
        success: false,
        message,
      };
    }
  }

  async listar() {
    return this.prisma.hospede.findMany({
      orderBy: {
        nome: 'asc'
      }
    });
  }

  async buscarPorId(id: number) {
    return this.prisma.hospede.findUnique({ where: { id } });
  }

  async buscarPorNome(nome: string) {
    if (!nome) {
      return this.prisma.hospede.findMany();
    }

    return this.prisma.hospede.findMany({
      where: {
        nome: {
          contains: nome.toLowerCase(),
        },
      },
      orderBy: {
        nome: 'asc'
      }
    });
  }

  async buscarPorCPF(cpf: string) {
    if (!cpf) {
      return this.prisma.hospede.findMany();
    }

    return this.prisma.hospede.findMany({
      where: {
        cpf: {
          contains: cpf,
        },
      },
      orderBy: {
        nome: 'asc'
      }
    });
  }

  async atualizar(id: number, data: Prisma.HospedeUpdateInput) {
    try {
      const hospede = await this.prisma.hospede.update({ where: { id }, data });
      return {
        success: true,
        data: hospede,
      };
    } catch (error: any) {
      console.error("Erro ao atualizar hóspede:", error);

      let message = "Erro ao salvar o hóspede.";

      if (error.code === "P2002" && error.meta?.target) {
        const campos = Array.isArray(error.meta.target)
          ? error.meta.target.join(", ")
          : error.meta.target;

        message = `O valor informado para ${campos} já está cadastrado.`;
      }

      return {
        success: false,
        message,
      };
    }
  }

  async deletar(id: number) {
    return this.prisma.hospede.delete({ where: { id } });
  }
}
