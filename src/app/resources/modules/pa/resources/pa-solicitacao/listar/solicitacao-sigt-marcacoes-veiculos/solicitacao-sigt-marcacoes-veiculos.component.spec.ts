import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoSigtMarcacoesVeiculosComponent } from './solicitacao-sigt-marcacoes-veiculos.component';

describe('SolicitacaoSigtMarcacoesVeiculosComponent', () => {
  let component: SolicitacaoSigtMarcacoesVeiculosComponent;
  let fixture: ComponentFixture<SolicitacaoSigtMarcacoesVeiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitacaoSigtMarcacoesVeiculosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacaoSigtMarcacoesVeiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
