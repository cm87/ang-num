import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { NumberGeneratorService, MAX_ROWS } from '../../service/number-generator.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let numberGeneratorSpy: jasmine.SpyObj<NumberGeneratorService>;

  beforeEach(async () => {
    numberGeneratorSpy = jasmine.createSpyObj('NumberGeneratorService', ['generateRows']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [DashboardComponent],
      providers: [
        { provide: NumberGeneratorService, useValue: numberGeneratorSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default rowCount to 2 and maxRows to MAX_ROWS', () => {
    expect(component.rowCount).toBe(2);
    expect(component.maxRows).toBe(MAX_ROWS);
  });

  it('should call service generateRows with rowCount and populate numberList', () => {
    const mockRows = [
      [1, 2, 3, 4, 5, 6, 7],
      [10, 11, 12, 13, 14, 15, 16]
    ];
    numberGeneratorSpy.generateRows.and.returnValue(mockRows);

    component.rowCount = 2;
    component.generate();

    expect(numberGeneratorSpy.generateRows).toHaveBeenCalledWith(2);
    expect(component.numberList).toEqual(mockRows);
  });

  it('should support generating a different number of rows', () => {
    const mockRows = [[1, 2, 3, 4, 5, 6, 7]];
    numberGeneratorSpy.generateRows.and.returnValue(mockRows);

    component.rowCount = 1;
    component.generate();

    expect(numberGeneratorSpy.generateRows).toHaveBeenCalledWith(1);
    expect(component.numberList).toEqual(mockRows);
  });

  it('should clear the number list', () => {
    component.numberList = [[1, 2, 3, 4, 5, 6, 7]];
    component.clear();
    expect(component.numberList.length).toBe(0);
  });
});
