import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaFacialDelituosoComponent } from './busca-facial-delituoso.component';

describe('BuscaFacialDelituosoComponent', () => {
  let component: BuscaFacialDelituosoComponent;
  let fixture: ComponentFixture<BuscaFacialDelituosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscaFacialDelituosoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscaFacialDelituosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
