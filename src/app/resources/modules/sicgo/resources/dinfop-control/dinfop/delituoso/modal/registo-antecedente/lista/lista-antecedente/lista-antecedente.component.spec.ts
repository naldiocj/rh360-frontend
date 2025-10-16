import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAntecedenteComponent } from './lista-antecedente.component';

describe('ListaAntecedenteComponent', () => {
  let component: ListaAntecedenteComponent;
  let fixture: ComponentFixture<ListaAntecedenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaAntecedenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAntecedenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
