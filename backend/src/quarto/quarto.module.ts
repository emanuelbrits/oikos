import { Module } from '@nestjs/common';
import { QuartoService } from './quarto.service';
import { QuartoController } from './quarto.controller';

@Module({
  controllers: [QuartoController],
  providers: [QuartoService],
})
export class QuartoModule {}
