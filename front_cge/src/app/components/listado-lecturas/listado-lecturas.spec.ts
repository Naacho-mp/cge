import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoLecturas } from './listado-lecturas';

describe('ListadoLecturas', () => {
  let component: ListadoLecturas;
  let fixture: ComponentFixture<ListadoLecturas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoLecturas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoLecturas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
