import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoBiometricoComponent } from './registo-biometrico.component';

describe('RegistoBiometricoComponent', () => {
  let component: RegistoBiometricoComponent;
  let fixture: ComponentFixture<RegistoBiometricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoBiometricoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoBiometricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
