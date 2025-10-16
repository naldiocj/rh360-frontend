import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedenteAssociacaoGruposComponent } from './antecedente-associacao-grupos.component';

describe('AntecedenteAssociacaoGruposComponent', () => {
  let component: AntecedenteAssociacaoGruposComponent;
  let fixture: ComponentFixture<AntecedenteAssociacaoGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntecedenteAssociacaoGruposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntecedenteAssociacaoGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
