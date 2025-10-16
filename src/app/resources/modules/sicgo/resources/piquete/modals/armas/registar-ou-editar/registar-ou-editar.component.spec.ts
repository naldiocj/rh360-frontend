import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarArmaComponent } from './registar-ou-editar.component';

describe('RegistarOuEditarArmaComponent', () => {
  let component: RegistarOuEditarArmaComponent;
  let fixture: ComponentFixture<RegistarOuEditarArmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarArmaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarArmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
