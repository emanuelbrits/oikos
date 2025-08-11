import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ConsumoDiarioService } from './consumo_diario.service';
import { CreateConsumoDiarioDto } from './dto/create-consumo_diario.dto';
import { UpdateConsumoDiarioDto } from './dto/update-consumo_diario.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Consumo Diário')
@Controller('consumo-diario')
export class ConsumoDiarioController {
  constructor(private readonly service: ConsumoDiarioService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar novo consumo diário' })
  create(@Body() dto: CreateConsumoDiarioDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os consumos diários' })
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('hospedagem/:idHospedagem')
  @ApiOperation({ summary: 'Buscar Consumos Diários por ID da hospedagem' })
  findByHospedagemId(@Param('idHospedagem', ParseIntPipe) idHospedagem: number) {
    return this.service.findByHospedagemId(idHospedagem);
  }

  @UseGuards(JwtAuthGuard)
  @Get('produto/:idProduto')
  @ApiOperation({ summary: 'Buscar Consumos Diários por ID do produto' })
  findByProdutoId(@Param('idProduto', ParseIntPipe) idProduto: number) {
    return this.service.findByProdutoId(idProduto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar consumo diário por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar consumo diário por ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateConsumoDiarioDto) {
    return this.service.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover consumo diário por ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(+id);
  }
}
