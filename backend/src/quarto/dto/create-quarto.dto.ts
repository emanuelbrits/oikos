import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateQuartoDto {
    @ApiProperty({
        example: 12,
        description: "Número do quarto (entre 1 e 25)"
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(25)
    @Type(() => Number)
    numero: number;

    @ApiProperty({
        example: 200.50,
        description: "Valor da diária em reais (mínimo 0)"
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    valorDiaria: number;

    @ApiProperty({
        example: "suíte",
        description: "Tipo do quarto (ex.: suíte, standard, luxo)"
    })
    @IsNotEmpty()
    @IsString()
    tipo: string;

    @ApiProperty({
        example: "disponível",
        description: "Status atual do quarto (ex.: disponível, ocupado, manutenção)"
    })
    @IsNotEmpty()
    @IsString()
    status: string;
}
