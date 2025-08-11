import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('reservas')
@Controller('reserva')
export class ReservaController {
  constructor(private readonly service: ReservaService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar nova reserva' })
  create(@Body() dto: CreateReservaDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todas as reservas' })
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('quarto/:numeroQuarto')
  @ApiOperation({ summary: 'Buscar reservas por número do quarto' })
  findByNumeroQuarto(@Param('numeroQuarto', ParseIntPipe) numeroQuarto: number) {
    return this.service.findByNumeroQuarto(numeroQuarto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('hospede/:idHospede')
  @ApiOperation({ summary: 'Buscar reservas por ID do hóspede' })
  findByHospede(@Param('idHospede', ParseIntPipe) idHospede: number) {
    return this.service.findByHospede(idHospede);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar reserva por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar reserva por ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReservaDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover reserva por ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
