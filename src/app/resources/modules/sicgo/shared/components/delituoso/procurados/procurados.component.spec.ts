import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcuradosComponent } from './procurados.component';

describe('ProcuradosComponent', () => {
  let component: ProcuradosComponent;
  let fixture: ComponentFixture<ProcuradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcuradosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcuradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
