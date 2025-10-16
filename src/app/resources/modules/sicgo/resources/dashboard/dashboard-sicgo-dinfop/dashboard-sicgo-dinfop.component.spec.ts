import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSicgoDinfopComponent } from './dashboard-sicgo-dinfop.component';

describe('DashboardSicgoDinfopComponent', () => {
  let component: DashboardSicgoDinfopComponent;
  let fixture: ComponentFixture<DashboardSicgoDinfopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSicgoDinfopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSicgoDinfopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
