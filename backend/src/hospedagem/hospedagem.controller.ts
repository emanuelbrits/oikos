import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HospedagemService } from './hospedagem.service';
import { CreateHospedagemDto } from './dto/create-hospedagem.dto';
import { UpdateHospedagemDto } from './dto/update-hospedagem.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Hospedagem')
@Controller('hospedagem')
export class HospedagemController {
  constructor(private readonly service: HospedagemService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar nova hospedagem' })
  create(@Body() dto: CreateHospedagemDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todas as hospedagens' })
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('quarto/:numeroQuarto')
  @ApiOperation({ summary: 'Buscar hospedagens por número do quarto' })
  findByNumeroQuarto(@Param('numeroQuarto', ParseIntPipe) numeroQuarto: number) {
    return this.service.findByNumeroQuarto(numeroQuarto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('hospede/:idHospede')
  @ApiOperation({ summary: 'Buscar hospedagens por ID do hóspede' })
  findByHospede(@Param('idHospede', ParseIntPipe) idHospede: number) {
    return this.service.findByHospede(idHospede);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar hospedagem por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar hospedagem' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHospedagemDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover hospedagem' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}