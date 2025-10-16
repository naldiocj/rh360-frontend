import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTipodebensComponent } from './listar-tipodebens.component';

describe('ListarTipodebensComponent', () => {
  let component: ListarTipodebensComponent;
  let fixture: ComponentFixture<ListarTipodebensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarTipodebensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarTipodebensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
