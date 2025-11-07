import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletaData } from './boleta-data';

describe('BoletaData', () => {
  let component: BoletaData;
  let fixture: ComponentFixture<BoletaData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletaData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletaData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
