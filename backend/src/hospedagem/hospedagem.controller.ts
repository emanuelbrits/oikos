import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { HospedagemService } from './hospedagem.service';
import { CreateHospedagemDto } from './dto/create-hospedagem.dto';
import { UpdateHospedagemDto } from './dto/update-hospedagem.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Hospedagem')
@Controller('hospedagem')
export class HospedagemController {
  constructor(private readonly service: HospedagemService) { }

  @Post()
  @ApiOperation({ summary: 'Criar nova hospedagem' })
  create(@Body() dto: CreateHospedagemDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as hospedagens' })
  findAll() {
    return this.service.findAll();
  }

  @Get('quarto/:numeroQuarto')
  @ApiOperation({ summary: 'Buscar hospedagens por número do quarto' })
  findByNumeroQuarto(@Param('numeroQuarto', ParseIntPipe) numeroQuarto: number) {
    return this.service.findByNumeroQuarto(numeroQuarto);
  }

  @Get('hospede/:idHospede')
  @ApiOperation({ summary: 'Buscar hospedagens por ID do hóspede' })
  findByHospede(@Param('idHospede', ParseIntPipe) idHospede: number) {
    return this.service.findByHospede(idHospede);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar hospedagem por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar hospedagem' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHospedagemDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover hospedagem' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}