import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarExpedienteComponent } from './registar-ou-editar-expediente.component';

describe('RegistarOuEditarExpedienteComponent', () => {
  let component: RegistarOuEditarExpedienteComponent;
  let fixture: ComponentFixture<RegistarOuEditarExpedienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarExpedienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
