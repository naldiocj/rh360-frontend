import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaBiometricaComponent } from './busca-biometrica.component';

describe('BuscaBiometricaComponent', () => {
  let component: BuscaBiometricaComponent;
  let fixture: ComponentFixture<BuscaBiometricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscaBiometricaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscaBiometricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
