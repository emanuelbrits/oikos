import { Injectable } from '@nestjs/common';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuartoService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateQuartoDto) {
    try {
      const quarto = await this.prisma.quarto.create({ data });
      return {
        success: true,
        data: quarto,
      };
    } catch (error: any) {
      console.error("Erro ao criar quarto:", error);

      let message = "Erro ao salvar o quarto.";

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

  async update(id: number, updateQuartoDto: UpdateQuartoDto) {
    try {
      const quarto = await this.prisma.quarto.update({ where: { id }, data: updateQuartoDto });
      return {
        success: true,
        data: quarto,
      };
    } catch (error: any) {
      console.error("Erro ao criar quarto:", error);

      let message = "Erro ao salvar o quarto.";

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
    return this.prisma.quarto.delete({
      where: { id },
    });
  }
}
