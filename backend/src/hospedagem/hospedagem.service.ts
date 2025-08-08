import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHospedagemDto } from './dto/create-hospedagem.dto';
import { UpdateHospedagemDto } from './dto/update-hospedagem.dto';

@Injectable()
export class HospedagemService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateHospedagemDto) {
    return this.prisma.hospedagem.create({
      data: {
        numeroQuarto: dto.numeroQuarto,
        dataHoraEntrada: new Date(dto.dataHoraEntrada),
        dataHoraSaida: new Date(dto.dataHoraSaida),
        valorDiaria: dto.valorDiaria,
        formaPagamento: dto.formaPagamento,
        descontos: dto.descontos,
        acrescimos: dto.acrescimos,
        observacoes: dto.observacoes,
        hospede: {
          connect: { id: dto.idHospede }
        }
      }
    });
  }

  findAll() {
    return this.prisma.hospedagem.findMany({ include: { hospede: true } });
  }

  async findOne(id: number) {
    const hospedagem = await this.prisma.hospedagem.findUnique({ where: { id }, include: { hospede: true } });
    if (!hospedagem) throw new NotFoundException('Hospedagem não encontrada');
    return hospedagem;
  }

  async findByNumeroQuarto(numeroQuarto: number) {
    const hospedagens = await this.prisma.hospedagem.findMany({
      where: { numeroQuarto },
      include: { hospede: true }
    });

    if (hospedagens.length === 0) throw new NotFoundException('Nenhuma hospedagem encontrada para este número de quarto.');
    return hospedagens;
  }

  async findByHospede(hospedeId: number) {
    const hospedagens = await this.prisma.hospedagem.findMany({
      where: { hospedeId },
      include: { hospede: true },
    });

    if (hospedagens.length === 0) {
      throw new NotFoundException('Nenhuma hospedagem encontrada para este hóspede.');
    }

    return hospedagens;
  }
  
  async update(id: number, dto: UpdateHospedagemDto) {
    await this.findOne(id);
    const dataHoraEntradaDate = dto.dataHoraEntrada ? new Date(dto.dataHoraEntrada) : undefined;
    const dataHoraSaidaDate = dto.dataHoraSaida ? new Date(dto.dataHoraSaida) : undefined;

    return this.prisma.hospedagem.update({
      where: { id },
      data: {
        numeroQuarto: dto.numeroQuarto,
        dataHoraEntrada: dataHoraEntradaDate,
        dataHoraSaida: dataHoraSaidaDate,
        valorDiaria: dto.valorDiaria,
        formaPagamento: dto.formaPagamento,
        descontos: dto.descontos,
        acrescimos: dto.acrescimos,
        observacoes: dto.observacoes,
        hospede: {
          connect: { id: dto.idHospede }
        }
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.hospedagem.delete({ where: { id } });
  }
}