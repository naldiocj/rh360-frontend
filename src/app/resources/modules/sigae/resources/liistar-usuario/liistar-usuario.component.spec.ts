import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiistarUsuarioComponent } from './liistar-usuario.component';

describe('LiistarUsuarioComponent', () => {
  let component: LiistarUsuarioComponent;
  let fixture: ComponentFixture<LiistarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiistarUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiistarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
