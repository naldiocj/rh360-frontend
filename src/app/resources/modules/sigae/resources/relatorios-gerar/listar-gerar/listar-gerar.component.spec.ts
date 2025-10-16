import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarGerarComponent } from './listar-gerar.component';

describe('ListarGerarComponent', () => {
  let component: ListarGerarComponent;
  let fixture: ComponentFixture<ListarGerarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarGerarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarGerarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
