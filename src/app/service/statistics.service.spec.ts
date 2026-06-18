import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatisticsService, Statistics } from './statistics.service';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatisticsService]
    });
    service = TestBed.inject(StatisticsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse statistics from HTML response', async () => {
    const mockHtml = `
      ### The Most Common Drawn Numbers
      - 42
      - 56
      - 9
      - 18
      - 90
      - 7
      - 72

      ### The Least Often Drawn Numbers
      - 70
      - 76
      - 50
      - 67
      - 87
      - 15
      - 73
    `;

    service.getStatistics().subscribe(stats => {
      expect(stats.hotNumbers).toEqual([42, 56, 9, 18, 90, 7, 72]);
      expect(stats.coldNumbers).toEqual([70, 76, 50, 67, 87, 15, 73]);
      expect(stats.lastUpdated).toBeInstanceOf(Date);
    });

    const req = httpTestingController.expectOne('https://lotteryguru.com/italy-lottery-results/it-superenalotto/it-superenalotto-statistics');
    req.flush(mockHtml);
  });

  it('should return fallback statistics on error', async () => {
    service.getStatistics().subscribe(stats => {
      expect(stats.hotNumbers).toContain(42);
      expect(stats.coldNumbers).toContain(70);
      expect(stats.lastUpdated).toBeInstanceOf(Date);
    });

    const req = httpTestingController.expectOne('https://lotteryguru.com/italy-lottery-results/it-superenalotto/it-superenalotto-statistics');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });

  it('should cache statistics for cache duration', async () => {
    const mockHtml = `
      ### The Most Common Drawn Numbers
      - 42
      - 56
      ### The Least Often Drawn Numbers
      - 70
      - 76
    `;

    // First call
    service.getStatistics().subscribe(stats => {
      expect(stats.hotNumbers).toEqual([42, 56]);
    });

    const req1 = httpTestingController.expectOne('https://lotteryguru.com/italy-lottery-results/it-superenalotto/it-superenalotto-statistics');
    req1.flush(mockHtml);

    // Second call should use cache (no HTTP request expected)
    service.getStatistics().subscribe(stats => {
      expect(stats.hotNumbers).toEqual([42, 56]);
    });

    httpTestingController.expectNone('https://lotteryguru.com/italy-lottery-results/it-superenalotto/it-superenalotto-statistics');
  });

  it('should invalidate cache when requested', async () => {
    const mockHtml = `
      ### The Most Common Drawn Numbers
      - 42
      ### The Least Often Drawn Numbers
      - 70
    `;

    // First call
    service.getStatistics().subscribe();
    const req1 = httpTestingController.expectOne('https://lotteryguru.com/italy-lottery-results/it-superenalotto/it-superenalotto-statistics');
    req1.flush(mockHtml);

    // Invalidate cache
    service.invalidateCache();

    // Second call should fetch again
    service.getStatistics().subscribe();
    const req2 = httpTestingController.expectOne('https://lotteryguru.com/italy-lottery-results/it-superenalotto/it-superenalotto-statistics');
    req2.flush(mockHtml);
  });
});
