import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFormulariosComponent } from './listar-formularios.component';

describe('ListarFormulariosComponent', () => {
  let component: ListarFormulariosComponent;
  let fixture: ComponentFixture<ListarFormulariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarFormulariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarFormulariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
