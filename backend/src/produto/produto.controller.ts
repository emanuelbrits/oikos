import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('produto')
@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @Post()
  @ApiOperation({ summary: 'Criar novo produto' })
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtoService.create(createProdutoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  findAll() {
    return this.produtoService.findAll();
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar produtos por nome' })
  findByName(@Query('nome') nome: string) {
    return this.produtoService.findByName(nome);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  findOne(@Param('id') id: string) {
    return this.produtoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto por ID' })
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.update(+id, updateProdutoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover produto por ID' })
  remove(@Param('id') id: string) {
    return this.produtoService.remove(+id);
  }
}
