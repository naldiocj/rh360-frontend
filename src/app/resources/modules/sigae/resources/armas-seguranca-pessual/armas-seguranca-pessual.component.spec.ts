import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasSegurancaPessualComponent } from './armas-seguranca-pessual.component';

describe('ArmasSegurancaPessualComponent', () => {
  let component: ArmasSegurancaPessualComponent;
  let fixture: ComponentFixture<ArmasSegurancaPessualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasSegurancaPessualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasSegurancaPessualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
