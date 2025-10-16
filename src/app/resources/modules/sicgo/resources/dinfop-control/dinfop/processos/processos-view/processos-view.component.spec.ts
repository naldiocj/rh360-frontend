import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessosViewComponent } from './processos-view.component';

describe('ProcessosViewComponent', () => {
  let component: ProcessosViewComponent;
  let fixture: ComponentFixture<ProcessosViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessosViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
