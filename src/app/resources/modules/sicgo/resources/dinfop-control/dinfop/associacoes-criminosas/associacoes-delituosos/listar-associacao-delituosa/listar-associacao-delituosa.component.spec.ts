import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAssociacaoDelituosaComponent } from './listar-associacao-delituosa.component';

describe('ListarAssociacaoDelituosaComponent', () => {
  let component: ListarAssociacaoDelituosaComponent;
  let fixture: ComponentFixture<ListarAssociacaoDelituosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarAssociacaoDelituosaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAssociacaoDelituosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
