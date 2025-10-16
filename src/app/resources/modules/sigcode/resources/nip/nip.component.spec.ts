import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NipComponent } from './nip.component';

describe('NipComponent', () => {
  let component: NipComponent;
  let fixture: ComponentFixture<NipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
