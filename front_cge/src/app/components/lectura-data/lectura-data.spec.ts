import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaData } from './lectura-data';

describe('LecturaData', () => {
  let component: LecturaData;
  let fixture: ComponentFixture<LecturaData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LecturaData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LecturaData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
