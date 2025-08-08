import { Module } from '@nestjs/common';
import { HospedagemService } from './hospedagem.service';
import { HospedagemController } from './hospedagem.controller';

@Module({
  controllers: [HospedagemController],
  providers: [HospedagemService],
})
export class HospedagemModule {}
