import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitimaModalComponent } from './vitima-modal.component';

describe('VitimaModalComponent', () => {
  let component: VitimaModalComponent;
  let fixture: ComponentFixture<VitimaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitimaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitimaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
