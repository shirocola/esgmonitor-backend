import { GetRealTimeCarbonFootprintData } from './getRealTimeCarbonFootprintData';
import { CarbonFootprintRepository } from '../../domain/repositories/carbonFootprintRepository';
import { CarbonFootprintEntry } from '../../domain/entities/carbonFootprintEntry';

describe('GetRealTimeCarbonFootprintData', () => {
  let getRealTimeCarbonFootprintData: GetRealTimeCarbonFootprintData;
  let carbonFootprintRepository: CarbonFootprintRepository;

  beforeEach(() => {
    carbonFootprintRepository = {
      getRealTimeData: jest.fn(), // Use the correct method name here
    } as unknown as CarbonFootprintRepository;

    getRealTimeCarbonFootprintData = new GetRealTimeCarbonFootprintData(
      carbonFootprintRepository,
    );
  });

  it('should fetch real-time carbon footprint data', async () => {
    const mockData: CarbonFootprintEntry[] = [
      new CarbonFootprintEntry('electricity', 100, 'kWh', new Date()),
    ];

    jest
      .spyOn(carbonFootprintRepository, 'getRealTimeData')
      .mockResolvedValue(mockData);

    const result = await getRealTimeCarbonFootprintData.execute();
    expect(result).toEqual(mockData);
    expect(carbonFootprintRepository.getRealTimeData).toHaveBeenCalled();
  });

  it('should handle errors when fetching real-time data', async () => {
    jest
      .spyOn(carbonFootprintRepository, 'getRealTimeData')
      .mockRejectedValue(new Error('Error fetching data'));

    await expect(getRealTimeCarbonFootprintData.execute()).rejects.toThrow(
      'Failed to fetch real-time data: Error fetching data',
    );
  });
});
