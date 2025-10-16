import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaHistoricoComponent } from './evidencia-historico.component';

describe('EvidenciaHistoricoComponent', () => {
  let component: EvidenciaHistoricoComponent;
  let fixture: ComponentFixture<EvidenciaHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenciaHistoricoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciaHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
