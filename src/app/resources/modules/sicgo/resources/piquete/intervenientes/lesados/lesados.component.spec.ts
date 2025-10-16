import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LesadosComponent } from './lesados.component';

describe('LesadosComponent', () => {
  let component: LesadosComponent;
  let fixture: ComponentFixture<LesadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LesadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LesadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
