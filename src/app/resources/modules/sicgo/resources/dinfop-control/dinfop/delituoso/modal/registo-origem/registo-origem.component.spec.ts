import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoOrigemComponent } from './registo-origem.component';

describe('RegistoOrigemComponent', () => {
  let component: RegistoOrigemComponent;
  let fixture: ComponentFixture<RegistoOrigemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoOrigemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoOrigemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
