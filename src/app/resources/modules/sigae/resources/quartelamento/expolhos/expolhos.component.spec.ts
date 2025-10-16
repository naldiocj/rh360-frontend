import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtribuidosComponent } from './expolhos.component';

describe('AtribuidosComponent', () => {
  let component: AtribuidosComponent;
  let fixture: ComponentFixture<AtribuidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtribuidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtribuidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
