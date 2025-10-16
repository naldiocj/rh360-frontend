import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesDirecoesPendentesComponent } from './solicitacoes-direcoes-pendentes.component';

describe('SolicitacoesDirecoesPendentesComponent', () => {
  let component: SolicitacoesDirecoesPendentesComponent;
  let fixture: ComponentFixture<SolicitacoesDirecoesPendentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitacoesDirecoesPendentesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacoesDirecoesPendentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
