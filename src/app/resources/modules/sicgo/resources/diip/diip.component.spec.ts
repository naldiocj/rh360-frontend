import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiipComponent } from './diip.component';

describe('DiipComponent', () => {
  let component: DiipComponent;
  let fixture: ComponentFixture<DiipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
