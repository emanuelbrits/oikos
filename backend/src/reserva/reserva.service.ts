import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReservaService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreateReservaDto) {
    return this.prisma.reserva.create({
      data: {
        dataHoraInicial: new Date(dto.dataHoraInicial),
        dataHoraFinal: new Date(dto.dataHoraFinal),
        formaPagamento: dto.formaPagamento,
        status: dto.status,
        observacoes: dto.observacoes,
        hospede: {
          connect: { id: dto.idHospede }
        },
        quarto: {
          connect: { id: dto.quartoId }
        }
      }
    })
  }

  findAll() {
    return this.prisma.reserva.findMany({ include: { hospede: true, quarto: true } });
  }

  findOne(id: number) {
    return this.prisma.reserva.findUnique({
      where: { id },
      include: { hospede: true, quarto: true }
    });
  }

  async findByNumeroQuarto(numeroQuarto: number) {
    const reservas = await this.prisma.reserva.findMany({
      where: {
        quarto: { numero: numeroQuarto }
      },
      include: { hospede: true, quarto: true }
    });

    if (reservas.length === 0) {
      throw new NotFoundException('Nenhuma reserva encontrada para este número de quarto.');
    }

    return reservas;
  }

  async findByHospede(hospedeId: number) {
    const reservas = await this.prisma.reserva.findMany({
      where: { hospedeId },
      include: { hospede: true, quarto: true },
    });

    if (reservas.length === 0) {
      throw new NotFoundException('Nenhuma reserva encontrada para este hóspede.');
    }

    return reservas;
  }

  async update(id: number, dto: UpdateReservaDto) {
    await this.findOne(id);
    const dataHoraInicialDate = dto.dataHoraInicial ? new Date(dto.dataHoraInicial) : undefined;
    const dataHoraFinalDate = dto.dataHoraFinal ? new Date(dto.dataHoraFinal) : undefined;

    return this.prisma.reserva.update({
      where: { id },
      data: {
        dataHoraInicial: dataHoraInicialDate,
        dataHoraFinal: dataHoraFinalDate,
        formaPagamento: dto.formaPagamento,
        status: dto.status,
        observacoes: dto.observacoes,
        hospede: {
          connect: { id: dto.idHospede }
        },
        quarto: {
          connect: { id: dto.quartoId }
        }
      }
    });
  }

  remove(id: number) {
    return this.prisma.reserva.delete({ where: { id } });
  }
}
