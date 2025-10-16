import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasculinoComponent } from './masculino.component';

describe('MasculinoComponent', () => {
  let component: MasculinoComponent;
  let fixture: ComponentFixture<MasculinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasculinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasculinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
