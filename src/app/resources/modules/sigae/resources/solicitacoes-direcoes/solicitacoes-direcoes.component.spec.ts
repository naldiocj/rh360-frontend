import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesDirecoesComponent } from './solicitacoes-direcoes.component';

describe('SolicitacoesDirecoesComponent', () => {
  let component: SolicitacoesDirecoesComponent;
  let fixture: ComponentFixture<SolicitacoesDirecoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitacoesDirecoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacoesDirecoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
