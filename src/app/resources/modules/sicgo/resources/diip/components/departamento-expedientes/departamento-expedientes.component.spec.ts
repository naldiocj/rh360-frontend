import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoExpedientesComponent } from './departamento-expedientes.component';

describe('DepartamentoExpedientesComponent', () => {
  let component: DepartamentoExpedientesComponent;
  let fixture: ComponentFixture<DepartamentoExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartamentoExpedientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartamentoExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
