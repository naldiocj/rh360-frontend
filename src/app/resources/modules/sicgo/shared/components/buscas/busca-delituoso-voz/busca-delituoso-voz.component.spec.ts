import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaDelituosoVozComponent } from './busca-delituoso-voz.component';

describe('BuscaDelituosoVozComponent', () => {
  let component: BuscaDelituosoVozComponent;
  let fixture: ComponentFixture<BuscaDelituosoVozComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscaDelituosoVozComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscaDelituosoVozComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
