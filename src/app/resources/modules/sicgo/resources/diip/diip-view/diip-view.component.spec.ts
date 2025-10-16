import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiipViewComponent } from './diip-view.component';

describe('DiipViewComponent', () => {
  let component: DiipViewComponent;
  let fixture: ComponentFixture<DiipViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiipViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiipViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
