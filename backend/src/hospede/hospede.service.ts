import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HospedeService {
  constructor(private prisma: PrismaService) {}

  async criar(data: Prisma.HospedeCreateInput) {
    return this.prisma.hospede.create({ data });
  }

  async listar() {
    return this.prisma.hospede.findMany();
  }

  async buscarPorId(id: number) {
    return this.prisma.hospede.findUnique({ where: { id } });
  }

  async atualizar(id: number, data: Prisma.HospedeUpdateInput) {
    return this.prisma.hospede.update({ where: { id }, data });
  }

  async deletar(id: number) {
    return this.prisma.hospede.delete({ where: { id } });
  }
}
