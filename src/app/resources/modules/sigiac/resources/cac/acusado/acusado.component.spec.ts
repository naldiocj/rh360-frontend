import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcusadoComponent } from './acusado.component';

describe('AcusadoComponent', () => {
  let component: AcusadoComponent;
  let fixture: ComponentFixture<AcusadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcusadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcusadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
