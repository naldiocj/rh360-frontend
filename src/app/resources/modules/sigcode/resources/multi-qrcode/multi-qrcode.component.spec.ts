import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiQrcodeComponent } from './multi-qrcode.component';

describe('MultiQrcodeComponent', () => {
  let component: MultiQrcodeComponent;
  let fixture: ComponentFixture<MultiQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiQrcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
