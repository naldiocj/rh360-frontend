import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaModoOperanteComponent } from './lista-modo-operante.component';

describe('ListaModoOperanteComponent', () => {
  let component: ListaModoOperanteComponent;
  let fixture: ComponentFixture<ListaModoOperanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaModoOperanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaModoOperanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
