import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesDirecoesHistoricosComponent } from './solicitacoes-direcoes-historicos.component';

describe('SolicitacoesDirecoesHistoricosComponent', () => {
  let component: SolicitacoesDirecoesHistoricosComponent;
  let fixture: ComponentFixture<SolicitacoesDirecoesHistoricosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitacoesDirecoesHistoricosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacoesDirecoesHistoricosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
