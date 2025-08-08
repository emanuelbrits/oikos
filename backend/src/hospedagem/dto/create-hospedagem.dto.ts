import { IsInt, IsString, IsOptional, IsNumber, IsDateString, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHospedagemDto {
  @IsInt()
  @Type(() => Number)
  idHospede: number;

  @IsInt()
  @Type(() => Number)
  numeroQuarto: number;

  @IsDateString()
  dataHoraEntrada: string;

  @IsDateString()
  dataHoraSaida: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  valorDiaria: number;

  @IsString()
  formaPagamento: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  descontos?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  acrescimos?: number;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
