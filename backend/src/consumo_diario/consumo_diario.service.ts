import { Injectable } from '@nestjs/common';
import { CreateConsumoDiarioDto } from './dto/create-consumo_diario.dto';
import { UpdateConsumoDiarioDto } from './dto/update-consumo_diario.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConsumoDiarioService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateConsumoDiarioDto) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const consumo_diario = await prisma.consumo_diario.create({
          data: {
            quantidade: dto.quantidade,
            valorUnitario: dto.valorUnitario,
            formaPagamento: dto.formaPagamento,
            hospedagem: {
              connect: { id: dto.hospedagemId },
            },
            produto: {
              connect: { id: dto.produtoId },
            },
          },
          include: {
            produto: true,
          },
        });

        await prisma.produto.update({
          where: { id: dto.produtoId },
          data: {
            quantidade: {
              decrement: dto.quantidade,
            },
          },
        });

        await prisma.hospedagem.update({
          where: { id: dto.hospedagemId },
          data: {
            acrescimos: {
              increment: dto.quantidade * dto.valorUnitario,
            },
          },
        });

        return consumo_diario;
      });

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error("Erro ao criar consumo diário:", error);

      let message = "Erro ao salvar o consumo diário.";

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
    return this.prisma.consumo_diario.findMany({
      include: {
        hospedagem: {
          include: {
            quarto: true,
            hospede: true
          }
        },
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
    try {
      const consumo = await this.prisma.consumo_diario.update({
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
      return {
        success: true,
        data: consumo,
      };
    } catch (error: any) {
      console.error("Erro ao atualizar consumo diário:", error);

      let message = "Erro ao salvar o consumo diário.";

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

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.consumo_diario.delete({
      where: { id }
    })
  }
}
