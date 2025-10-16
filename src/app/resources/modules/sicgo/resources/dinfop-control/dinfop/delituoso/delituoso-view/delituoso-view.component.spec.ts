import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelituosoViewComponent } from './delituoso-view.component';

describe('DelituosoViewComponent', () => {
  let component: DelituosoViewComponent;
  let fixture: ComponentFixture<DelituosoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelituosoViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelituosoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
