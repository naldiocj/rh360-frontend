import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEvidenciaComponent } from './listar-evidencia.component';

describe('ListarEvidenciaComponent', () => {
  let component: ListarEvidenciaComponent;
  let fixture: ComponentFixture<ListarEvidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarEvidenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
