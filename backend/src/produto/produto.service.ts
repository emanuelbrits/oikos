import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ProdutoCreateInput) {
    return this.prisma.produto.create({ data });
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

  update(id: number, updateProdutoDto: UpdateProdutoDto) {
    return this.prisma.produto.update({
      where: { id },
      data: updateProdutoDto,
    });
  }

  remove(id: number) {
    return this.prisma.produto.delete({ where: { id } });
  }
}
