import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervenientesComponent } from './intervenientes.component';

describe('IntervenientesComponent', () => {
  let component: IntervenientesComponent;
  let fixture: ComponentFixture<IntervenientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervenientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervenientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
