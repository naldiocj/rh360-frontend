import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificadorComponent } from './identificador.component';

describe('IdentificadorComponent', () => {
  let component: IdentificadorComponent;
  let fixture: ComponentFixture<IdentificadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentificadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentificadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
