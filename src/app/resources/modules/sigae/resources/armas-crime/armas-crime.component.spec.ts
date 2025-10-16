import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasCrimeComponent } from './armas-crime.component';

describe('ArmasCrimeComponent', () => {
  let component: ArmasCrimeComponent;
  let fixture: ComponentFixture<ArmasCrimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasCrimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasCrimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
