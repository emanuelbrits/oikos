import { IsInt, IsString, IsOptional, IsNumber, IsDateString, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHospedagemDto {
  @ApiProperty({ example: 1, description: 'ID do hóspede já cadastrado' })
  @IsInt()
  @Type(() => Number)
  idHospede: number;

  @ApiProperty({ example: 101, description: 'ID do quarto já cadastrado' })
  @IsInt()
  @Type(() => Number)
  quartoId: number;

  @ApiProperty({ example: '2025-08-08T14:00:00Z', description: 'Data e hora de entrada no formato ISO 8601' })
  @IsDateString()
  dataHoraEntrada: string;

  @ApiProperty({ example: '2025-08-10T12:00:00Z', description: 'Data e hora de saída no formato ISO 8601' })
  @IsDateString()
  dataHoraSaida: string;

  @ApiProperty({ example: 150.0, description: 'Valor da diária (positivo)' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  valorDiaria: number;

  @ApiProperty({ example: 'dinheiro', description: 'Forma de pagamento utilizada' })
  @IsString()
  formaPagamento: string;

  @ApiPropertyOptional({ example: 0, description: 'Valor de desconto aplicado (mínimo 0)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  descontos?: number;

  @ApiPropertyOptional({ example: 0, description: 'Valor de acréscimo aplicado (mínimo 0)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  acrescimos?: number;

  @ApiPropertyOptional({ example: 'Cliente pediu silêncio no quarto.', description: 'Observações adicionais' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
