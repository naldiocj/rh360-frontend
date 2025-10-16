import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaCizentaComponent } from './zona-cizenta.component';

describe('ZonaCizentaComponent', () => {
  let component: ZonaCizentaComponent;
  let fixture: ComponentFixture<ZonaCizentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZonaCizentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonaCizentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
