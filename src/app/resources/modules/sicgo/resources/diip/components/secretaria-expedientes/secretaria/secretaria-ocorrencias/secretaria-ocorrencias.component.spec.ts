import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariaOcorrenciasComponent } from './secretaria-ocorrencias.component';

describe('SecretariaOcorrenciasComponent', () => {
  let component: SecretariaOcorrenciasComponent;
  let fixture: ComponentFixture<SecretariaOcorrenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretariaOcorrenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretariaOcorrenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
