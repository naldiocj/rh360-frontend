import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientesViewComponent } from './expedientes-view.component';

describe('ExpedientesViewComponent', () => {
  let component: ExpedientesViewComponent;
  let fixture: ComponentFixture<ExpedientesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedientesViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpedientesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
