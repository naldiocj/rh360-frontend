import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOrigemComponent } from './lista-origem.component';

describe('ListaOrigemComponent', () => {
  let component: ListaOrigemComponent;
  let fixture: ComponentFixture<ListaOrigemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaOrigemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaOrigemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
