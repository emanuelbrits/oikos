import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ConsumoDiarioService } from './consumo_diario.service';
import { CreateConsumoDiarioDto } from './dto/create-consumo_diario.dto';
import { UpdateConsumoDiarioDto } from './dto/update-consumo_diario.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Consumo Diário')
@Controller('consumo-diario')
export class ConsumoDiarioController {
  constructor(private readonly service: ConsumoDiarioService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo consumo diário' })
  create(@Body() dto: CreateConsumoDiarioDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os consumos diários' })
  findAll() {
    return this.service.findAll();
  }

  @Get('hospedagem/:idHospedagem')
  @ApiOperation({ summary: 'Buscar Consumos Diários por ID da hospedagem' })
  findByHospedagemId(@Param('idHospedagem', ParseIntPipe) idHospedagem: number) {
    return this.service.findByHospedagemId(idHospedagem);
  }

  @Get('produto/:idProduto')
  @ApiOperation({ summary: 'Buscar Consumos Diários por ID do produto' })
  findByProdutoId(@Param('idProduto', ParseIntPipe) idProduto: number) {
    return this.service.findByProdutoId(idProduto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar consumo diário por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar consumo diário por ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateConsumoDiarioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover consumo diário por ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(+id);
  }
}
