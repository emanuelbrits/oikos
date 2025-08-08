import { Test, TestingModule } from '@nestjs/testing';
import { HospedeService } from './hospede.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HospedeService', () => {
  let service: HospedeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HospedeService,
        {
          provide: PrismaService,
          useValue: {
            hospede: {
              create: jest.fn().mockResolvedValue({ id: 1, nome: 'Teste', email: 'teste@teste.com' }),
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HospedeService>(HospedeService);
  });

  it('deve criar um hóspede', async () => {
    const result = await service.criar({
      nome: 'Teste1', 
      email: 'teste@teste.com',
      cpf: '',
      rua: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
    expect(result).toHaveProperty('id');
    expect(result.nome).toBe('Teste');
  });

  it('deve listar hóspedes', async () => {
    const result = await service.listar();
    expect(result).toEqual([]);
  });
});
