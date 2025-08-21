import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.ProdutoCreateInput) {

    try {
      const produto = await this.prisma.produto.create({ data });
      return {
        success: true,
        data: produto,
      };
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);

      let message = "Erro ao salvar o produto.";

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

  findAll() {
    return this.prisma.produto.findMany();
  }

  findOne(id: number) {
    return this.prisma.produto.findUnique({ where: { id } });
  }

  async findByName(nome: string) {
    if (!nome) {
      return this.prisma.produto.findMany();
    }

    return this.prisma.produto.findMany({
      where: {
        nome: {
          contains: nome.toLowerCase(),
        },
      },
    });
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    try {
      const produto = await this.prisma.produto.update({
        where: { id },
        data: updateProdutoDto,
      });
      return {
        success: true,
        data: produto,
      };
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);

      let message = "Erro ao salvar o produto.";

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

  remove(id: number) {
    return this.prisma.produto.delete({ where: { id } });
  }
}
