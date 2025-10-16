import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAntecedenteOcorrenciaComponent } from './lista-antecedente-ocorrencia.component';

describe('ListaAntecedenteOcorrenciaComponent', () => {
  let component: ListaAntecedenteOcorrenciaComponent;
  let fixture: ComponentFixture<ListaAntecedenteOcorrenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaAntecedenteOcorrenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAntecedenteOcorrenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
