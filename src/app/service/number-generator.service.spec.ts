import { NumberGeneratorService, MAX_ROWS } from './number-generator.service';

describe('NumberGeneratorService', () => {
  let service: NumberGeneratorService;

  beforeEach(() => {
    service = new NumberGeneratorService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw for invalid rowCount (0)', () => {
    expect(() => service.generateRows(0)).toThrowError(/Row count must be between 1 and/);
  });

  it('should throw for invalid rowCount (greater than MAX_ROWS)', () => {
    expect(() => service.generateRows(MAX_ROWS + 1)).toThrowError(/Row count must be between 1 and/);
  });

  it('should generate the requested number of rows', () => {
    const rows = service.generateRows(3);
    expect(rows.length).toBe(3);
  });

  it('should generate rows with 7 numbers each', () => {
    const rows = service.generateRows(2);
    rows.forEach(row => {
      expect(row.length).toBe(7);
    });
  });

  it('should have sorted main numbers in each row', () => {
    const rows = service.generateRows(2);
    rows.forEach(row => {
      const main = row.slice(0, 6);
      for (let i = 0; i < main.length - 1; i++) {
        expect(main[i]).toBeLessThan(main[i + 1]);
      }
    });
  });

  it('should have unique main numbers within each row', () => {
    const rows = service.generateRows(2);
    rows.forEach(row => {
      const main = row.slice(0, 6);
      expect(new Set(main).size).toBe(6);
    });
  });

  it('should have a superstar different from main numbers in the same row', () => {
    const rows = service.generateRows(2);
    rows.forEach(row => {
      const main = row.slice(0, 6);
      expect(main.includes(row[6])).toBeFalse();
    });
  });

  it('should not repeat main numbers across different rows', () => {
    const rows = service.generateRows(3);
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

  it('should support generating up to MAX_ROWS rows', () => {
    const rows = service.generateRows(MAX_ROWS);
    expect(rows.length).toBe(MAX_ROWS);

    const allMainNumbers = rows.reduce((acc: number[], row: number[]) => acc.concat(row.slice(0, 6)), []);
    expect(new Set(allMainNumbers).size).toBe(allMainNumbers.length);
  });
});
