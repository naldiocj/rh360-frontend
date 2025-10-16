import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrwriteComponent } from './qrwrite.component';

describe('QrwriteComponent', () => {
  let component: QrwriteComponent;
  let fixture: ComponentFixture<QrwriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrwriteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrwriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
