import { Test, TestingModule } from '@nestjs/testing';
import { HospedagemService } from './hospedagem.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('HospedagemService', () => {
  let service: HospedagemService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HospedagemService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<HospedagemService>(HospedagemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});

