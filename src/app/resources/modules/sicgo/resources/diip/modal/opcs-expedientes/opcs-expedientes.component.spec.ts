import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcsExpedientesComponent } from './opcs-expedientes.component';

describe('OpcsExpedientesComponent', () => {
  let component: OpcsExpedientesComponent;
  let fixture: ComponentFixture<OpcsExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcsExpedientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcsExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
