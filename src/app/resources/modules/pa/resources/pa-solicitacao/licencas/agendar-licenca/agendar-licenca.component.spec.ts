import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarLicencaComponent } from './agendar-licenca.component';

describe('AgendarLicencaComponent', () => {
  let component: AgendarLicencaComponent;
  let fixture: ComponentFixture<AgendarLicencaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendarLicencaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarLicencaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
