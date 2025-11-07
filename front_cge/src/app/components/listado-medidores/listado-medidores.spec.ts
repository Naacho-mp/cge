import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMedidores } from './listado-medidores';

describe('ListadoMedidores', () => {
  let component: ListadoMedidores;
  let fixture: ComponentFixture<ListadoMedidores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoMedidores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoMedidores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
