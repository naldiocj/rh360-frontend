import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerarPdfComponent } from './gerar-pdf.component';

describe('GerarPdfComponent', () => {
  let component: GerarPdfComponent;
  let fixture: ComponentFixture<GerarPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerarPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerarPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
