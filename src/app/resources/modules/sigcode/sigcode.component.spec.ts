import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigcodeComponent } from './sigcode.component';

describe('SigcodeComponent', () => {
  let component: SigcodeComponent;
  let fixture: ComponentFixture<SigcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
