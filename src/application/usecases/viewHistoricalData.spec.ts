import { ViewHistoricalData } from './viewHistoricalData';
import { CarbonFootprintRepository } from '../../domain/repositories/carbonFootprintRepository';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';

describe('ViewHistoricalData Use Case', () => {
  let viewHistoricalData: ViewHistoricalData;
  let repository: CarbonFootprintRepository;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      save: jest.fn(),
    } as unknown as CarbonFootprintRepository;
    viewHistoricalData = new ViewHistoricalData(repository);
  });

  it('should retrieve historical data', async () => {
    const mockData = [
      new CarbonFootprintEntry(
        'electricity',
        100,
        'kWh',
        new Date('2023-07-01'),
      ),
      new CarbonFootprintEntry('gas', 200, 'm3', new Date('2023-08-01')),
    ];
    jest.spyOn(repository, 'findAll').mockResolvedValue(mockData);

    const data = await viewHistoricalData.execute();

    expect(data).toEqual(mockData);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should filter data by date range', async () => {
    const mockData = [
      new CarbonFootprintEntry(
        'electricity',
        100,
        'kWh',
        new Date('2023-07-01'),
      ),
      new CarbonFootprintEntry('gas', 200, 'm3', new Date('2023-08-01')),
    ];
    jest.spyOn(repository, 'findAll').mockResolvedValue(mockData);

    const filterData = await viewHistoricalData.execute(
      new Date('2023-07-01'),
      new Date('2023-07-31'),
    );

    expect(filterData).toEqual([mockData[0]]);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should handle data retrieval errors', async () => {
    jest
      .spyOn(repository, 'findAll')
      .mockRejectedValue(new Error('Failed to retrieve data'));

    await expect(viewHistoricalData.execute()).rejects.toThrow(
      'Failed to retrieve data',
    );
  });
});
