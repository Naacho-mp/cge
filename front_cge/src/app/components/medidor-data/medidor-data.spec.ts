import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedidorData } from './medidor-data';

describe('MedidorData', () => {
  let component: MedidorData;
  let fixture: ComponentFixture<MedidorData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedidorData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedidorData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
