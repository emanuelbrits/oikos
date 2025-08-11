import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ConsumoDiarioController } from './consumo_diario.controller';
import { ConsumoDiarioService } from './consumo_diario.service';
import { CreateConsumoDiarioDto } from './dto/create-consumo_diario.dto';

describe('ConsumoDiarioController (e2e-like validation)', () => {
  let app: INestApplication;
  let service: ConsumoDiarioService;

  const mockService = {
    create: jest.fn(dto => ({ id: 1, ...dto })),
    findAll: jest.fn(),
    findByHospedagemId: jest.fn(),
    findByProdutoId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ConsumoDiarioController],
      providers: [
        { provide: ConsumoDiarioService, useValue: mockService }
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    service = moduleFixture.get<ConsumoDiarioService>(ConsumoDiarioService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /consumo-diario', () => {
    it('✅ deve criar quando todos os campos são válidos', async () => {
      const dto: CreateConsumoDiarioDto = {
        hospedagemId: 1,
        produtoId: 2,
        quantidade: 3,
        valorUnitario: 10.5,
        formaPagamento: 'dinheiro',
      };

      const res = await request(app.getHttpServer())
        .post('/consumo-diario')
        .send(dto)
        .expect(201);

      expect(res.body).toEqual(expect.objectContaining(dto));
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('❌ deve falhar se algum campo obrigatório estiver faltando', async () => {
      const dto = {
        produtoId: 2, // hospedagemId está faltando
        quantidade: 3,
        valorUnitario: 10.5,
        dataConsumo: '2025-08-11T10:00:00Z',
      };

      const res = await request(app.getHttpServer())
        .post('/consumo-diario')
        .send(dto)
        .expect(400);

      expect(res.body.message).toContain('hospedagemId must be a positive number');
    });

    it('❌ deve falhar se valores negativos forem enviados', async () => {
      const dto: any = {
        hospedagemId: -1,
        produtoId: 2,
        quantidade: -5,
        valorUnitario: -10,
        dataConsumo: '2025-08-11T10:00:00Z',
      };

      const res = await request(app.getHttpServer())
        .post('/consumo-diario')
        .send(dto)
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          'hospedagemId must be a positive number',
          'quantidade must be a positive number',
          'valorUnitario must be a positive number',
        ])
      );
    });
  });
});
