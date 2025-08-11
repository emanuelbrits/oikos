import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('reservas')
@Controller('reserva')
export class ReservaController {
  constructor(private readonly service: ReservaService) { }

  @Post()
  @ApiOperation({ summary: 'Criar nova reserva' })
  create(@Body() dto: CreateReservaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as reservas' })
  findAll() {
    return this.service.findAll();
  }

  @Get('quarto/:numeroQuarto')
  @ApiOperation({ summary: 'Buscar reservas por número do quarto' })
  findByNumeroQuarto(@Param('numeroQuarto', ParseIntPipe) numeroQuarto: number) {
    return this.service.findByNumeroQuarto(numeroQuarto);
  }

  @Get('hospede/:idHospede')
  @ApiOperation({ summary: 'Buscar reservas por ID do hóspede' })
  findByHospede(@Param('idHospede', ParseIntPipe) idHospede: number) {
    return this.service.findByHospede(idHospede);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar reserva por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar reserva por ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReservaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover reserva por ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
