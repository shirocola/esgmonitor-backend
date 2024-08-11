import { CarbonFootprintEntry } from '../../domain/entities/carbon-footprint-entry.entity';
import { AddCarbonFootprintEntry } from './add-carbon-footprint-entry.usecase';
import { CarbonFootprintRepository } from '../../domain/repositories/carbon-footprint.repository';

describe('AddCarbonFootprintEntry', () => {
  let repository: CarbonFootprintRepository;
  let useCase: AddCarbonFootprintEntry;

  beforeEach(() => {
    repository = {
      save: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([]),
      getRealTimeData: jest.fn().mockResolvedValue([]),
    };
    useCase = new AddCarbonFootprintEntry(repository);
  });

  it('should save a valid carbon footprint entry', async () => {
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
    const entry = new CarbonFootprintEntry('', -100, 'kWh', new Date());

    await expect(useCase.execute(entry)).rejects.toThrow(
      'Invalid carbon footprint entry',
    );
  });

  it('should log a message after successfully saving an entry', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const entry = new CarbonFootprintEntry(
      'electricity',
      100,
      'kWh',
      new Date(),
    );

    await useCase.execute(entry);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Carbon footprint entry saved:'),
    );

    consoleSpy.mockRestore();
  });

  it('should handle errors during saving gracefully', async () => {
    const entry = new CarbonFootprintEntry(
      'electricity',
      100,
      'kWh',
      new Date(),
    );
    jest
      .spyOn(repository, 'save')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(useCase.execute(entry)).rejects.toThrow('Database error');
  });
});
