import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelituosoPreviewComponent } from './delituoso-preview.component';

describe('DelituosoPreviewComponent', () => {
  let component: DelituosoPreviewComponent;
  let fixture: ComponentFixture<DelituosoPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelituosoPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelituosoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
