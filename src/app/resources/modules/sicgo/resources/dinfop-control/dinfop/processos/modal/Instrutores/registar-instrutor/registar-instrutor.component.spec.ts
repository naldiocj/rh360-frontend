import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarInstrutorComponent } from './registar-instrutor.component';

describe('RegistarInstrutorComponent', () => {
  let component: RegistarInstrutorComponent;
  let fixture: ComponentFixture<RegistarInstrutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarInstrutorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarInstrutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
