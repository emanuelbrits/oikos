import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateConsumoDiarioDto {
    @ApiProperty({ example: 10, description: "ID da hospedagem relacionada ao consumo" })
    @IsInt()
    @Type(() => Number)
    hospedagemId: number;

    @ApiProperty({ example: 5, description: "ID do produto consumido" })
    @IsInt()
    @Type(() => Number)
    produtoId: number;

    @ApiProperty({ example: 2, description: "Quantidade consumida, deve ser no mínimo 1" })
    @Min(1)
    @Type(() => Number)
    quantidade: number;

    @ApiProperty({ example: 15.5, description: "Valor unitário do produto, deve ser maior ou igual a zero" })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    valorUnitario: number;

    @ApiProperty({ example: "Cartão de Crédito", description: "Forma de pagamento usada para o consumo" })
    @IsString()
    @IsNotEmpty()
    formaPagamento: string;
}