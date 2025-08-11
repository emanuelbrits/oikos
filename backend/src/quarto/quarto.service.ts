import { Injectable } from '@nestjs/common';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuartoService {
  constructor(private prisma: PrismaService) { }

  create(data: CreateQuartoDto) {
    return this.prisma.quarto.create({ data });
  }

  findAll() {
    return this.prisma.quarto.findMany();
  }

  findOne(id: number) {
    return this.prisma.quarto.findUnique({ where: { id } });
  }

  findByNumero(numero: number) {
    return this.prisma.quarto.findMany({
      where: {
        numero: {
          equals: numero,
        },
      },
    });
  }

  update(id: number, updateQuartoDto: UpdateQuartoDto) {
    return this.prisma.quarto.update({
      where: { id },
      data: updateQuartoDto,
    });
  }

  remove(id: number) {
    return this.prisma.quarto.delete({
      where: { id },
    });
  }
}
