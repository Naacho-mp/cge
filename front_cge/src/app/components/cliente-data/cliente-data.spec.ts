import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteData } from './cliente-data';

describe('ClienteData', () => {
  let component: ClienteData;
  let fixture: ComponentFixture<ClienteData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
