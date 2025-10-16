import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaosBiometricoComponent } from './maos-biometrico.component';

describe('MaosBiometricoComponent', () => {
  let component: MaosBiometricoComponent;
  let fixture: ComponentFixture<MaosBiometricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaosBiometricoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaosBiometricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
