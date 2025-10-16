import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaDelituosoBiComponent } from './busca-delituoso-bi.component';

describe('BuscaDelituosoBiComponent', () => {
  let component: BuscaDelituosoBiComponent;
  let fixture: ComponentFixture<BuscaDelituosoBiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscaDelituosoBiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscaDelituosoBiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
