import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarGuiaComponent } from './listar-guia.component';

describe('ListarGuiaComponent', () => {
  let component: ListarGuiaComponent;
  let fixture: ComponentFixture<ListarGuiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarGuiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarGuiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
