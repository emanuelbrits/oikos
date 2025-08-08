import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProdutoDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    descricao: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    preco: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    quantidade: number;
}
