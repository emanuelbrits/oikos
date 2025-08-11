import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospedeModule } from './hospede/hospede.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { HospedagemModule } from './hospedagem/hospedagem.module';
import { ProdutoModule } from './produto/produto.module';
import { ConsumoDiarioModule } from './consumo_diario/consumo_diario.module';

@Module({
  imports: [HospedeModule, PrismaModule, HospedagemModule, ProdutoModule, ConsumoDiarioModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
