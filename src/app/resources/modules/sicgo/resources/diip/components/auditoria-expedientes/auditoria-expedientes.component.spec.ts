import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaExpedientesComponent } from './auditoria-expedientes.component';

describe('AuditoriaExpedientesComponent', () => {
  let component: AuditoriaExpedientesComponent;
  let fixture: ComponentFixture<AuditoriaExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaExpedientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
