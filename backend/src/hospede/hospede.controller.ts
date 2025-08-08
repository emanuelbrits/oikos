import { Body, Controller, Get, Post, Param, Patch, Delete, UsePipes, ValidationPipe, ParseIntPipe, Query } from '@nestjs/common';
import { HospedeService } from './hospede.service';
import { CreateHospedeDto } from './dto/create-hospede.dto';
import { UpdateHospedeDto } from './dto/update-hospede.dto';

@Controller('hospedes')
export class HospedeController {
  constructor(private readonly service: HospedeService) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async criar(@Body() dto: CreateHospedeDto) {
    return this.service.criar(dto);
  }

  @Get()
  listar() {
    return this.service.listar();
  }

  @Get('buscar')
  async buscarPorNome(@Query('nome') nome: string) {
    return this.service.buscarPorNome(nome);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(Number(id));
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHospedeDto,
  ) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  deletar(@Param('id') id: string) {
    return this.service.deletar(Number(id));
  }
}
