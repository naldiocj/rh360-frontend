import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoFacialComponent } from './registo-facial.component';

describe('RegistoFacialComponent', () => {
  let component: RegistoFacialComponent;
  let fixture: ComponentFixture<RegistoFacialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoFacialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
