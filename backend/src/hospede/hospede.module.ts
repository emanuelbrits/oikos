import { Module } from '@nestjs/common';
import { HospedeService } from './hospede.service';
import { HospedeController } from './hospede.controller';

@Module({
  providers: [HospedeService],
  controllers: [HospedeController]
})
export class HospedeModule {}
