import { Module } from '@nestjs/common';
import { ConsumoDiarioService } from './consumo_diario.service';
import { ConsumoDiarioController } from './consumo_diario.controller';

@Module({
  controllers: [ConsumoDiarioController],
  providers: [ConsumoDiarioService],
})
export class ConsumoDiarioModule {}
