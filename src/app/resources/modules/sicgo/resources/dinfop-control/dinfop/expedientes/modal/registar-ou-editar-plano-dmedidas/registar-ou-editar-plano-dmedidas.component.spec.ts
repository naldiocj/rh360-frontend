import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarPlanoDmedidasComponent } from './registar-ou-editar-plano-dmedidas.component';

describe('RegistarOuEditarPlanoDmedidasComponent', () => {
  let component: RegistarOuEditarPlanoDmedidasComponent;
  let fixture: ComponentFixture<RegistarOuEditarPlanoDmedidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarPlanoDmedidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarPlanoDmedidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
