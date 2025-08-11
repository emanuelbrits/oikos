import { Type } from "class-transformer";
import { IsInt, IsDateString, IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReservaDto {
    @ApiProperty({ example: 1, description: "ID do hóspede que está fazendo a reserva" })
    @IsInt()
    @Type(() => Number)
    idHospede: number;

    @ApiProperty({ example: 101, description: "ID do quarto reservado" })
    @IsInt()
    @Type(() => Number)
    quartoId: number;

    @ApiProperty({ example: "2025-08-15T14:00:00Z", description: "Data e hora de início da reserva (ISO 8601)" })
    @IsDateString()
    dataHoraInicial: string;

    @ApiProperty({ example: "2025-08-20T12:00:00Z", description: "Data e hora de fim da reserva (ISO 8601)" })
    @IsDateString()
    dataHoraFinal: string;

    @ApiProperty({ example: "Cartão de Crédito", description: "Forma de pagamento escolhida" })
    @IsString()
    @IsNotEmpty()
    formaPagamento: string;

    @ApiProperty({ example: "Confirmada", description: "Status atual da reserva" })
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiProperty({ example: "Hóspede pediu cama extra", description: "Observações adicionais da reserva" })
    @IsOptional()
    @IsString()
    observacoes?: string;
}
