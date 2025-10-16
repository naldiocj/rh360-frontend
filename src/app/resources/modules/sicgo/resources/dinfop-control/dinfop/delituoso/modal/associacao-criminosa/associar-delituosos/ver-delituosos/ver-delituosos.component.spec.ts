import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDelituososComponent } from './ver-delituosos.component';

describe('VerDelituososComponent', () => {
  let component: VerDelituososComponent;
  let fixture: ComponentFixture<VerDelituososComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerDelituososComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDelituososComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
