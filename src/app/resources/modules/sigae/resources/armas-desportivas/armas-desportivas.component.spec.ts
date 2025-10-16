import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasDesportivasComponent } from './armas-desportivas.component';

describe('ArmasDesportivasComponent', () => {
  let component: ArmasDesportivasComponent;
  let fixture: ComponentFixture<ArmasDesportivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasDesportivasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasDesportivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
