import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaExpedientesComponent } from './secretaria-expedientes.component';

describe('SecretariaExpedientesComponent', () => {
  let component: SecretariaExpedientesComponent;
  let fixture: ComponentFixture<SecretariaExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretariaExpedientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretariaExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
