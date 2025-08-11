import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProdutoDto {
    @ApiProperty({ example: "Refrigerante Coca-Cola", description: "Nome do produto" })
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({ example: "Refrigerante de cola 350ml", description: "Descrição do produto" })
    @IsString()
    descricao: string;

    @ApiProperty({ example: 4.50, description: "Preço unitário do produto, valor mínimo 0" })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    preco: number;

    @ApiProperty({ example: 100, description: "Quantidade disponível em estoque, mínimo 0" })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    quantidade: number;
}
