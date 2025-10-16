import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSicgoOcorrenciaComponent } from './dashboard-sicgo-ocorrencia.component';

describe('DashboardSicgoOcorrenciaComponent', () => {
  let component: DashboardSicgoOcorrenciaComponent;
  let fixture: ComponentFixture<DashboardSicgoOcorrenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSicgoOcorrenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSicgoOcorrenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
