import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssinaturaDigitalComponent } from './assinatura-digital.component';

describe('AssinaturaDigitalComponent', () => {
  let component: AssinaturaDigitalComponent;
  let fixture: ComponentFixture<AssinaturaDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssinaturaDigitalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssinaturaDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
