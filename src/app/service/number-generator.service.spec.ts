import { NumberGeneratorService, MAX_ROWS, GenerationMode } from './number-generator.service';
import { StatisticsService } from './statistics.service';
import { of } from 'rxjs';

describe('NumberGeneratorService', () => {
  let service: NumberGeneratorService;
  let statisticsServiceSpy: jasmine.SpyObj<StatisticsService>;

  beforeEach(() => {
    statisticsServiceSpy = jasmine.createSpyObj('StatisticsService', ['getStatistics']);
    statisticsServiceSpy.getStatistics.and.returnValue(of({
      hotNumbers: [42, 56, 9, 18, 90, 7, 72],
      coldNumbers: [70, 76, 50, 67, 87, 15, 73],
      lastUpdated: new Date()
    }));
    service = new NumberGeneratorService(statisticsServiceSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw for invalid rowCount (0)', async () => {
    await expectAsync(service.generateRows(0)).toBeRejectedWithError(/Row count must be between 1 and/);
  });

  it('should throw for invalid rowCount (greater than MAX_ROWS)', async () => {
    await expectAsync(service.generateRows(MAX_ROWS + 1)).toBeRejectedWithError(/Row count must be between 1 and/);
  });

  it('should generate the requested number of rows in random mode', async () => {
    const rows = await service.generateRows(3, GenerationMode.RANDOM);
    expect(rows.length).toBe(3);
  });

  it('should generate rows with 7 numbers each', async () => {
    const rows = await service.generateRows(2);
    rows.forEach(row => {
      expect(row.length).toBe(7);
    });
  });

  it('should have sorted main numbers in each row', async () => {
    const rows = await service.generateRows(2);
    rows.forEach(row => {
      const main = row.slice(0, 6);
      for (let i = 0; i < main.length - 1; i++) {
        expect(main[i]).toBeLessThan(main[i + 1]);
      }
    });
  });

  it('should have unique main numbers within each row', async () => {
    const rows = await service.generateRows(2);
    rows.forEach(row => {
      const main = row.slice(0, 6);
      expect(new Set(main).size).toBe(6);
    });
  });

  it('should have a superstar different from main numbers in the same row', async () => {
    const rows = await service.generateRows(2);
    rows.forEach(row => {
      const main = row.slice(0, 6);
      expect(main.includes(row[6])).toBeFalse();
    });
  });

  it('should not repeat main numbers across different rows', async () => {
    const rows = await service.generateRows(3);
    const allMainNumbers: number[] = [];

    rows.forEach(row => {
      const main = row.slice(0, 6);
      main.forEach(n => {
        expect(allMainNumbers.includes(n)).toBeFalse();
        allMainNumbers.push(n);
      });
    });

    expect(allMainNumbers.length).toBe(18);
  });

  it('should support generating up to MAX_ROWS rows', async () => {
    const rows = await service.generateRows(MAX_ROWS);
    expect(rows.length).toBe(MAX_ROWS);

    const allMainNumbers = rows.reduce((acc: number[], row: number[]) => acc.concat(row.slice(0, 6)), []);
    expect(new Set(allMainNumbers).size).toBe(allMainNumbers.length);
  });

  it('should call statistics service when using hot mode', async () => {
    await service.generateRows(1, GenerationMode.HOT);
    expect(statisticsServiceSpy.getStatistics).toHaveBeenCalled();
  });

  it('should call statistics service when using cold mode', async () => {
    await service.generateRows(1, GenerationMode.COLD);
    expect(statisticsServiceSpy.getStatistics).toHaveBeenCalled();
  });
});
