import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarComponent } from './registar-ou-editar.component';

describe('RegistarOuEditarComponent', () => {
  let component: RegistarOuEditarComponent;
  let fixture: ComponentFixture<RegistarOuEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
