import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMunicaoComponent } from './listar-municao.component';

describe('ListarMunicaoComponent', () => {
  let component: ListarMunicaoComponent;
  let fixture: ComponentFixture<ListarMunicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarMunicaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarMunicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
