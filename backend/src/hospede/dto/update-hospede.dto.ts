import { PartialType } from '@nestjs/mapped-types';
import { CreateHospedeDto } from './create-hospede.dto';

export class UpdateHospedeDto extends PartialType(CreateHospedeDto) {}