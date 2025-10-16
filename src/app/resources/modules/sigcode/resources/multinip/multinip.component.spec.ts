import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultinipComponent } from './multinip.component';

describe('MultinipComponent', () => {
  let component: MultinipComponent;
  let fixture: ComponentFixture<MultinipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultinipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultinipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
