import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarExpedientesComponent } from './listar-expedientes.component';

describe('ListarExpedientesComponent', () => {
  let component: ListarExpedientesComponent;
  let fixture: ComponentFixture<ListarExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarExpedientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
