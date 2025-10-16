import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipodebensPropriedadeComponent } from './tipodebens-propriedade.component';

describe('TipodebensPropriedadeComponent', () => {
  let component: TipodebensPropriedadeComponent;
  let fixture: ComponentFixture<TipodebensPropriedadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipodebensPropriedadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipodebensPropriedadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
