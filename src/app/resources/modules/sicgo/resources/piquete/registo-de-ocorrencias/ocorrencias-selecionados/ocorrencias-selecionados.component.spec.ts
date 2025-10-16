import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcorrenciasSelecionadosComponent } from './ocorrencias-selecionados.component';

describe('OcorrenciasSelecionadosComponent', () => {
  let component: OcorrenciasSelecionadosComponent;
  let fixture: ComponentFixture<OcorrenciasSelecionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcorrenciasSelecionadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcorrenciasSelecionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
