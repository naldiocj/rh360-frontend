import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioOcorrenciasComponent } from './relatorio-ocorrencias.component';

describe('RelatorioOcorrenciasComponent', () => {
  let component: RelatorioOcorrenciasComponent;
  let fixture: ComponentFixture<RelatorioOcorrenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatorioOcorrenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioOcorrenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
