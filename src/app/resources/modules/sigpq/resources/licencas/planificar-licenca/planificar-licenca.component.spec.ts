import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificarLicencaComponent } from './planificar-licenca.component';

describe('PlanificarLicencaComponent', () => {
  let component: PlanificarLicencaComponent;
  let fixture: ComponentFixture<PlanificarLicencaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanificarLicencaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificarLicencaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
