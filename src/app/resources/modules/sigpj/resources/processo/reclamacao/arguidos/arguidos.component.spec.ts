import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArguidosComponent } from './arguidos.component';

describe('ArguidosComponent', () => {
  let component: ArguidosComponent;
  let fixture: ComponentFixture<ArguidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArguidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArguidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
