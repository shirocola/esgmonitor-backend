// src/domain/entities/carbonFootprintEntry.test.ts
import { CarbonFootprintEntry } from './carbonFootprintEntry';

describe('CarbonFootprintEntry', () => {
  it('should create a valid CarbonFootprintEntry instance', () => {
    const entry = new CarbonFootprintEntry(
      'electricity',
      100,
      'kWh',
      new Date(),
    );
    expect(entry).toBeInstanceOf(CarbonFootprintEntry);
    expect(entry.name).toBe('electricity');
    expect(entry.value).toBe(100);
    expect(entry.unit).toBe('kWh');
  });
});
