import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArquivoMidiaComponent } from './arquivo-midia.component';

describe('ArquivoMidiaComponent', () => {
  let component: ArquivoMidiaComponent;
  let fixture: ComponentFixture<ArquivoMidiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArquivoMidiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArquivoMidiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
