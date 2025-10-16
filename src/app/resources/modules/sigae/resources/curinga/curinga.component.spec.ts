import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuringaComponent } from './curinga.component';

describe('CuringaComponent', () => {
  let component: CuringaComponent;
  let fixture: ComponentFixture<CuringaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuringaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuringaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
