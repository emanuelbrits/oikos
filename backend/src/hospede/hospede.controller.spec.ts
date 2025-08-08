import { Test, TestingModule } from '@nestjs/testing';
import { HospedeController } from './hospede.controller';
import { HospedeService } from './hospede.service';

describe('HospedeController', () => {
  let controller: HospedeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospedeController],
      providers: [
        {
          provide: HospedeService,
          useValue: {
            criar: jest.fn(),
            listar: jest.fn(),
            buscarPorId: jest.fn(),
            atualizar: jest.fn(),
            deletar: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HospedeController>(HospedeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
