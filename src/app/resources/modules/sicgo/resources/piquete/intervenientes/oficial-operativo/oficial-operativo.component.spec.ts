import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficialOperativoComponent } from './oficial-operativo.component';

describe('OficialOperativoComponent', () => {
  let component: OficialOperativoComponent;
  let fixture: ComponentFixture<OficialOperativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OficialOperativoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OficialOperativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
