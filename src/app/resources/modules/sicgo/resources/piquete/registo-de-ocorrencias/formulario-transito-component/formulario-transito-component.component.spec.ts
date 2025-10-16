import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioTransitoComponentComponent } from './formulario-transito-component.component';

describe('FormularioTransitoComponentComponent', () => {
  let component: FormularioTransitoComponentComponent;
  let fixture: ComponentFixture<FormularioTransitoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioTransitoComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioTransitoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
