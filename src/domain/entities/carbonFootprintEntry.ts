export class CarbonFootprintEntry {
  constructor(
    public name: string,
    public value: number,
    public unit: string,
    public date: Date,
  ) {}

  validate() {
    if (!this.name || this.value < 0 || !this.unit || !this.date) {
      throw new Error('Invalid carbon footprint entry');
    }
  }
}
