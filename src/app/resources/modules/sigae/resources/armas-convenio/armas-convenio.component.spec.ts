import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasConvenioComponent } from './armas-convenio.component';

describe('ArmasConvenioComponent', () => {
  let component: ArmasConvenioComponent;
  let fixture: ComponentFixture<ArmasConvenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasConvenioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
