import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormacaoAcademicaComponent } from './formacao-academica.component';

describe('FormacaoAcademicaComponent', () => {
  let component: FormacaoAcademicaComponent;
  let fixture: ComponentFixture<FormacaoAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormacaoAcademicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormacaoAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
