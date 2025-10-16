import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInstrutorComponent } from './lista-instrutor.component';

describe('ListaInstrutorComponent', () => {
  let component: ListaInstrutorComponent;
  let fixture: ComponentFixture<ListaInstrutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaInstrutorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInstrutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
