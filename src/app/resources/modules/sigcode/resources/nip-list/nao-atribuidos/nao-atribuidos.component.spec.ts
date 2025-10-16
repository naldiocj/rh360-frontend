import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaoAtribuidosComponent } from './nao-atribuidos.component';

describe('NaoAtribuidosComponent', () => {
  let component: NaoAtribuidosComponent;
  let fixture: ComponentFixture<NaoAtribuidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaoAtribuidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaoAtribuidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
