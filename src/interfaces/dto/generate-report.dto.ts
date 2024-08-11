export interface GenerateReportDto {
  startDate: string;
  endDate: string;
  format: 'pdf' | 'excel';
}
