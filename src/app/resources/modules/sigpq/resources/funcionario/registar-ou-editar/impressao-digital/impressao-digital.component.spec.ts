import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressaoDigitalComponent } from './impressao-digital.component';

describe('ImpressaoDigitalComponent', () => {
  let component: ImpressaoDigitalComponent;
  let fixture: ComponentFixture<ImpressaoDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpressaoDigitalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpressaoDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
