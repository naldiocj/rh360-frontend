import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAssociacaoGruposComponent } from './listar-associacao-grupos.component';

describe('ListarAssociacaoGruposComponent', () => {
  let component: ListarAssociacaoGruposComponent;
  let fixture: ComponentFixture<ListarAssociacaoGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarAssociacaoGruposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAssociacaoGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
