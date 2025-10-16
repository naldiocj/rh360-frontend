import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiqueteViewComponent } from './piquete-view.component';

describe('PiqueteViewComponent', () => {
  let component: PiqueteViewComponent;
  let fixture: ComponentFixture<PiqueteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiqueteViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiqueteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
