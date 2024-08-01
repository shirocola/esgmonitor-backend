// src/application/usecases/addCarbonFootprintEntry.test.ts
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';
import { AddCarbonFootprintEntry } from './addCarbonFootprintEntry';
import { CarbonFootprintRepository } from '../../domain/repositories/carbonFootprintRepository';

describe('AddCarbonFootprintEntry', () => {
  it('should save a valid carbon footprint entry', async () => {
    const repository: CarbonFootprintRepository = {
      save: jest.fn().mockResolvedValueOnce(null),
      findAll: jest.fn().mockResolvedValueOnce([]), // Mock implementation of findAll
    };

    const useCase = new AddCarbonFootprintEntry(repository);
    const entry = new CarbonFootprintEntry(
      'electricity',
      100,
      'kWh',
      new Date(),
    );

    await useCase.execute(entry);

    expect(repository.save).toHaveBeenCalledWith(entry);
  });

  it('should throw an error for an invalid carbon footprint entry', async () => {
    const repository: CarbonFootprintRepository = {
      save: jest.fn(),
      findAll: jest.fn().mockResolvedValueOnce([]), // Mock implementation of findAll
    };

    const useCase = new AddCarbonFootprintEntry(repository);
    const entry = new CarbonFootprintEntry('', -100, 'kWh', new Date());

    await expect(useCase.execute(entry)).rejects.toThrow(
      'Invalid carbon footprint entry',
    );
  });
});
