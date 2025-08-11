import { PartialType } from '@nestjs/swagger';
import { CreateConsumoDiarioDto } from './create-consumo_diario.dto';

export class UpdateConsumoDiarioDto extends PartialType(CreateConsumoDiarioDto) {}
