import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetidosComponent } from './detidos.component';

describe('DetidosComponent', () => {
  let component: DetidosComponent;
  let fixture: ComponentFixture<DetidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
