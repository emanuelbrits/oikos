import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  Matches,
} from 'class-validator';

export class CreateHospedeDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '12345678901' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos numéricos' })
  cpf: string;

  @ApiProperty({ example: 'joao@email.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '11999999999', required: false })
  @IsOptional()
  @Matches(/^\d{11}$/, { message: 'Telefone deve conter exatamente 11 dígitos numéricos' })
  telefone?: string;

  @ApiProperty({ example: 'Programador', required: false })
  @IsString()
  @IsOptional()
  profissao?: string;

  @ApiProperty({ example: '92749374' })
  @IsOptional()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter exatamente 8 dígitos numéricos' })
  cep?: string;

  @ApiProperty({ example: 'Rua das Flores' })
  @IsString()
  @IsNotEmpty()
  rua: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty({ example: 'Cidade X' })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({ example: '2534' })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty({ example: 'Estado Y' })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({ example: 'Apto 101', required: false })
  @IsString()
  @IsOptional()
  complemento?: string;
}
