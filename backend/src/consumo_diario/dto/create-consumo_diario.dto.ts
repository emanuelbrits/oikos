import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateConsumoDiarioDto {
    @IsInt()
    @Type(() => Number)
    hospedagemId: number;

    @IsInt()
    @Type(() => Number)
    produtoId: number;

    @Min(1)
    @Type(() => Number)
    quantidade: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    valorUnitario: number;

    @IsString()
    @IsNotEmpty()
    formaPagamento: string;
}
