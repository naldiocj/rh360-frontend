import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspandirDataComponent } from './espandir-data.component';

describe('EspandirDataComponent', () => {
  let component: EspandirDataComponent;
  let fixture: ComponentFixture<EspandirDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspandirDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspandirDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
