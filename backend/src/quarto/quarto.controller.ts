import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { QuartoService } from './quarto.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('quarto')
@Controller('quarto')
export class QuartoController {
  constructor(private readonly service: QuartoService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar novo quarto' })
  create(@Body() createQuartoDto: CreateQuartoDto) {
    return this.service.create(createQuartoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os quartos' })
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('buscar')
  @ApiOperation({ summary: 'Buscar quarto pelo número' })
  findByNumero(@Query('numero') numero: number) {
    return this.service.findByNumero(numero);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar quarto por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar quarto por ID' })
  update(@Param('id') id: string, @Body() updateQuartoDto: UpdateQuartoDto) {
    return this.service.update(+id, updateQuartoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover quarto por ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
