import { Test, TestingModule } from '@nestjs/testing';
import { HospedagemController } from './hospedagem.controller';
import { HospedagemService } from './hospedagem.service';

describe('HospedagemController', () => {
  let controller: HospedagemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospedagemController],
      providers: [
        {
          provide: HospedagemService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HospedagemController>(HospedagemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
