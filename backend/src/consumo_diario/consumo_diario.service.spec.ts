import { Test, TestingModule } from '@nestjs/testing';
import { ConsumoDiarioService } from './consumo_diario.service';

describe('ConsumoDiarioService', () => {
  let service: ConsumoDiarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumoDiarioService],
    }).compile();

    service = module.get<ConsumoDiarioService>(ConsumoDiarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
