import { Test, TestingModule } from '@nestjs/testing';
import { HospedeController } from './hospede.controller';
import { HospedeService } from './hospede.service';
import { CreateHospedeDto } from './dto/create-hospede.dto';

describe('HospedeController', () => {
  let controller: HospedeController;
  let service: HospedeService;

  const mockHospedeService = {
    buscarPorNome: jest.fn(),
    buscarPorId: jest.fn(),
    criar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospedeController],
      providers: [
        {
          provide: HospedeService,
          useValue: mockHospedeService,
        },
      ],
    }).compile();

    controller = module.get<HospedeController>(HospedeController);
    service = module.get<HospedeService>(HospedeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('buscarPorNome', () => {
    it('deve retornar hóspedes cujo nome contém o termo pesquisado', async () => {
      const resultado = [
        { id: 1, nome: 'João Emanuel' },
        { id: 2, nome: 'Emanuel Brito' },
      ];
      mockHospedeService.buscarPorNome.mockResolvedValue(resultado);

      const nomeBusca = 'emanuel';
      const retorno = await controller.buscarPorNome(nomeBusca);

      expect(service.buscarPorNome).toHaveBeenCalledWith(nomeBusca);
      expect(retorno).toEqual(resultado);
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar hóspede pelo id', async () => {
      const hospede = { id: 1, nome: 'João Emanuel' };
      mockHospedeService.buscarPorId.mockResolvedValue(hospede);

      const retorno = await controller.buscarPorId('1');

      expect(service.buscarPorId).toHaveBeenCalledWith(1);
      expect(retorno).toEqual(hospede);
    });
  });

  describe('criar', () => {
    it('deve criar um novo hóspede', async () => {
      const dto: CreateHospedeDto = {
        nome: 'João Emanuel',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        profissao: 'Programador',
        rua: 'Rua A',
        bairro: 'Centro',
        cidade: 'Cidade X',
        estado: 'XX',
        complemento: 'Apto 101',
      };
      const criado = { id: 1, ...dto };
      mockHospedeService.criar.mockResolvedValue(criado);

      const retorno = await controller.criar(dto);

      expect(service.criar).toHaveBeenCalledWith(dto);
      expect(retorno).toEqual(criado);
    });
  });
});
