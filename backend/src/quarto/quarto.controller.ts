import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuartoService } from './quarto.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('quarto')
@Controller('quarto')
export class QuartoController {
  constructor(private readonly service: QuartoService) { }

  @Post()
  @ApiOperation({ summary: 'Criar novo quarto' })
  create(@Body() createQuartoDto: CreateQuartoDto) {
    return this.service.create(createQuartoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os quartos' })
  findAll() {
    return this.service.findAll();
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar quarto pelo número' })
  findByNumero(@Query('numero') numero: number) {
    return this.service.findByNumero(numero);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar quarto por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar quarto por ID' })
  update(@Param('id') id: string, @Body() updateQuartoDto: UpdateQuartoDto) {
    return this.service.update(+id, updateQuartoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover quarto por ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
