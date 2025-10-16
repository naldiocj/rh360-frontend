import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoAntecedenteComponent } from './registo-antecedente.component';

describe('RegistoAntecedenteComponent', () => {
  let component: RegistoAntecedenteComponent;
  let fixture: ComponentFixture<RegistoAntecedenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoAntecedenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoAntecedenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
