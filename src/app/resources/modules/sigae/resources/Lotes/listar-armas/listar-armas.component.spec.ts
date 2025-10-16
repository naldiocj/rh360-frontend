import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarArmasComponent } from './listar-armas.component';

describe('ListarArmasComponent', () => {
  let component: ListarArmasComponent;
  let fixture: ComponentFixture<ListarArmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarArmasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarArmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
