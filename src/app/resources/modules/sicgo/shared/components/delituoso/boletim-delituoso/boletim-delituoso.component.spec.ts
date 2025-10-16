import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletimDelituosoComponent } from './boletim-delituoso.component';

describe('BoletimDelituosoComponent', () => {
  let component: BoletimDelituosoComponent;
  let fixture: ComponentFixture<BoletimDelituosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoletimDelituosoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletimDelituosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
