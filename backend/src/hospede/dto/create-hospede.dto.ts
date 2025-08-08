import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  Matches,
} from 'class-validator';

export class CreateHospedeDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos numéricos' })
  cpf: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @Matches(/^\d{11}$/, { message: 'Telefone deve conter exatamente 11 dígitos numéricos' })
  telefone?: string;

  @IsString()
  @IsOptional()
  profissao?: string;

  @IsString()
  @IsNotEmpty()
  rua: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsOptional()
  complemento?: string;
}
