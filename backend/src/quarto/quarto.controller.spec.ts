import { Test, TestingModule } from '@nestjs/testing';
import { QuartoController } from './quarto.controller';
import { QuartoService } from './quarto.service';

describe('QuartoController', () => {
  let controller: QuartoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuartoController],
      providers: [QuartoService],
    }).compile();

    controller = module.get<QuartoController>(QuartoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
