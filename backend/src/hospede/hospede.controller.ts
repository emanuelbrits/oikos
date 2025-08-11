import { Body, Controller, Get, Post, Param, Patch, Delete, UsePipes, ValidationPipe, ParseIntPipe, Query } from '@nestjs/common';
import { HospedeService } from './hospede.service';
import { CreateHospedeDto } from './dto/create-hospede.dto';
import { UpdateHospedeDto } from './dto/update-hospede.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('hospedes')
export class HospedeController {
  constructor(private readonly service: HospedeService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um novo hóspede' })
  @ApiResponse({ status: 201, description: 'Hóspede criado com sucesso.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async criar(@Body() dto: CreateHospedeDto) {
    return this.service.criar(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os hóspedes' })
  listar() {
    return this.service.listar();
  }

  @UseGuards(JwtAuthGuard)
  @Get('buscar')
  @ApiOperation({ summary: 'Buscar por nome' })
  async buscarPorNome(@Query('nome') nome: string) {
    return this.service.buscarPorNome(nome);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar hóspede por ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um hóspede por ID' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHospedeDto,
  ) {
    return this.service.atualizar(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um hóspede por ID' })
  deletar(@Param('id') id: string) {
    return this.service.deletar(Number(id));
  }
}
