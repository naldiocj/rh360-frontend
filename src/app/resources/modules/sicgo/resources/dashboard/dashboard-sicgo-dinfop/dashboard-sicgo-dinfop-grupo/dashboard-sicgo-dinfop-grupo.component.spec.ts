import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSicgoDinfopGrupoComponent } from './dashboard-sicgo-dinfop-grupo.component';

describe('DashboardSicgoDinfopGrupoComponent', () => {
  let component: DashboardSicgoDinfopGrupoComponent;
  let fixture: ComponentFixture<DashboardSicgoDinfopGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSicgoDinfopGrupoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSicgoDinfopGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
