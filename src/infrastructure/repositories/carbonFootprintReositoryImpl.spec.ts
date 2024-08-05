import { Test, TestingModule } from '@nestjs/testing';
import { CarbonFootprintRepositoryImpl } from './carbonFootprintRepositoryImpl';
import { CarbonFootprintEntity } from '../orm/carbonFootprintEntity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';

describe('CarbonFootprintRepositoryImpl', () => {
  let carbonFootprintRepository: CarbonFootprintRepositoryImpl;
  let repository: Repository<CarbonFootprintEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarbonFootprintRepositoryImpl,
        {
          provide: getRepositoryToken(CarbonFootprintEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    carbonFootprintRepository = module.get<CarbonFootprintRepositoryImpl>(
      CarbonFootprintRepositoryImpl,
    );
    repository = module.get<Repository<CarbonFootprintEntity>>(
      getRepositoryToken(CarbonFootprintEntity),
    );
  });

  it('should save a carbon footprint entry', async () => {
    const entry = new CarbonFootprintEntry(
      'electricity',
      100,
      'kWh',
      new Date(),
    );

    const mockEntity = { ...entry, id: 1 } as CarbonFootprintEntity;

    const createSpy = jest
      .spyOn(repository, 'create')
      .mockReturnValue(mockEntity);

    const saveSpy = jest
      .spyOn(repository, 'save')
      .mockResolvedValue(mockEntity);

    await carbonFootprintRepository.save(entry);

    expect(createSpy).toHaveBeenCalledWith(entry);
    expect(saveSpy).toHaveBeenCalledWith(mockEntity);
  });

  it('should find all carbon footprint entries', async () => {
    const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([]);
    const result = await carbonFootprintRepository.findAll();
    expect(findSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
