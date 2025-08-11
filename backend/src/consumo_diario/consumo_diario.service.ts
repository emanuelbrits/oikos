import { Injectable } from '@nestjs/common';
import { CreateConsumoDiarioDto } from './dto/create-consumo_diario.dto';
import { UpdateConsumoDiarioDto } from './dto/update-consumo_diario.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConsumoDiarioService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreateConsumoDiarioDto) {
    return this.prisma.consumo_diario.create({
      data: {
        quantidade: dto.quantidade,
        valorUnitario: dto.valorUnitario,
        formaPagamento: dto.formaPagamento,
        hospedagem: {
          connect: { id: dto.hospedagemId }
        },
        produto: {
          connect: { id: dto.produtoId }
        }
      }
    })
  }

  findAll() {
    return this.prisma.consumo_diario.findMany({
      include: {
        hospedagem: true,
        produto: true
      }
    })
  }

  findOne(id: number) {
    return this.prisma.consumo_diario.findUnique({
      where: { id },
      include: {
        hospedagem: true,
        produto: true
      }
    })
  }

  findByHospedagemId(hospedagemId: number) {
    return this.prisma.consumo_diario.findMany({
      where: { hospedagemId },
      include: {
        hospedagem: true,
        produto: true
      }
    })
  }

  findByProdutoId(produtoId: number) {
    return this.prisma.consumo_diario.findMany({
      where: { produtoId },
      include: {
        hospedagem: true,
        produto: true
      }
    })
  }

  async update(id: number, dto: UpdateConsumoDiarioDto) {
    await this.findOne(id);
    return this.prisma.consumo_diario.update({
      where: { id },
      data: {
        quantidade: dto.quantidade,
        valorUnitario: dto.valorUnitario,
        formaPagamento: dto.formaPagamento,
        hospedagem: {
          connect: { id: dto.hospedagemId }
        },
        produto: {
          connect: { id: dto.produtoId }
        }
      }
    })
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.consumo_diario.delete({
      where: { id }
    })
  }
}
