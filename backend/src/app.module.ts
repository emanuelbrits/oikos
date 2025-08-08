import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospedeModule } from './hospede/hospede.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { HospedagemModule } from './hospedagem/hospedagem.module';

@Module({
  imports: [HospedeModule, PrismaModule, HospedagemModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
