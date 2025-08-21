import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHospedagemDto } from './dto/create-hospedagem.dto';
import { UpdateHospedagemDto } from './dto/update-hospedagem.dto';
@Injectable()
export class HospedagemService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateHospedagemDto) {
    const data = {
      dataHoraEntrada: new Date(dto.dataHoraEntrada),
      dataHoraSaidaPrevista: new Date(dto.dataHoraSaidaPrevista),
      valorDiaria: dto.valorDiaria,
      formaPagamento: dto.formaPagamento,
      descontos: dto.descontos,
      acrescimos: dto.acrescimos,
      observacoes: dto.observacoes,
      hospede: {
        connect: { id: dto.idHospede }
      },
      quarto: {
        connect: { id: dto.quartoId }
      }
    }

    try {
      const hospedagem = await this.prisma.hospedagem.create({ data });

      await this.prisma.quarto.update({
        where: { id: dto.quartoId },
        data: { status: "Ocupado" },
      });

      return {
        success: true,
        data: hospedagem,
      };
    } catch (error: any) {
      console.error("Erro ao criar hospedagem:", error);

      let message = "Erro ao salvar a hospedagem.";

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
    return this.prisma.hospedagem.findMany({ include: { hospede: true, quarto: true, Consumo_diario: { include: { produto: true } } } });
  }

  async findOne(id: number) {
    const hospedagem = await this.prisma.hospedagem.findUnique({ where: { id }, include: { hospede: true, quarto: true, Consumo_diario: true } });
    if (!hospedagem) throw new NotFoundException('Hospedagem não encontrada');
    return hospedagem;
  }

  async findByNumeroQuarto(numeroQuarto: number) {
    const hospedagens = await this.prisma.hospedagem.findMany({
      where: {
        quarto: { numero: numeroQuarto }
      },
      include: { hospede: true, quarto: true, Consumo_diario: true }
    });

    if (hospedagens.length === 0) {
      throw new NotFoundException('Nenhuma hospedagem encontrada para este número de quarto.');
    }

    return hospedagens;
  }

  async findByHospede(hospedeId: number) {
    const hospedagens = await this.prisma.hospedagem.findMany({
      where: { hospedeId },
      include: { hospede: true, quarto: true, Consumo_diario: true },
    });

    if (hospedagens.length === 0) {
      throw new NotFoundException('Nenhuma hospedagem encontrada para este hóspede.');
    }

    return hospedagens;
  }

  async update(id: number, dto: UpdateHospedagemDto) {
    const hospedagemExistente = await this.prisma.hospedagem.findUnique({
      where: { id },
      select: { quartoId: true },
    });

    if (!hospedagemExistente) throw new Error("Hospedagem não encontrada");

    const dataHoraEntradaDate = dto.dataHoraEntrada ? new Date(dto.dataHoraEntrada) : undefined;
    const dataHoraSaidaPrevistaDate = dto.dataHoraSaidaPrevista ? new Date(dto.dataHoraSaidaPrevista) : undefined;
    const dataHoraSaida = dto.dataHoraSaida ? new Date(dto.dataHoraSaida) : null;

    const data = {
      dataHoraEntrada: dataHoraEntradaDate,
      dataHoraSaidaPrevista: dataHoraSaidaPrevistaDate,
      dataHoraSaida: dataHoraSaida,
      valorDiaria: dto.valorDiaria,
      formaPagamento: dto.formaPagamento,
      descontos: dto.descontos,
      acrescimos: dto.acrescimos,
      observacoes: dto.observacoes,
      hospede: {
        connect: { id: dto.idHospede },
      },
      quarto: {
        connect: { id: dto.quartoId },
      },
    };

    try {
      const hospedagem = await this.prisma.hospedagem.update({
        where: { id },
        data,
      });

      if (hospedagemExistente.quartoId !== dto.quartoId) {
        await this.prisma.quarto.update({
          where: { id: hospedagemExistente.quartoId },
          data: { status: "Disponível" },
        });

        await this.prisma.quarto.update({
          where: { id: dto.quartoId },
          data: { status: "Ocupado" },
        });
      }

      return {
        success: true,
        data: hospedagem,
      };
    } catch (error: any) {
      console.error("Erro ao atualizar hospedagem:", error);

      let message = "Erro ao salvar a hospedagem.";

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
    const hospedagem = await this.prisma.hospedagem.findUnique({
      where: { id },
      select: { quartoId: true },
    });

    if (!hospedagem) throw new Error("Hospedagem não encontrada");

    await this.prisma.quarto.update({
      where: { id: hospedagem.quartoId },
      data: { status: "Disponível" },
    });

    return this.prisma.hospedagem.delete({ where: { id } });
  }

}