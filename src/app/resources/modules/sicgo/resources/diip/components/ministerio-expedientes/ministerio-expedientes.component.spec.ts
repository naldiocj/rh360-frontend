import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterioExpedientesComponent } from './ministerio-expedientes.component';

describe('MinisterioExpedientesComponent', () => {
  let component: MinisterioExpedientesComponent;
  let fixture: ComponentFixture<MinisterioExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinisterioExpedientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinisterioExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
