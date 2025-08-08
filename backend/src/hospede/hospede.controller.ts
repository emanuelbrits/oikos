import { Body, Controller, Get, Post, Param, Patch, Delete } from '@nestjs/common';
import { HospedeService } from './hospede.service';

@Controller('hospedes')
export class HospedeController {
  constructor(private readonly service: HospedeService) {}

  @Post()
  criar(@Body() body: any) {
    return this.service.criar(body);
  }

  @Get()
  listar() {
    return this.service.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(Number(id));
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() body: any) {
    return this.service.atualizar(Number(id), body);
  }

  @Delete(':id')
  deletar(@Param('id') id: string) {
    return this.service.deletar(Number(id));
  }
}
