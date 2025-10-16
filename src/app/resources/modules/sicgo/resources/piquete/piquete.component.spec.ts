import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiqueteComponent } from './piquete.component';

describe('PiqueteComponent', () => {
  let component: PiqueteComponent;
  let fixture: ComponentFixture<PiqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiqueteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
